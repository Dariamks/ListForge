"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowRight, Check, Copy, Columns3, Loader2, Mail, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/categories";
import type { OptimizedListing, Platform, VariantStyle } from "@/lib/listing-prompts";
import {
  type HistoryItem,
  appendHistory,
  clearHistory,
  loadHistory,
  removeHistoryItem,
} from "@/lib/history";
import { readNdjson } from "@/lib/stream-client";
import { HistoryPanel } from "@/components/HistoryPanel";
import { TurnstileWidget } from "@/components/TurnstileWidget";

/** Partial listing during streaming — every field is optional until the chunk for it arrives. */
type PartialListing = Partial<OptimizedListing>;

/** Per-variant streaming state. */
type VariantState = {
  partial: PartialListing;
  done: boolean;
  error: string | null;
};

type CountMetric = "chars" | "bytes";

type LimitStatus = "empty" | "short" | "ok" | "over";

type FieldLimit = {
  min?: number;
  max: number;
  metric: CountMetric;
};

/** NDJSON line shape from `/api/optimize`. */
type StreamLine =
  | { meta: { platform: Platform; count: number } }
  | { idx: number; partial: PartialListing }
  | { idx: number; done: true }
  | { idx: number; error: string };

const EMPTY_VARIANT: VariantState = { partial: {}, done: false, error: null };
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const MARKET_OPTIONS = [
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Australia", label: "Australia / New Zealand" },
  { value: "Canada", label: "Canada" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "Other (US default)", label: "Other (US default)" },
] as const;

const FORM_DRAFT_VERSION = 1;
const VARIANT_STYLES: VariantStyle[] = ["conservative", "balanced", "creative"];
const FIELD_LIMITS: Record<
  Platform,
  {
    title: FieldLimit;
    bullet: FieldLimit;
    backendKeywords: FieldLimit;
  }
> = {
  amazon: {
    title: { min: 150, max: 200, metric: "chars" },
    bullet: { min: 150, max: 250, metric: "chars" },
    backendKeywords: { max: 249, metric: "bytes" },
  },
  "tiktok-shop": {
    title: { min: 60, max: 100, metric: "chars" },
    bullet: { min: 60, max: 110, metric: "chars" },
    backendKeywords: { max: 249, metric: "bytes" },
  },
  shopify: {
    title: { min: 60, max: 90, metric: "chars" },
    bullet: { min: 80, max: 180, metric: "chars" },
    backendKeywords: { max: 249, metric: "bytes" },
  },
};

function isCompleteListing(p: PartialListing): p is OptimizedListing {
  return (
    typeof p.title === "string" &&
    Array.isArray(p.bullets) &&
    p.bullets.length === 5 &&
    typeof p.description === "string" &&
    typeof p.backendKeywords === "string" &&
    Array.isArray(p.seoKeywords)
  );
}

function formatFullListing(listing: PartialListing): string {
  const lines = [
    `TITLE: ${listing.title ?? ""}`,
    "",
    "BULLETS:",
    ...(Array.isArray(listing.bullets)
      ? listing.bullets.map((bullet, index) => `${index + 1}. ${bullet}`)
      : []),
    "",
    `DESCRIPTION: ${listing.description ?? ""}`,
    "",
    `BACKEND KEYWORDS: ${listing.backendKeywords ?? ""}`,
  ];
  return lines.join("\n").trim();
}

function countValue(value: string, metric: CountMetric): number {
  if (metric === "bytes") return new TextEncoder().encode(value).length;
  return Array.from(value).length;
}

function getLimitStatus(value: string, limit?: FieldLimit): LimitStatus {
  if (!limit || value.length === 0) return value.length === 0 ? "empty" : "ok";
  const count = countValue(value, limit.metric);
  if (count > limit.max) return "over";
  if (limit.min && count < limit.min) return "short";
  return "ok";
}

interface Props {
  platform: Platform;
  defaultCategory?: string;
}

