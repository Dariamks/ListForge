import { NextResponse } from "next/server";
import { streamObject } from "ai";
import { z } from "zod";
import { getListingModels, isAiConfigured } from "@/lib/deepseek";
import { logApiError } from "@/lib/error-monitor";
import {
  buildListingCacheKey,
  getCachedListings,
  setCachedListings,
} from "@/lib/listing-cache";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildMockListing,
  type OptimizeInput,
  type OptimizedListing,
  type Platform,
  type VariantStyle,
} from "@/lib/listing-prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLATFORMS: Platform[] = ["amazon", "tiktok-shop", "shopify"];

const InputSchema = z.object({
  platform: z.enum(["amazon", "tiktok-shop", "shopify"]),
  productName: z.string().min(2).max(200),
  category: z.string().min(2).max(80),
  features: z.string().min(10).max(2000),
  keywords: z.string().max(400).optional(),
  targetMarket: z.string().max(80).optional(),
  brand: z.string().max(80).optional(),
  turnstileToken: z.string().max(2048).optional(),
  variantStyle: z.enum(["conservative", "balanced", "creative"]).optional(),
  /** Number of alternative listings to generate (1 or 3). Defaults to 3. */
  variants: z.union([z.literal(1), z.literal(3)]).optional().default(3),
});

/**
 * Per-variant configuration. The `style` is injected into the system prompt to
 * force the model to take a meaningfully different angle for each variant
 * (rather than just paraphrasing). Temperature adds additional surface
 * variation on top of the structural difference.
 */
const VARIANT_PROFILES: Array<{ style: VariantStyle; temperature: number }> = [
  { style: "conservative", temperature: 0.6 },
  { style: "balanced", temperature: 0.85 },
  { style: "creative", temperature: 1.0 },
];

const OutputSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()).length(5),
  description: z.string(),
  backendKeywords: z.string(),
  seoKeywords: z.array(z.string()).min(8).max(12),
});

export async function POST(req: Request) {
  // 1) Rate limit
  const ip = getClientIp(req);
  const rl = await checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", resetMs: rl.resetMs },
      { status: 429 }
    );
  }

  // 2) Parse + validate input
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const {
    variants: variantCount,
    turnstileToken,
    variantStyle,
    ...rest
  } = parsed.data;
  const input = rest as OptimizeInput;

  if (!PLATFORMS.includes(input.platform)) {
    return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }

  const turnstile = await verifyTurnstileToken(turnstileToken, ip, "optimize");
  if (!turnstile.success) {
    return NextResponse.json(
      { error: "Bot verification failed. Please refresh and try again." },
      { status: 403 }
    );
  }
  const cacheKey = buildListingCacheKey(input, variantCount, variantStyle);
  const cached = await getCachedListings(cacheKey);

  // 3) Build NDJSON stream that multiplexes N parallel variant generations.
  //    Each line is one of:
  //      {"idx": <0..N-1>, "partial": <DeepPartial<OptimizedListing>>}
  //      {"idx": <0..N-1>, "done": true}
  //      {"idx": <0..N-1>, "error": "<message>"}
  //      {"meta": {"platform": "<platform>", "count": <N>}}  (always first line)
  const enc = new TextEncoder();
  const writeLine = (
    controller: ReadableStreamDefaultController<Uint8Array>,
    obj: unknown
  ) => {
    try {
      controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));
      return true;
    } catch {
      return false;
    }
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      writeLine(controller, { meta: { platform: input.platform, count: variantCount } });

      if (cached?.length === variantCount) {
        cached.forEach((listing, idx) => {
          writeLine(controller, { idx, partial: listing });
          writeLine(controller, { idx, done: true });
        });
        controller.close();
        return;
      }

      // Mock mode (no DEEPSEEK_API_KEY) — emit a fake-streamed mock per variant
      // so dev UX exercises the streaming UI even without credentials.
      if (!isAiConfigured()) {
        const mocks: OptimizedListing[] = [];
        await Promise.all(
          Array.from({ length: variantCount }, (_, idx) =>
            {
              const mock = buildMockListing(input);
              mocks[idx] = mock;
              return simulateMockStream(controller, writeLine, idx, mock);
            }
          )
        );
        await setCachedListings(cacheKey, mocks);
        controller.close();
        return;
      }

      // The user-prompt body is identical across variants; only the system
      // prompt's variant-style block changes. We build per-variant systems
      // below so each call gets a different angle.
      const prompt = buildUserPrompt(input);
      const models = getListingModels();
      const completed: Array<OptimizedListing | null> = Array.from(
        { length: variantCount },
        () => null
      );

      await Promise.all(
        Array.from({ length: variantCount }, async (_, idx) => {
          const profile =
            variantCount === 1
              ? VARIANT_PROFILES.find((p) => p.style === variantStyle) ??
                VARIANT_PROFILES[1]
              : VARIANT_PROFILES[idx] ?? VARIANT_PROFILES[1];
          let latest: unknown;
          let lastError: unknown;
          try {
            for (const candidate of models) {
              try {
                const result = streamObject({
                  model: candidate.model,
                  schema: OutputSchema,
                  system: buildSystemPrompt(input.platform, profile.style, input.targetMarket),
                  prompt,
                  temperature: profile.temperature,
                });
                for await (const partial of result.partialObjectStream) {
                  latest = partial;
                  writeLine(controller, { idx, partial });
                }
                const normalized = normalizeOptimizedListing(latest, input.platform);
                if (normalized) {
                  completed[idx] = normalized;
                }
                writeLine(controller, { idx, done: true });
                return;
              } catch (err) {
                lastError = err;
                await logApiError("/api/optimize/provider", err, {
                  provider: candidate.id,
                  variant: idx,
                  platform: input.platform,
                });
              }
            }
            throw lastError ?? new Error("No AI provider configured");
          } catch (err) {
            await logApiError("/api/optimize/variant", err, {
              variant: idx,
              platform: input.platform,
            });
            writeLine(controller, {
              idx,
              error:
                err instanceof Error
                  ? err.message
                  : "AI provider error",
            });
          }
        })
      );
      const finished = completed.filter((listing): listing is OptimizedListing =>
        Boolean(listing)
      );
      if (finished.length === variantCount) {
        await setCachedListings(cacheKey, finished);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      // Prevents proxy / Vercel edge buffering of the stream.
      "X-Accel-Buffering": "no",
    },
  });
}

