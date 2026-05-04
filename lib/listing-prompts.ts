export type Platform = "amazon" | "tiktok-shop" | "shopify";

export const PLATFORM_LABEL: Record<Platform, string> = {
  amazon: "Amazon",
  "tiktok-shop": "TikTok Shop",
  shopify: "Shopify",
};

/**
 * One of three angles each variant takes. Combined with temperature variation
 * this guarantees the 3 generated listings actually feel meaningfully different
 * rather than minor rewordings of the same template.
 */
export type VariantStyle = "conservative" | "balanced" | "creative";

export const VARIANT_STYLE_LABEL: Record<VariantStyle, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  creative: "Creative",
};

export interface OptimizeInput {
  platform: Platform;
  productName: string;
  category: string;
  features: string;       // raw bullet-style notes from the seller
  keywords?: string;      // optional seed keywords
  targetMarket?: string;  // e.g. "United States", "United Kingdom"
  brand?: string;
}

export interface OptimizedListing {
  title: string;
  bullets: string[];           // 5 bullet points
  description: string;         // ~200-400 words
  backendKeywords: string;     // comma-separated, <250 bytes
  seoKeywords: string[];       // for the seller's reference
  platform: Platform;
}

const COMMON_RULES = `
You are a senior e-commerce copywriter who has launched thousands of best-selling
products. You write in clear, scannable English (US), avoid hype words like
"revolutionary" / "ultimate" / "perfect", and follow each marketplace's policies
strictly. You NEVER fabricate features that the seller did not list. If a feature
is not provided, leave it out instead of inventing one.

Output MUST be valid JSON matching this TypeScript type, with no markdown fences:

type Output = {
  title: string;             // see platform rules below
  bullets: string[];         // exactly 5 items, each <= 250 chars
  description: string;       // 180-400 words, plain text, no HTML, paragraph breaks via \\n\\n
  backendKeywords: string;   // comma-separated, NO duplicates of words already in title or bullets, <= 240 bytes
  seoKeywords: string[];     // 8-12 high-intent search phrases the seller can target with PPC/SEO
};
`.trim();

const PLATFORM_RULES: Record<Platform, string> = {
  amazon: `
PLATFORM: Amazon (US/UK/EU marketplaces).
Title rules:
- 150-200 chars total, BUT the first 80 characters are the mobile-search "golden
  zone" — Amazon truncates the title there in mobile search results, which is
  where >70% of buyers are. Therefore:
  - The brand (if provided) + primary keyword + the single strongest
    differentiator MUST all fit inside the first 80 characters.
  - Use the remaining 80-120 chars for secondary keywords, sizes, materials,
    pack count, etc.
- Title case, no ALL CAPS except acronyms, no promotional phrases ("BEST",
  "SALE", "#1", "AMAZON'S CHOICE")
- No emojis, no symbols beyond commas, hyphens, parentheses, slashes, ampersands
Bullet rules:
- Each bullet starts with a CAPITALIZED 2-4 word benefit hook, then a colon, then explanation
- Lead with benefit, support with feature, end with use-case where natural
Description rules:
- Open with the buyer pain point being solved, then differentiation, then social proof
  language (without inventing reviews), then a soft CTA
Backend keywords:
- Lowercase, comma-separated, no duplicates, no brand names of competitors, no quoted phrases
`.trim(),

  "tiktok-shop": `
PLATFORM: TikTok Shop.
Title rules:
- 60-100 chars, hook + benefit + product type, conversational tone allowed
- 1-2 strategically placed emojis are OK if they reinforce meaning (skip if unsure)
Bullet rules:
- Punchy, scroll-stopping, written like creator captions; benefit-first
Description rules:
- 120-220 words, second-person ("you"), short sentences, ends with creator-style CTA
- Mention how it shines in short-form video demos
Backend keywords:
- Trending search phrases including problem-aware queries
`.trim(),

  shopify: `
PLATFORM: Shopify (DTC store).
Title rules:
- 60-90 chars, brand-led if a brand is provided, premium tone
Bullet rules:
- Feature/benefit pairs, no marketplace-style ALL CAPS hooks; written as a "Key Features" list
Description rules:
- 200-380 words, brand-voice storytelling. Open with a hero moment, then features,
  then materials/specs, then care/warranty cues if relevant. Avoid filler.
Backend keywords:
- Treat as "SEO meta keywords + collection tags" — broad-match commercial intent
`.trim(),
};

