import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function logApiError(
  scope: string,
  err: unknown,
  context: Record<string, unknown> = {}
): Promise<void> {
  const entry = {
    scope,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context,
    ts: new Date().toISOString(),
  };

  console.error(`[${scope}]`, err);
  if (!redis) return;

  try {
    await redis.lpush("listforge:errors", JSON.stringify(entry));
    await redis.ltrim("listforge:errors", 0, 499);
  } catch (logErr) {
    console.error("[error-monitor] failed to persist error:", logErr);
  }
}
