import categoryContent from "@/data/category-content.json";
import type { Platform } from "./listing-prompts";

/**
 * Typed loader for hand-written category SEO content.
 *
 * The editable copy is kept in `data/category-content.json`, keyed by category
 * slug, so pSEO content updates do not require changing application modules.
 */

export interface CommonMistake {
  /** ~6-10 words: the mistake itself */
  mistake: string;
  /** ~20-30 words: why it kills conversions or rankings */
  why: string;
}

export interface CategoryContent {
  /** Per-platform "what good looks like" hint (~25 words each) */
  winningTitleHints: Record<Platform, string>;
  /** 3 category-specific listing mistakes with reasoning */
  commonMistakes: CommonMistake[];
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> =
  categoryContent as Record<string, CategoryContent>;

export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] ?? null;
}
