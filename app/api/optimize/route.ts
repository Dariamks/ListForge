import { NextResponse } from "next/server";
import { streamObject } from "ai";
import { z } from "zod";
import { deepseek, DEEPSEEK_MODEL, isAiConfigured } from "@/lib/deepseek";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
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
  const { variants: variantCount, ...rest } = parsed.data;
  const input = rest as OptimizeInput;

  if (!PLATFORMS.includes(input.platform)) {
    return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }

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
  ) => controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      writeLine(controller, { meta: { platform: input.platform, count: variantCount } });

      // Mock mode (no DEEPSEEK_API_KEY) — emit a fake-streamed mock per variant
      // so dev UX exercises the streaming UI even without credentials.
      if (!isAiConfigured()) {
        await Promise.all(
          Array.from({ length: variantCount }, (_, idx) =>
            simulateMockStream(controller, writeLine, idx, buildMockListing(input))
          )
        );
        controller.close();
        return;
      }

      // The user-prompt body is identical across variants; only the system
      // prompt's variant-style block changes. We build per-variant systems
      // below so each call gets a different angle.
      const prompt = buildUserPrompt(input);

      await Promise.all(
        Array.from({ length: variantCount }, async (_, idx) => {
          const profile = VARIANT_PROFILES[idx] ?? VARIANT_PROFILES[1];
          try {
            const result = streamObject({
              model: deepseek(DEEPSEEK_MODEL),
              schema: OutputSchema,
              system: buildSystemPrompt(
                input.platform,
                profile.style,
                input.targetMarket
              ),
              prompt,
              temperature: profile.temperature,
            });
            for await (const partial of result.partialObjectStream) {
              writeLine(controller, { idx, partial });
            }
            writeLine(controller, { idx, done: true });
          } catch (err) {
            console.error(`[/api/optimize] variant ${idx} error:`, err);
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

/**
 * Emit a mock listing in chunks with small delays so the dev UI still
 * feels live. Only used when DEEPSEEK_API_KEY is missing.
 */
async function simulateMockStream(
  controller: ReadableStreamDefaultController<Uint8Array>,
  writeLine: (
    c: ReadableStreamDefaultController<Uint8Array>,
    obj: unknown
  ) => void,
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
    writeLine(controller, { idx, partial });
    await wait(120);
  }
  writeLine(controller, { idx, done: true });
}
