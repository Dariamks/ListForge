# ListForge

> Free AI Listing Optimizer for Amazon, TikTok Shop & Shopify.

A Programmatic-SEO + AI-tool web app. Sellers paste raw product notes, get a
marketplace-policy-safe title, 5 bullet points, description, backend keywords,
and SEO/PPC keywords back in seconds.

## Stack

- Next.js 16 (App Router, Turbopack, React 19.2)
- Tailwind CSS v4
- DeepSeek via Vercel AI SDK (`@ai-sdk/deepseek`) for LLM calls
- In-memory IP rate limit (swap to Upstash Redis for prod multi-region)
- AdSense + Google Analytics ready (env-driven, no-op when unset)

## Quickstart

```bash
cp .env.example .env.local
# (optional) add your DEEPSEEK_API_KEY for real AI output
npm run dev
```

Visit http://localhost:3000

Without `DEEPSEEK_API_KEY`, the `/api/optimize` endpoint returns a clearly
labeled deterministic mock so the UI is fully demoable.

## Project layout

```
app/
  api/optimize/route.ts          DeepSeek-powered listing generator
  tools/
    amazon-listing-optimizer/    /tools/amazon-listing-optimizer
    tiktok-shop-optimizer/       /tools/tiktok-shop-optimizer
    shopify-product-optimizer/   /tools/shopify-product-optimizer
  guides/[slug]/                 pSEO + editorial guides (build-time SSG)
  privacy/  terms/               legal pages
  sitemap.ts  robots.ts          SEO infra
components/
  ui/                            buttons, inputs, cards (shadcn-style)
  ListingOptimizer.tsx           the main client form
  Header.tsx  Footer.tsx
lib/
  deepseek.ts                    AI SDK client
  rate-limit.ts                  in-memory IP token bucket
  listing-prompts.ts             system prompts per platform + mock fallback
  categories.ts                  pSEO category taxonomy
  guides.ts                      slug router for /guides/[slug]
  utils.ts                       cn() + SITE constants
```

## Programmatic SEO

`/guides/[slug]` produces:
- 4 hand-written editorial pages
- 36 platform×category pages (3 platforms × 12 categories)

All slugs are pre-rendered at build time via `generateStaticParams`. To add
more long-tail coverage, extend `lib/categories.ts` — every new entry
automatically generates 3 new guide pages and is added to `sitemap.xml`.

## Deployment

```bash
npm run build
```

Recommended host: Vercel (free tier handles ~10k req/day comfortably).
Set env vars in the Vercel dashboard:

| Name | Required | Notes |
|------|----------|-------|
| `DEEPSEEK_API_KEY` | yes (prod) | https://platform.deepseek.com |
| `NEXT_PUBLIC_SITE_URL` | yes | e.g. `https://listforge.dev` |
| `NEXT_PUBLIC_GA_ID` | optional | `G-XXXXXX` |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | optional | `ca-pub-XXXXXXXX` |
| `UPSTASH_REDIS_REST_URL` | optional (prod) | Upstash REST URL — enables multi-region rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | optional (prod) | Upstash REST token (same dashboard) |

If the Upstash vars are unset, `/api/optimize` falls back to an in-memory
token bucket — fine for local dev, lossy on Vercel cold starts.

## Roadmap (per the original 30-day plan)

- Week 1: MVP — landing, 3 tool pages, optimize API, rate limit, AdSense placeholder
- Week 2: Programmatic SEO — 36 pSEO landing pages, sitemap, schema.org
- Week 3: Traffic — Reddit/Twitter/PH launches, BetaList, AlternativeTo, Toolify
- Week 4: Iterate — funnel optimization, plan Pro tier (Stripe/Creem)
