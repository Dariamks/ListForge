import categories from "@/data/categories.json";

/**
 * Typed taxonomy loader for pSEO and tool category options.
 *
 * The large editable content lives in `data/categories.json` so taxonomy and
 * sub-niche copy can be updated without touching application logic.
 */

export interface SubNiche {
  slug: string;
  label: string;
  /** Short, search-intent-friendly hook for hero copy (sub-niche-specific) */
  hook: string;
  /** 3 buyer pain points unique to this sub-niche */
  pains: string[];
  /** 3 actionable optimization tips that directly address the pain points */
  tips: string[];
}

export interface Category {
  slug: string;
  label: string;
  /** Short, search-intent-friendly hook for hero copy */
  hook: string;
  /** 3-5 buyer pain points this category struggles with */
  pains: string[];
  /** Optional sub-niches for long-tail pSEO coverage */
  subNiches?: SubNiche[];
}

export const CATEGORIES: Category[] = categories as Category[];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubNiche(
  categorySlug: string,
  subNicheSlug: string
): SubNiche | undefined {
  return getCategoryBySlug(categorySlug)?.subNiches?.find(
    (s) => s.slug === subNicheSlug
  );
}
