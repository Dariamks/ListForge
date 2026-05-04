/**
 * Rate limiter with two backends:
 *
 *   1. Upstash Redis (production) — multi-region correct, shared across all
 *      Vercel serverless instances. Activated when UPSTASH_REDIS_REST_URL and
 *      UPSTASH_REDIS_REST_TOKEN env vars are set.
 *
 *   2. In-memory token bucket (local dev / fallback) — per-instance, lost on
 *      cold start. Used when Upstash env vars are missing so `npm run dev`
 *      works with no config.
 *
 * Public API is async: always `await checkRateLimit(ip)`.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetMs: number;
};

const LIMIT = 8; // free generations per IP per hour
const WINDOW = "1 h" as const;

// ---------------------------------------------------------------------------
// Upstash backend (enabled only when both env vars present)
// ---------------------------------------------------------------------------
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const upstash: Ratelimit | null =
  upstashUrl && upstashToken
    ? new Ratelimit({
        redis: new Redis({ url: upstashUrl, token: upstashToken }),
        // Sliding window is more forgiving than fixed-window for bursty users
        // and less prone to thundering-herd at boundary resets.
        limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
        analytics: true,
        prefix: "listforge:rl",
        // Local memory cache dedupes requests inside the same function
        // invocation, cutting Redis RTs for rapid-fire submits.
        ephemeralCache: new Map(),
      })
    : null;

export function isUpstashConfigured(): boolean {
  return upstash !== null;
}

// ---------------------------------------------------------------------------
// In-memory fallback (local dev + graceful degradation)
// ---------------------------------------------------------------------------
type Bucket = { tokens: number; updated: number };
const buckets = new Map<string, Bucket>();
const CAPACITY = LIMIT;
const REFILL_PER_HOUR = LIMIT;

function checkInMemory(ip: string): RateLimitResult {
  const now = Date.now();
  const refillRate = REFILL_PER_HOUR / 3_600_000;
  const b = buckets.get(ip) ?? { tokens: CAPACITY, updated: now };

  const elapsed = now - b.updated;
  b.tokens = Math.min(CAPACITY, b.tokens + elapsed * refillRate);
  b.updated = now;

  if (b.tokens < 1) {
    buckets.set(ip, b);
    const resetMs = Math.ceil((1 - b.tokens) / refillRate);
    return { allowed: false, remaining: 0, resetMs };
  }

  b.tokens -= 1;
  buckets.set(ip, b);
  return { allowed: true, remaining: Math.floor(b.tokens), resetMs: 0 };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (upstash) {
    try {
      const r = await upstash.limit(ip);
      return {
        allowed: r.success,
        remaining: r.remaining,
        resetMs: r.success ? 0 : Math.max(0, r.reset - Date.now()),
      };
    } catch (err) {
      // If Upstash is briefly unavailable, don't nuke the API — fall through
      // to in-memory. This is a deliberate tradeoff: prefer availability over
      // strict multi-region correctness during a Redis outage.
      console.error("[rate-limit] Upstash error, falling back to memory:", err);
    }
  }
  return checkInMemory(ip);
}

export function getClientIp(req: Request): string {
  const h = req.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "anonymous";
}