/**
 * Per-variant angle. Each style enforces a meaningfully different approach to
 * the SAME product — temperature alone produces variants that often feel like
 * paraphrases of each other, which defeats the "3 alternatives" promise.
 */
const VARIANT_STYLE_RULES: Record<VariantStyle, string> = {
  conservative: `
VARIANT STYLE: Conservative / spec-driven.
- Buyer is in comparison-shopping mode, reading 5+ similar listings side-by-side.
- Title is keyword-dense and front-loaded with hard specs (size, material,
  capacity, certifications). Avoid emotional language.
- Bullets emphasize measurable facts: dimensions, weight, materials, warranty,
  compatibility, certifications. Numbers beat adjectives.
- Description opens with the category problem, then technical differentiation.
- Tone: trustworthy, factual, like a senior product manager describing the spec
  sheet.
`.trim(),

  balanced: `
VARIANT STYLE: Balanced / mainstream.
- Hits the middle 80% of buyers who skim quickly and want both proof and warmth.
- Title leads with primary keyword + 1 emotional hook + 2 hard specs.
- Bullets: 50% benefit-led ("Stay organized in seconds"), 50% feature-led
  ("304 stainless steel construction"). Pair them.
- Description: pain point → solution → 2-3 concrete features → soft CTA.
- Tone: helpful, confident, neutral — what a "typical best-seller" reads like.
`.trim(),

  creative: `
VARIANT STYLE: Creative / emotion-led.
- Buyer is impulse-shopping, scrolling fast, often on mobile/social.
- Title leads with an emotional hook or pain point ("Tired of slippery
  cutting boards?"), THEN the keyword and product type.
- Bullets use vivid sensory language and second-person ("you'll love how...").
  Make the buyer FEEL the use case before listing the feature.
- Description tells a tiny story or scenario in the opener (one sentence
  scene-setter), then payoff, then features.
- Tone: warm, scroll-stopping, slightly conversational — but still factual.
  Never invent features.
`.trim(),
};

/**
 * Locale-specific spelling/voice rules. Keyed by lowercased target market
 * substring so we can match "United Kingdom", "UK", "Britain" etc.
 */
const LOCALE_RULES: Array<{ match: RegExp; rule: string }> = [
  {
    match: /\b(united kingdom|uk|britain|england|scotland|wales|ireland)\b/i,
    rule:
      "TARGET LOCALE: United Kingdom. Use British English spelling " +
      "(colour, organise, favourite, whilst, travelling, behaviour, defence, " +
      "centre, litre). Use British English vocabulary where natural " +
      "(trousers, biscuits, lift, takeaway). Currency cues should reference " +
      "GBP/£ if relevant. Avoid US-specific cultural references.",
  },
  {
    match: /\b(australia|au|new zealand|nz)\b/i,
    rule:
      "TARGET LOCALE: Australia / New Zealand. Use Australian English " +
      "spelling (colour, organise, favourite, centre). Tone is friendlier " +
      "and more casual than US/UK. Currency cues reference AUD/NZD if relevant.",
  },
  {
    match: /\b(canada|ca)\b/i,
    rule:
      "TARGET LOCALE: Canada. Use Canadian English (mostly British spelling " +
      "with US vocabulary): colour, favour, but truck/elevator/apartment. " +
      "Bilingual cues are fine but write the listing in English unless asked.",
  },
  {
    match: /\b(germany|de|deutschland)\b/i,
    rule:
      "TARGET LOCALE: Germany. WRITE THE ENTIRE LISTING IN GERMAN " +
      "(de_DE). Use formal Sie-form in CTAs. German consumers expect " +
      "explicit specs (Materialien, Maße, Energieklasse, Garantie). Avoid " +
      "marketing fluff — it reads as untrustworthy in DE.",
  },
  {
    match: /\b(france|fr)\b/i,
    rule:
      "TARGET LOCALE: France. WRITE THE ENTIRE LISTING IN FRENCH (fr_FR). " +
      "Use vouvoiement in CTAs. Lead with elegance and craftsmanship cues " +
      "where the product allows.",
  },
  {
    match: /\b(japan|jp|nippon)\b/i,
    rule:
      "TARGET LOCALE: Japan. WRITE THE ENTIRE LISTING IN JAPANESE (ja_JP). " +
      "Lead with quality cues, precise specs, and reassurance " +
      "(安心・信頼・丁寧). Japanese buyers heavily value detailed product specs " +
      "and after-sale support language.",
  },
];