export function ListingOptimizer({ platform, defaultCategory }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const defaultCategoryValue = defaultCategory ?? CATEGORIES[0].slug;
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(defaultCategoryValue);
  const [customCategory, setCustomCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [keywords, setKeywords] = useState("");
  const [targetMarket, setTargetMarket] = useState("United States");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const [streamStates, setStreamStates] = useState<VariantState[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Used to abort an in-flight stream when the user submits again or unmounts.
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Anchor for mobile auto-scroll: on small viewports the result panel sits
  // below the form, so a fresh submit needs to scroll the user to it or they
  // miss the streaming output entirely.
  const resultAnchorRef = useRef<HTMLDivElement | null>(null);

  const isStreaming =
    isPending && streamStates.length > 0 && streamStates.some((s) => !s.done && !s.error);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const draftKey = `listforge:v${FORM_DRAFT_VERSION}:form:${platform}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<{
        productName: string;
        brand: string;
        category: string;
        customCategory: string;
        features: string;
        keywords: string;
        targetMarket: string;
      }>;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProductName(draft.productName ?? "");
      setBrand(draft.brand ?? "");
      setCategory(draft.category ?? defaultCategoryValue);
      setCustomCategory(draft.customCategory ?? "");
      setFeatures(draft.features ?? "");
      setKeywords(draft.keywords ?? "");
      setTargetMarket(draft.targetMarket ?? "United States");
    } catch {}
  }, [defaultCategoryValue, draftKey]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          draftKey,
          JSON.stringify({
            productName,
            brand,
            category,
            customCategory,
            features,
            keywords,
            targetMarket,
          })
        );
      } catch {}
    }, 400);
    return () => window.clearTimeout(id);
  }, [
    brand,
    category,
    customCategory,
    draftKey,
    features,
    keywords,
    productName,
    targetMarket,
  ]);

  // Hydrate history from localStorage after mount. Cannot read on server
  // (no window) and cannot use lazy initial state without causing a
  // hydration mismatch — useEffect is the canonical pattern here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory().filter((it) => it.platform === platform));
  }, [platform]);

  function handleRestore(item: HistoryItem) {
    // Restoring a saved listing should also stop any in-flight stream so its
    // chunks don't overwrite what the user just chose to load.
    abortRef.current?.abort();
    setStreamStates(
      item.variants.map((v) => ({ partial: v, done: true, error: null }))
    );
    setActiveIdx(0);
    setError(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  function handleRemove(id: string) {
    const next = removeHistoryItem(id).filter((it) => it.platform === platform);
    setHistory(next);
  }

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const categoryLabel = useMemo(() => {
    if (category === "custom") return customCategory.trim();
    const cat = CATEGORIES.find((c) => c.slug === category);
    return cat?.label ?? category;
  }, [category, customCategory]);

  function buildPayload(variants: 1 | 3, variantStyle?: VariantStyle) {
    return {
      platform,
      productName: productName.trim(),
      category: categoryLabel,
      brand: brand.trim() || undefined,
      features: features.trim(),
      keywords: keywords.trim() || undefined,
      targetMarket:
        targetMarket === "Other (US default)" ? "United States" : targetMarket,
      variants,
      variantStyle,
      turnstileToken: turnstileToken || undefined,
    };
  }

  function validatePayload(payload: ReturnType<typeof buildPayload>) {
    if (!payload.productName || !payload.category || !payload.features) {
      return "Product name, category, and feature notes are required.";
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      return "Please complete the bot check before generating.";
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Abort any in-flight stream before starting a new one, otherwise
    // chunks from the old request can race with the new state.
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setError(null);
    setStreamStates([]);
    setActiveIdx(0);

    // On narrow viewports (single column), bring the result panel into view so
    // the user actually sees the stream populate. Defer to next frame so the
    // panel has rendered the "connecting..." card before we scroll.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => {
        resultAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const payload = buildPayload(3);
    const validationError = validatePayload(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });

        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          const mins = Math.ceil((data?.resetMs ?? 0) / 60000);
          setError(
            `Free hourly limit reached on this network. Please try again in ${mins || "a few"} minutes.`
          );
          return;
        }
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error ?? `Request failed (${res.status})`);
        }

        // Local accumulator — React batches setState anyway, but we also need
        // the final accumulated state to write to history.
        let states: VariantState[] = [];

        for await (const line of readNdjson<StreamLine>(res.body)) {
          if ("meta" in line) {
            states = Array.from({ length: line.meta.count }, () => ({ ...EMPTY_VARIANT }));
            setStreamStates(states);
            continue;
          }
          if (!("idx" in line) || line.idx < 0 || line.idx >= states.length) continue;

          const cur = states[line.idx];
          if ("error" in line) {
            states[line.idx] = { ...cur, error: line.error, done: true };
          } else if ("done" in line) {
            states[line.idx] = { ...cur, done: true };
          } else if ("partial" in line) {
            states[line.idx] = { ...cur, partial: line.partial };
          }
          // Replace the array reference so React re-renders.
          setStreamStates([...states]);
        }

        // After stream closes, persist any fully-completed variants to history.
        const completed = states
          .map((s) => s.partial)
          .filter(isCompleteListing);
        if (completed.length > 0) {
          const item: HistoryItem = {
            id:
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            ts: Date.now(),
            platform,
            productName: payload.productName,
            category: payload.category,
            variants: completed,
          };
          const next = appendHistory(item).filter((it) => it.platform === platform);
          setHistory(next);
        }
        setTurnstileResetSignal((n) => n + 1);
      } catch (err) {
        // Abort is expected (user submitted again or navigated) — don't show
        // it as an error.
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (ctrl.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setTurnstileResetSignal((n) => n + 1);
      }
    });
  }

  async function handleRegenerateVariant(idx: number) {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const payload = buildPayload(1, VARIANT_STYLES[idx] ?? "balanced");
    const validationError = validatePayload(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStreamStates((prev) =>
      prev.map((state, i) =>
        i === idx ? { partial: {}, done: false, error: null } : state
      )
    );

    startTransition(async () => {
      try {
        const res = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error ?? `Request failed (${res.status})`);
        }

        let regenerated: PartialListing = {};
        for await (const line of readNdjson<StreamLine>(res.body)) {
          if (!("idx" in line)) continue;
          if ("error" in line) {
            setStreamStates((prev) =>
              prev.map((state, i) =>
                i === idx ? { ...state, error: line.error, done: true } : state
              )
            );
          } else if ("done" in line) {
            setStreamStates((prev) =>
              prev.map((state, i) =>
                i === idx ? { ...state, done: true } : state
              )
            );
          } else if ("partial" in line) {
            regenerated = line.partial;
            setStreamStates((prev) =>
              prev.map((state, i) =>
                i === idx ? { ...state, partial: regenerated } : state
              )
            );
          }
        }
        setTurnstileResetSignal((n) => n + 1);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (ctrl.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setTurnstileResetSignal((n) => n + 1);
      }
    });
  }

  async function handleWaitlistSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: waitlistEmail.trim(),
          platform,
          productName: productName.trim() || undefined,
          turnstileToken: turnstileToken || undefined,
        }),
      });
      if (!res.ok) throw new Error("Waitlist request failed");
      setWaitlistStatus("done");
      setWaitlistEmail("");
      setTurnstileResetSignal((n) => n + 1);
    } catch {
      setWaitlistStatus("error");
      setTurnstileResetSignal((n) => n + 1);
    }
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
            Step 1
          </div>
          <CardTitle className="text-2xl">Your product</CardTitle>
          <CardDescription>
            Drop in raw notes — bullet points, half-thoughts, even Chinese / English mixed are fine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="productName">Product name *</Label>
              <Input
                id="productName"
                placeholder="e.g. Stainless steel garlic press"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand (optional)</Label>
                <Input
                  id="brand"
                  placeholder="e.g. KitchenForge"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-lg border border-stone-200 bg-white bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a8a29e%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[position:right_0.85rem_center] bg-no-repeat px-3.5 pr-9 text-sm text-stone-900 transition-colors focus-visible:border-stone-900 focus-visible:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:focus-visible:border-stone-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                  <option value="custom">Custom category…</option>
                </select>
              </div>
            </div>

            {category === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor="customCategory">Custom category *</Label>
                <Input
                  id="customCategory"
                  placeholder="e.g. Power tools, toys, electronics"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="features">Features / notes *</Label>
              <Textarea
                id="features"
                placeholder={`- Stainless steel 304\n- Easy-clean removable insert\n- Crushes garlic without peeling first\n- Comfortable rubberized grip`}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={7}
                required
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="keywords">Seed keywords (optional)</Label>
                <Input
                  id="keywords"
                  placeholder="garlic press, mincer, kitchen"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="market">Target market</Label>
                <select
                  id="market"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-lg border border-stone-200 bg-white bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a8a29e%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[position:right_0.85rem_center] bg-no-repeat px-3.5 pr-9 text-sm text-stone-900 transition-colors focus-visible:border-stone-900 focus-visible:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:focus-visible:border-stone-100"
                >
                  {MARKET_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <TurnstileWidget
              siteKey={TURNSTILE_SITE_KEY}
              action="optimize"
              resetSignal={turnstileResetSignal}
              onToken={handleTurnstileToken}
            />

            {error && (
              <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900/40">
                <p className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                    aria-hidden
                  />
                  {error}
                </p>
                {error.toLowerCase().includes("limit") && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="Email me when it refreshes"
                      value={waitlistEmail}
                      onChange={(e) => {
                        setWaitlistEmail(e.target.value);
                        setWaitlistStatus("idle");
                      }}
                      aria-label="Email for quota refresh reminder"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleWaitlistSubmit()}
                      disabled={waitlistStatus === "submitting"}
                      className="shrink-0"
                    >
                      {waitlistStatus === "submitting" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                      Remind me
                    </Button>
                  </div>
                )}
                {waitlistStatus === "done" && (
                  <p className="text-xs text-stone-500">Saved. We will send a quota refresh reminder.</p>
                )}
                {waitlistStatus === "error" && (
                  <p className="text-xs text-stone-500">Could not save that email. Please try again.</p>
                )}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Streaming 3 variants…
                </>
              ) : (
                <>
                  Generate 3 variants
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-stone-500 dark:text-stone-500">
              Free for everyone. 3 alternative listings per click, rate-limited per IP. No signup.
            </p>
          </form>
        </CardContent>
      </Card>

      <div ref={resultAnchorRef} className="scroll-mt-4">
        <ResultPanel
          platform={platform}
          states={streamStates}
          activeIdx={activeIdx}
          onSelect={setActiveIdx}
          isPending={isPending}
          isStreaming={isStreaming}
          onRegenerate={handleRegenerateVariant}
        />
      </div>
      </div>

      <HistoryPanel
        items={history}
        onSelect={handleRestore}
        onClear={handleClear}
        onRemove={handleRemove}
      />
    </>
  );
}

const VARIANT_LABELS = ["A · Conservative", "B · Balanced", "C · Creative"];

function ResultPanel({
  platform,
  states,
  activeIdx,
  onSelect,
  isPending,
  isStreaming,
  onRegenerate,
}: {
  platform: Platform;
  states: VariantState[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  isPending: boolean;
  isStreaming: boolean;
  onRegenerate: (idx: number) => void;
}) {
  const [viewMode, setViewMode] = useState<"single" | "compare">("single");
  const [copiedFull, setCopiedFull] = useState(false);

  // Initial pending state before the first NDJSON line lands ("meta" arrives
  // immediately, but if the network is slow the user sees this for ~500ms).
  if (isPending && states.length === 0) {
    return (
      <Card className="grid place-items-center text-center">
        <CardContent className="py-24">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-stone-500" />
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-500">
            Connecting to the model…
          </p>
        </CardContent>
      </Card>
    );
  }

  if (states.length === 0) {
    return (
      <Card className="grid place-items-center text-center">
        <CardContent className="py-24">
          <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
            Step 2
          </div>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-500">
            Your 3 listing variants will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const active = states[activeIdx] ?? states[0];
  const partial = active.partial;
  const bullets = Array.isArray(partial.bullets) ? partial.bullets : [];
  const seoKeywords = Array.isArray(partial.seoKeywords) ? partial.seoKeywords : [];
  const canCopyFull = Boolean(partial.title || bullets.length || partial.description);

  async function copyFullListing() {
    if (!canCopyFull) return;
    try {
      await navigator.clipboard.writeText(formatFullListing(partial));
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 1500);
    } catch {}
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isStreaming ? "animate-pulse bg-[var(--accent)]" : "bg-stone-400"
            }`}
            aria-hidden
          />
          {isStreaming ? "Streaming" : "Step 2"}
        </div>
        <CardTitle className="text-2xl">Optimized listings</CardTitle>
        <CardDescription>
          {isStreaming
            ? "Watching the model write all 3 variants in parallel…"
            : "3 alternatives — pick the one that fits, then copy."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <div
            role="tablist"
            aria-label="Result view"
            className="grid grid-cols-2 rounded-lg border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-900"
          >
            {[
              { value: "single", label: "Single" },
              { value: "compare", label: "Compare all" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={viewMode === option.value}
                onClick={() => setViewMode(option.value as "single" | "compare")}
                className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                  viewMode === option.value
                    ? "bg-white text-stone-900 shadow-sm dark:bg-stone-950 dark:text-stone-100"
                    : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                {option.value === "compare" && <Columns3 className="h-3.5 w-3.5" />}
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyFullListing}
              disabled={!canCopyFull}
            >
              {copiedFull ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedFull ? "Copied" : "Copy full listing"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRegenerate(activeIdx)}
              disabled={isStreaming}
              title="Regenerate this variant"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Variant tabs */}
        {viewMode === "single" && (
          <div
            role="tablist"
            aria-label="Listing variants"
            className="flex gap-2"
          >
            {states.map((s, i) => {
              const isActive = i === activeIdx;
              const baseLabel = VARIANT_LABELS[i] ?? `Variant ${i + 1}`;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => onSelect(i)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400 dark:hover:border-stone-700 dark:hover:text-stone-100"
                  }`}
                >
                  {!s.done && !s.error && (
                    <Loader2 className="h-3 w-3 animate-spin opacity-60" />
                  )}
                  {s.error && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
                  )}
                  {baseLabel}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === "compare" ? (
          <div className="grid gap-3 lg:grid-cols-3">
            {states.map((state, index) => {
              const listing = state.partial;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-950"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                      {VARIANT_LABELS[index] ?? `Variant ${index + 1}`}
                    </span>
                    {!state.done && !state.error && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-400" />
                    )}
                  </div>
                  {state.error ? (
                    <p className="text-sm text-stone-500">{state.error}</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium leading-relaxed text-stone-900 dark:text-stone-100">
                        {listing.title || "…"}
                      </p>
                      <ol className="space-y-1.5 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                        {(listing.bullets ?? []).slice(0, 5).map((bullet, i) => (
                          <li key={i}>{i + 1}. {bullet}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : active.error ? (
          <p className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
              aria-hidden
            />
            {active.error}
          </p>
        ) : (
          <>
            <Section
              label="Title"
              value={partial.title ?? ""}
              limit={FIELD_LIMITS[platform].title}
              streaming={!active.done}
            />
            <Section
              label="Bullet points"
              value={bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}
              bulletValues={bullets}
              limit={FIELD_LIMITS[platform].bullet}
              multiline
              streaming={!active.done}
            />
            <Section
              label="Description"
              value={partial.description ?? ""}
              multiline
              streaming={!active.done}
            />
            <Section
              label="Backend keywords"
              value={partial.backendKeywords ?? ""}
              limit={FIELD_LIMITS[platform].backendKeywords}
              streaming={!active.done}
            />
            <Section
              label="SEO keywords (for PPC / SEO)"
              value={seoKeywords.join(", ")}
              streaming={!active.done}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Section({
  label,
  value,
  limit,
  bulletValues,
  multiline = false,
  streaming = false,
}: {
  label: string;
  value: string;
  limit?: FieldLimit;
  bulletValues?: string[];
  multiline?: boolean;
  streaming?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const hasValue = value.length > 0;
  const bulletCounts = bulletValues?.map((bullet) => ({
    text: bullet,
    count: limit ? countValue(bullet, limit.metric) : bullet.length,
    status: getLimitStatus(bullet, limit),
  }));
  const count = limit ? countValue(value, limit.metric) : value.length;
  const status =
    bulletCounts && bulletCounts.length > 0
      ? bulletCounts.some((item) => item.status === "over")
        ? "over"
        : bulletCounts.some((item) => item.status === "short")
          ? "short"
          : "ok"
      : getLimitStatus(value, limit);
  const statusClass =
    status === "over"
      ? "text-red-600 dark:text-red-400"
      : status === "short"
        ? "text-amber-700 dark:text-amber-400"
        : status === "ok"
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-stone-400";
  const limitText = limit
    ? bulletCounts
      ? limit.min
        ? `${limit.min}-${limit.max} ${limit.metric} each`
        : `<=${limit.max} ${limit.metric} each`
      : limit.min
      ? `${count}/${limit.min}-${limit.max} ${limit.metric}`
      : `${count}/${limit.max} ${limit.metric}`
    : `${count} chars`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-500">
            {label}
          </span>
          {limit && (
            <span className={`text-xs font-medium ${statusClass}`}>
              {limitText}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          disabled={!hasValue}
          className={`inline-flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-30 ${
            copied
              ? "text-[var(--accent)]"
              : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        className={`min-h-[2.5rem] rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-stone-800 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200 ${
          multiline ? "whitespace-pre-line" : ""
        }`}
      >
        {hasValue ? value : <span className="text-stone-300 dark:text-stone-700">…</span>}
        {streaming && hasValue && (
          <span
            aria-hidden
            className="ml-0.5 -mb-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-[var(--accent)] align-middle"
          />
        )}
      </div>
      {bulletCounts && bulletCounts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {bulletCounts.map((item, index) => {
            const itemClass =
              item.status === "over"
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
                : item.status === "short"
                  ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300";
            return (
              <span
                key={`${item.text}-${index}`}
                className={`rounded-md border px-2 py-0.5 text-xs font-medium ${itemClass}`}
              >
                B{index + 1}: {item.count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