function normalizeOptimizedListing(
  value: unknown,
  platform: Platform
): OptimizedListing | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<OptimizedListing>;
  if (
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.bullets) ||
    candidate.bullets.length !== 5 ||
    !candidate.bullets.every((bullet) => typeof bullet === "string") ||
    typeof candidate.description !== "string" ||
    typeof candidate.backendKeywords !== "string" ||
    !Array.isArray(candidate.seoKeywords) ||
    !candidate.seoKeywords.every((keyword) => typeof keyword === "string")
  ) {
    return null;
  }
  return {
    title: candidate.title,
    bullets: candidate.bullets,
    description: candidate.description,
    backendKeywords: candidate.backendKeywords,
    seoKeywords: candidate.seoKeywords,
    platform,
  };
}

/**
 * Emit a mock listing in chunks with small delays so the dev UI still
 * feels live. Only used when DEEPSEEK_API_KEY is missing.
 */
async function simulateMockStream(
  controller: ReadableStreamDefaultController<Uint8Array>,
  writeLine: (
    c: ReadableStreamDefaultController<Uint8Array>,
    obj: unknown
  ) => boolean,
  idx: number,
  full: OptimizedListing
) {
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  // Small jitter so variants don't lockstep visually.
  await wait(150 + idx * 80);
  const stages: Array<Partial<OptimizedListing>> = [
    { title: full.title.slice(0, Math.floor(full.title.length / 2)) },
    { title: full.title },
    { title: full.title, bullets: full.bullets.slice(0, 2) },
    { title: full.title, bullets: full.bullets.slice(0, 4) },
    { title: full.title, bullets: full.bullets },
    {
      title: full.title,
      bullets: full.bullets,
      description: full.description.slice(0, 120),
    },
    {
      title: full.title,
      bullets: full.bullets,
      description: full.description,
      backendKeywords: full.backendKeywords,
    },
    full,
  ];
  for (const partial of stages) {
    if (!writeLine(controller, { idx, partial })) return;
    await wait(120);
  }
  writeLine(controller, { idx, done: true });
}
