import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { getClientIp } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WaitlistSchema = z.object({
  email: z.email().max(254),
  platform: z.enum(["amazon", "tiktok-shop", "shopify"]).optional(),
  productName: z.string().max(200).optional(),
  turnstileToken: z.string().max(2048).optional(),
});

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const turnstile = await verifyTurnstileToken(
    parsed.data.turnstileToken,
    ip,
    "waitlist"
  );
  if (!turnstile.success) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 403 }
    );
  }

  const entry = {
    email: parsed.data.email.toLowerCase(),
    platform: parsed.data.platform,
    productName: parsed.data.productName,
    ip,
    ts: new Date().toISOString(),
    source: "rate-limit",
  };

  if (redis) {
    await Promise.all([
      redis.sadd("listforge:waitlist:emails", entry.email),
      redis.lpush("listforge:waitlist:events", JSON.stringify(entry)),
    ]);
  } else {
    console.info("[waitlist] captured email:", entry);
  }

  return NextResponse.json({ ok: true });
}
