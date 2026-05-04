import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  CheckCircle2,
  Code2,
  Globe,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/utils";

const PLATFORMS = [
  {
    slug: "amazon-listing-optimizer",
    label: "Amazon",
    blurb:
      "Title, 5 bullets, A+ description, backend keywords — Amazon-policy-safe.",
  },
  {
    slug: "tiktok-shop-optimizer",
    label: "TikTok Shop",
    blurb:
      "Hook-first titles & creator-style descriptions tuned for short-form discovery.",
  },
  {
    slug: "shopify-product-optimizer",
    label: "Shopify",
    blurb:
      "Brand-voice product copy for DTC stores. Premium tone, zero filler.",
  },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any (web)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Amazon listing optimizer with mobile golden-zone keyword placement",
    "TikTok Shop title generator tuned for short-form discovery",
    "Shopify product description writer with DTC brand voice",
    "3 alternative listings per generation (conservative / balanced / creative)",
    "Token-by-token streaming output",
    "Locale-aware (US, UK, AU, CA, DE, FR, JP)",
    "No signup, no API key required, free hourly quota",
  ],
  creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* === Hero === */}
      <section className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:pt-28 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <a
              href="https://github.com/Dariamks/listforge-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 transition-colors hover:border-stone-300 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 dark:hover:border-stone-700"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span>Open-source prompts on GitHub</span>
              <ArrowRight className="h-3 w-3" />
            </a>

            <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl lg:text-7xl dark:text-stone-50">
              Forge listings that{" "}
              <span style={{ color: "var(--accent)" }}>actually convert</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-stone-600 sm:text-xl dark:text-stone-400">
              Free AI listing generator for Amazon, TikTok Shop, and Shopify
              sellers. 3 streaming variants. Open-source prompts. No signup.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link href="/tools/amazon-listing-optimizer">
                  Generate a listing — free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-7 text-base"
              >
                <a
                  href="https://github.com/Dariamks/listforge-prompts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="h-4 w-4" /> View prompts
                </a>
              </Button>
            </div>

            <p className="mt-5 text-xs text-stone-500">
              Used by sellers from US · UK · DE · JP · SG.
            </p>
          </div>

          {/* === Streaming preview mockup === */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900">
                <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                <div className="ml-3 hidden truncate rounded-md bg-white px-2.5 py-1 text-xs text-stone-500 sm:block dark:bg-stone-800 dark:text-stone-400">
                  listforge.dev/tools/amazon-listing-optimizer
                </div>
              </div>
              {/* Variant tabs */}
              <div className="grid gap-px border-b border-stone-200 bg-stone-200 sm:grid-cols-3 dark:border-stone-800 dark:bg-stone-800">
                {[
                  { tag: "Conservative", active: false },
                  { tag: "Balanced", active: true },
                  { tag: "Creative", active: false },
                ].map((v) => (
                  <div
                    key={v.tag}
                    className={`px-4 py-2.5 text-xs font-semibold ${
                      v.active
                        ? "bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100"
                        : "bg-stone-50 text-stone-500 dark:bg-stone-900 dark:text-stone-500"
                    }`}
                  >
                    {v.tag}
                    {v.active && (
                      <span
                        className="ml-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full align-middle"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-3 p-6 font-mono text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                <div className="text-[11px] uppercase tracking-wider text-stone-400">
                  Title
                </div>
                <div className="text-stone-900 dark:text-stone-100">
                  Insulated Stainless Steel Water Bottle, 32oz Vacuum Tumbler with Leakproof Lid for Gym &amp; Travel
                  <span className="ml-0.5 inline-block h-4 w-1.5 -translate-y-0.5 bg-stone-900 align-middle animate-blink dark:bg-stone-100" />
                </div>
                <div className="mt-4 text-[11px] uppercase tracking-wider text-stone-400">
                  Bullets
                </div>
                <ul className="space-y-1 text-stone-700 dark:text-stone-300">
                  <li>
                    • KEEPS COLD 24H · HOT 12H — premium 18/8 stainless &amp;
                    double-wall vacuum tech
                  </li>
                  <li>
                    • 100% LEAKPROOF FLIP LID — one-handed open, fits standard
                    car cup holders
                  </li>
                  <li className="text-stone-500">
                    • SWEAT-FREE EXTERIOR — powder-coat finish wont…
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Stats strip === */}
      <section className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-stone-200 sm:grid-cols-4 dark:divide-stone-800">
          {[
            { value: "$0", label: "forever-free tier" },
            { value: "0", label: "signups required" },
            { value: "3", label: "streamed variants" },
            { value: "MIT", label: "open-source prompts" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-8 text-center">
              <div className="font-mono text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Platforms === */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
            Pick your platform
          </h2>
          <p className="mt-3 text-stone-600 dark:text-stone-400">
            Each one gets its own copywriting playbook.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 md:grid-cols-3 dark:border-stone-800 dark:bg-stone-800">
          {PLATFORMS.map((p) => (
            <Link
              key={p.slug}
              href={`/tools/${p.slug}`}
              className="group bg-white p-8 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  {p.label}
                </h3>
                <ArrowRight className="h-5 w-5 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-900 dark:group-hover:text-stone-100" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {p.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* === Features bento === */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
            Why ListForge
          </h2>
          <p className="mt-3 text-stone-600 dark:text-stone-400">
            What &ldquo;AI listing tools&rdquo; should have been from day one.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 md:grid-cols-3 md:grid-rows-2 dark:border-stone-800 dark:bg-stone-800">
          {/* Hero card — open-source prompts */}
          <div className="bg-white p-8 md:col-span-2 md:row-span-2 dark:bg-stone-950">
            <Eye className="h-7 w-7 text-stone-900 dark:text-stone-100" />
            <h3 className="mt-5 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Open-source prompts
            </h3>
            <p className="mt-3 max-w-md text-stone-600 dark:text-stone-400">
              The exact production prompt is public on GitHub under MIT.
              Audit it, fork it, run it yourself. No black box, no upsell-
              biased system messages hiding behind a paywall.
            </p>
            <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-4 font-mono text-xs leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
              <span className="text-stone-400">{"// listing-prompts.ts"}</span>
              <br />
              <span className="text-stone-900 dark:text-stone-100">export const</span>{" "}
              VARIANT_STYLE_RULES = {"{"}
              <br />
              &nbsp;&nbsp;conservative:{" "}
              <span className="text-stone-500">&quot;Stay strictly factual...&quot;</span>,
              <br />
              &nbsp;&nbsp;balanced:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-stone-500">&quot;Mix specs + benefit...&quot;</span>,
              <br />
              &nbsp;&nbsp;creative:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-stone-500">&quot;Lead with the pain...&quot;</span>,
              <br />
              {"}"};
            </div>
            <a
              href="https://github.com/Dariamks/listforge-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-stone-900 underline underline-offset-4 hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300"
            >
              <Code2 className="h-4 w-4" />
              github.com/Dariamks/listforge-prompts
            </a>
          </div>

          {/* Speed */}
          <div className="bg-white p-6 dark:bg-stone-950">
            <Zap className="h-6 w-6 text-stone-900 dark:text-stone-100" />
            <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
              Streams in 8 seconds
            </h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              3 variants generated in parallel, multiplexed token-by-token over
              NDJSON. No 40s spinner.
            </p>
          </div>

          {/* Locale */}
          <div className="bg-white p-6 dark:bg-stone-950">
            <Globe className="h-6 w-6 text-stone-900 dark:text-stone-100" />
            <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
              6 locales, native
            </h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              UK → British English. DE → entire listing in German. JP →
              Japanese. Locally idiomatic, not just translated.
            </p>
          </div>
        </div>

        {/* Supporting features row */}
        <div className="mt-px grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 md:grid-cols-3 dark:border-stone-800 dark:bg-stone-800">
          {[
            {
              Icon: ShieldCheck,
              t: "Marketplace-policy aware",
              b: "No 'BEST EVER' on Amazon. Hooks-first on TikTok Shop. Brand-voice on Shopify.",
            },
            {
              Icon: Target,
              t: "No fabricated specs",
              b: "The model is locked to features YOU provide — no invented certs or claims.",
            },
            {
              Icon: Sparkles,
              t: "Free, no account",
              b: "Per-IP hourly limit. Hit it, wait. No card, no email, no upgrade gotcha.",
            },
          ].map(({ Icon, t, b }) => (
            <div key={t} className="bg-white p-6 dark:bg-stone-950">
              <Icon className="h-6 w-6 text-stone-900 dark:text-stone-100" />
              <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
                {t}
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                {b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* === How it works === */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
            Three steps. Zero ceremony.
          </h2>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 md:grid-cols-3 dark:border-stone-800 dark:bg-stone-800">
          {[
            {
              step: "01",
              title: "Paste your raw notes",
              body: "Bullet-style features, half-thoughts, EN/CN/JP mixed — the model handles it.",
            },
            {
              step: "02",
              title: "Pick platform & locale",
              body: "Each combo has its own copywriting playbook. We respect their rules so you don't get suppressed.",
            },
            {
              step: "03",
              title: "Watch it stream. Copy.",
              body: "Title, 5 bullets, description, backend keywords, plus 8–12 SEO/PPC keywords. All free.",
            },
          ].map(({ step, title, body }) => (
            <li key={step} className="bg-white p-6 dark:bg-stone-950">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold tracking-tight text-stone-300 dark:text-stone-700">
                  {step}
                </span>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  {title}
                </h3>
              </div>
              <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* === Categories === */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
            Built for every category
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
            Category-specific guides with sample listings and copy hooks.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/guides/amazon-${c.slug}-listing-optimizer`}
              className="group flex items-center justify-between rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 dark:hover:border-stone-700 dark:hover:bg-stone-900"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-stone-400" />
                {c.label}
              </span>
              <ArrowRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-stone-900 dark:group-hover:text-stone-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* === CTA === */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-2xl border border-stone-900 bg-stone-900 px-8 py-14 text-center text-white sm:px-12 sm:py-16 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to forge your first listing?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300 dark:text-stone-700">
            No signup. No credit card. Paste notes, hit generate, copy the result.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="accent" className="h-12 px-7 text-base">
              <Link href="/tools/amazon-listing-optimizer">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white dark:border-stone-900/30 dark:bg-transparent dark:text-stone-900 dark:hover:bg-stone-900/10"
            >
              <a
                href="https://github.com/Dariamks/listforge-prompts"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="h-4 w-4" /> Read the prompts
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
