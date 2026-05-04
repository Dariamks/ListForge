"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Copy, Loader2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/categories";
import type { OptimizedListing, Platform } from "@/lib/listing-prompts";
import {
  type HistoryItem,
  appendHistory,
  clearHistory,
  loadHistory,
  removeHistoryItem,
} from "@/lib/history";
import { readNdjson } from "@/lib/stream-client";
import { HistoryPanel } from "@/components/HistoryPanel";

/** Partial listing during streaming — every field is optional until the chunk for it arrives. */
type PartialListing = Partial<OptimizedListing>;

/** Per-variant streaming state. */
type VariantState = {
  partial: PartialListing;
  done: boolean;
  error: string | null;
};

/** NDJSON line shape from `/api/optimize`. */
type StreamLine =
  | { meta: { platform: Platform; count: number } }
  | { idx: number; partial: PartialListing }
  | { idx: number; done: true }
  | { idx: number; error: string };

const EMPTY_VARIANT: VariantState = { partial: {}, done: false, error: null };

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

interface Props {
  platform: Platform;
  defaultCategory?: string;
}

export function ListingOptimizer({ platform, defaultCategory }: Props) {
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(defaultCategory ?? CATEGORIES[0].slug);
  const [features, setFeatures] = useState("");
  const [keywords, setKeywords] = useState("");
  const [targetMarket, setTargetMarket] = useState("United States");

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

    const cat = CATEGORIES.find((c) => c.slug === category);
    const payload = {
      platform,
      productName: productName.trim(),
      category: cat?.label ?? category,
      brand: brand.trim() || undefined,
      features: features.trim(),
      keywords: keywords.trim() || undefined,
      targetMarket: targetMarket.trim() || undefined,
      variants: 3 as const,
    };

    if (!payload.productName || !payload.features) {
      setError("Product name and feature notes are required.");
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
      } catch (err) {
        // Abort is expected (user submitted again or navigated) — don't show
        // it as an error.
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (ctrl.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    });
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-stone-600" />
            Your product
          </CardTitle>
          <CardDescription>
            Drop in raw notes — bullet points, half-thoughts, even Chinese / English mixed are fine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                <Input
                  id="market"
                  placeholder="United States"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Streaming 3 variants...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate 3 variants
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
          states={streamStates}
          activeIdx={activeIdx}
          onSelect={setActiveIdx}
          isPending={isPending}
          isStreaming={isStreaming}
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
  states,
  activeIdx,
  onSelect,
  isPending,
  isStreaming,
}: {
  states: VariantState[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  isPending: boolean;
  isStreaming: boolean;
}) {
  // Initial pending state before the first NDJSON line lands ("meta" arrives
  // immediately, but if the network is slow the user sees this for ~500ms).
  if (isPending && states.length === 0) {
    return (
      <Card className="grid place-items-center text-center">
        <CardContent className="py-20">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-stone-600" />
          <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
            Connecting to the model...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (states.length === 0) {
    return (
      <Card className="grid place-items-center bg-stone-50/60 text-center dark:bg-stone-900/40">
        <CardContent className="py-20">
          <Sparkles className="mx-auto h-8 w-8 text-stone-400" />
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-500">
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Optimized listings
          {isStreaming && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-700 dark:bg-stone-950/40 dark:text-stone-300">
              <Loader2 className="h-3 w-3 animate-spin" />
              streaming
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {isStreaming
            ? "Watching the model write all 3 variants in parallel..."
            : "3 alternatives — pick the one that fits, then copy."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Variant tabs */}
        <div
          role="tablist"
          aria-label="Listing variants"
          className="flex gap-1 rounded-lg border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-900"
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
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-white text-stone-600 shadow-sm dark:bg-stone-950 dark:text-stone-400"
                    : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                }`}
              >
                {!s.done && !s.error && (
                  <Loader2 className="h-3 w-3 animate-spin opacity-60" />
                )}
                {s.error && <span className="text-red-600">⚠</span>}
                {baseLabel}
              </button>
            );
          })}
        </div>

        {active.error ? (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {active.error}
          </p>
        ) : (
          <>
            <Section
              label="Title"
              value={partial.title ?? ""}
              streaming={!active.done}
            />
            <Section
              label="Bullet points"
              value={bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}
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
  multiline = false,
  streaming = false,
}: {
  label: string;
  value: string;
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

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          disabled={!hasValue}
          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-600 disabled:opacity-30 disabled:hover:text-stone-500"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        className={`min-h-[2.5rem] rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 ${
          multiline ? "whitespace-pre-line" : ""
        }`}
      >
        {hasValue ? value : <span className="text-stone-400">…</span>}
        {streaming && hasValue && (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-3.5 w-[2px] -mb-0.5 animate-pulse bg-stone-500 align-middle"
          />
        )}
      </div>
    </div>
  );
}
