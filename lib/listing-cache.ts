import { Redis } from "@upstash/redis";
import type {
  OptimizeInput,
  OptimizedListing,
  VariantStyle,
} from "@/lib/listing-prompts";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const CACHE_TTL_SECONDS = 60 * 60 * 24;

export function isListingCacheConfigured(): boolean {
  return redis !== null;
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export async function buildListingCacheKey(
  input: OptimizeInput,
  variantCount: number,
  variantStyle?: VariantStyle
): Promise<string> {
  const stable = JSON.stringify({
    platform: input.platform,
    productName: input.productName.trim().toLowerCase(),
    category: input.category.trim().toLowerCase(),
    features: input.features.trim().toLowerCase(),
    keywords: input.keywords?.trim().toLowerCase() ?? "",
    targetMarket: input.targetMarket?.trim().toLowerCase() ?? "",
    brand: input.brand?.trim().toLowerCase() ?? "",
    variantCount,
    variantStyle: variantStyle ?? "",
  });
  return `listforge:listing-cache:${await sha256Hex(stable)}`;
}

export async function getCachedListings(
  key: string
): Promise<OptimizedListing[] | null> {
  if (!redis) return null;
  const value = await redis.get<OptimizedListing[]>(key);
  return Array.isArray(value) ? value : null;
}

export async function setCachedListings(
  key: string,
  listings: OptimizedListing[]
): Promise<void> {
  if (!redis || listings.length === 0) return;
  await redis.set(key, listings, { ex: CACHE_TTL_SECONDS });
}