function buildLocaleRule(targetMarket?: string): string {
  if (!targetMarket) return "";
  const found = LOCALE_RULES.find((l) => l.match.test(targetMarket));
  return found ? found.rule : "";
}

export function buildSystemPrompt(
  platform: Platform,
  variantStyle: VariantStyle = "balanced",
  targetMarket?: string
): string {
  const parts = [
    COMMON_RULES,
    PLATFORM_RULES[platform],
    VARIANT_STYLE_RULES[variantStyle],
  ];
  const locale = buildLocaleRule(targetMarket);
  if (locale) parts.push(locale);
  return parts.join("\n\n");
}

export function buildUserPrompt(input: OptimizeInput): string {
  const lines = [
    `Product: ${input.productName}`,
    `Category: ${input.category}`,
    input.brand ? `Brand: ${input.brand}` : null,
    input.targetMarket ? `Target market: ${input.targetMarket}` : null,
    input.keywords ? `Seed keywords: ${input.keywords}` : null,
    "",
    "Seller's raw feature notes:",
    input.features.trim(),
  ].filter(Boolean);
  return lines.join("\n");
}

/**
 * Deterministic mock used when DEEPSEEK_API_KEY is missing, so the UI is fully
 * demoable. Clearly marked so it never gets shipped as real output.
 */
export function buildMockListing(input: OptimizeInput): OptimizedListing {
  const brand = input.brand?.trim() || "YourBrand";
  const product = input.productName.trim();
  return {
    platform: input.platform,
    title: `${brand} ${product} — Premium ${input.category} Built for Everyday Use`,
    bullets: [
      `BUILT TO LAST: ${product} crafted with quality materials so it holds up to daily use without breaking down.`,
      `EASY TO USE: Intuitive design means you can start using your ${product} in minutes — no manual marathon required.`,
      `PERFECT FIT: Sized for real-world ${input.category.toLowerCase()} routines — works whether you're at home, traveling, or at the office.`,
      `THOUGHTFUL DETAILS: Every part of this ${product} was designed with the buyer in mind, from the finish to the packaging.`,
      `RISK-FREE PURCHASE: Backed by responsive customer support and a satisfaction guarantee — buy with confidence.`,
    ],
    description:
      `Tired of ${input.category.toLowerCase()} products that overpromise and underdeliver? The ${brand} ${product} was built to fix exactly that.\n\n` +
      `From the first time you unbox it, you'll notice the difference: solid materials, considered design, and an experience that feels premium without the premium price tag. Whether you're upgrading from a cheaper alternative or buying ${input.category.toLowerCase()} for the first time, this is the choice that pays you back every day.\n\n` +
      `Add to cart with confidence — and if it's not exactly what you expected, our support team makes returns easy. (This is a demo response. Add DEEPSEEK_API_KEY to .env.local to generate real AI output.)`,
    backendKeywords:
      `${input.category.toLowerCase()}, ${product.toLowerCase()}, premium ${input.category.toLowerCase()}, durable, gift, daily use, best seller, top rated`,
    seoKeywords: [
      `best ${product.toLowerCase()}`,
      `${product.toLowerCase()} for ${input.category.toLowerCase()}`,
      `${brand.toLowerCase()} ${product.toLowerCase()}`,
      `affordable ${product.toLowerCase()}`,
      `${product.toLowerCase()} review`,
      `${product.toLowerCase()} buy online`,
      `${input.category.toLowerCase()} essentials`,
      `quality ${input.category.toLowerCase()}`,
    ],
  };
}
