import type { Platform } from "./listing-prompts";
import { CATEGORIES } from "./categories";
import { PLATFORM_LABEL } from "./listing-prompts";

/**
 * pSEO slug shapes:
 *   1. Category-level:  `{platform}-{categorySlug}-listing-optimizer`
 *      Example:         `amazon-kitchen-gadgets-listing-optimizer`
 *   2. Sub-niche-level: `{platform}-{categorySlug}-{subNicheSlug}-listing-optimizer`
 *      Example:         `amazon-kitchen-gadgets-garlic-tools-listing-optimizer`
 *
 * Plus a small set of editorial guides for topical authority.
 */

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  /** "pseo" = generated platform x category page; "editorial" = hand-written */
  kind: "pseo" | "editorial";
}

const PLATFORMS: Platform[] = ["amazon", "tiktok-shop", "shopify"];

const EDITORIAL_GUIDES: GuideMeta[] = [
  {
    slug: "amazon-title-best-practices",
    title: "Amazon Title Best Practices in 2026 (with Examples)",
    description:
      "The current Amazon title rules, character limits per category, and the 6 hooks top sellers actually use.",
    kind: "editorial",
  },
  {
    slug: "backend-keywords-explained",
    title: "Amazon Backend Keywords: What Actually Works (250-byte rule)",
    description:
      "How to structure backend keywords so every byte earns its keep. Common mistakes that get listings suppressed.",
    kind: "editorial",
  },
  {
    slug: "tiktok-shop-product-title-formula",
    title: "The TikTok Shop Title Formula That Steals Scroll Time",
    description:
      "Why hook-first titles outperform keyword-first titles on TikTok Shop, with 12 examples by category.",
    kind: "editorial",
  },
  {
    slug: "shopify-product-description-template",
    title: "The 5-Block Shopify Product Description Template",
    description:
      "A reusable template DTC brands can drop into every product page to lift conversion without sounding spammy.",
    kind: "editorial",
  },
  {
    slug: "amazon-a-plus-content-templates-2026",
    title: "Amazon A+ Content Templates That Convert (2026)",
    description:
      "The 5 high-performing A+ module layouts, 2026 rule changes, image specs, and the mistakes that get A+ rejected. Based on 180+ brand-registered listings.",
    kind: "editorial",
  },
  {
    slug: "tiktok-shop-algorithm-demystified",
    title: "TikTok Shop Algorithm Demystified: The 5 Ranking Signals",
    description:
      "How the TikTok Shop recommendation + search algorithm actually ranks products in 2026. The first-48-hours window, creator affiliation math, and why conversion rate beats ad spend.",
    kind: "editorial",
  },
  {
    slug: "shopify-cro-checklist-for-dtc",
    title: "The Shopify CRO Checklist for DTC Brands (30 Experiments)",
    description:
      "A prioritized 30-experiment CRO checklist for Shopify DTC stores. Covers PDP, checkout, trust signals, site speed, upsells, and the 30-day testing cadence that compounds.",
    kind: "editorial",
  },
  {
    slug: "amazon-vs-tiktok-shop-vs-shopify",
    title: "Amazon vs TikTok Shop vs Shopify: Which Listing Style to Use",
    description:
      "A practical platform comparison for sellers deciding where to list first, what copy angle to use, and how to adapt one product across marketplace, social commerce, and DTC.",
    kind: "editorial",
  },
];

const CATEGORY_GUIDES: GuideMeta[] = PLATFORMS.flatMap((p) =>
  CATEGORIES.map((c) => ({
    slug: `${p}-${c.slug}-listing-optimizer`,
    title: `${PLATFORM_LABEL[p]} ${c.label} Listing Optimizer — Free AI Copy Generator`,
    description: `Optimize ${c.label.toLowerCase()} listings for ${PLATFORM_LABEL[p]} — title, bullets, description, and backend keywords tuned for the category.`,
    kind: "pseo" as const,
  }))
);

const SUBNICHE_GUIDES: GuideMeta[] = PLATFORMS.flatMap((p) =>
  CATEGORIES.flatMap((c) =>
    (c.subNiches ?? []).map((s) => ({
      slug: `${p}-${c.slug}-${s.slug}-listing-optimizer`,
      title: `${PLATFORM_LABEL[p]} ${s.label} Listing Optimizer — Free AI Copy Generator`,
      description: `Optimize ${s.label.toLowerCase()} listings for ${PLATFORM_LABEL[p]} — category-aware title, bullets, description, and backend keywords.`,
      kind: "pseo" as const,
    }))
  )
);

export const ALL_GUIDES: GuideMeta[] = [
  ...EDITORIAL_GUIDES,
  ...CATEGORY_GUIDES,
  ...SUBNICHE_GUIDES,
];

export interface PseoSlugParts {
  platform: Platform;
  categorySlug: string;
  subNicheSlug: string | null;
}

/** Parse a pSEO slug into its structured parts, or null if it isn't pSEO. */
export function parsePseoSlug(slug: string): PseoSlugParts | null {
  const match = slug.match(/^(amazon|tiktok-shop|shopify)-(.+)-listing-optimizer$/);
  if (!match) return null;
  const platform = match[1] as Platform;
  const inner = match[2];

  // Try category-only match first (e.g. "kitchen-gadgets").
  const catOnly = CATEGORIES.find((c) => c.slug === inner);
  if (catOnly) {
    return { platform, categorySlug: catOnly.slug, subNicheSlug: null };
  }

  // Otherwise try category + sub-niche (e.g. "kitchen-gadgets-garlic-tools").
  // Category slugs may contain hyphens, so we match by prefix and then look
  // for the sub-niche slug in the remainder.
  for (const c of CATEGORIES) {
    if (!c.subNiches) continue;
    const prefix = `${c.slug}-`;
    if (!inner.startsWith(prefix)) continue;
    const remainder = inner.slice(prefix.length);
    const sub = c.subNiches.find((s) => s.slug === remainder);
    if (sub) {
      return { platform, categorySlug: c.slug, subNicheSlug: sub.slug };
    }
  }

  return null;
}

export function getGuide(slug: string): GuideMeta | undefined {
  return ALL_GUIDES.find((g) => g.slug === slug);
}
