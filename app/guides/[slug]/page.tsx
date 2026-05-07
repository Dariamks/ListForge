import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ALL_GUIDES, getGuide, parsePseoSlug } from "@/lib/guides";
import { getCategoryBySlug, getSubNiche } from "@/lib/categories";
import { getCategoryContent } from "@/lib/category-content";
import { getSampleListing } from "@/lib/sample-listings";
import { PLATFORM_LABEL } from "@/lib/listing-prompts";
import { EDITORIAL_BODY } from "@/lib/editorial-content";
import { ListingOptimizer } from "@/components/ListingOptimizer";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return ALL_GUIDES.map((g) => ({ slug: g.slug }));
}

type Params = Promise<{ slug: string }>;

/**
 * Per-platform list of editorial-guide slugs to surface as "Related reading"
 * on each pSEO page. Adds a real internal-linking signal Google uses to
 * understand topic clusters — and gives readers a deeper-dive path so they
 * don't bounce.
 */
const RELATED_EDITORIAL: Record<
  "amazon" | "tiktok-shop" | "shopify",
  string[]
> = {
  amazon: [
    "amazon-title-best-practices",
    "backend-keywords-explained",
    "amazon-a-plus-content-templates-2026",
  ],
  "tiktok-shop": [
    "tiktok-shop-product-title-formula",
    "tiktok-shop-algorithm-demystified",
  ],
  shopify: [
    "shopify-product-description-template",
    "shopify-cro-checklist-for-dtc",
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const pseo = parsePseoSlug(slug);

  if (pseo) {
    return (
      <PseoView
        platform={pseo.platform}
        categorySlug={pseo.categorySlug}
        subNicheSlug={pseo.subNicheSlug}
      />
    );
  }

  return <EditorialView slug={slug} />;
}

function PseoView({
  platform,
  categorySlug,
  subNicheSlug,
}: {
  platform: "amazon" | "tiktok-shop" | "shopify";
  categorySlug: string;
  subNicheSlug: string | null;
}) {
  const category = getCategoryBySlug(categorySlug)!;
  const subNiche = subNicheSlug ? getSubNiche(categorySlug, subNicheSlug)! : null;
  const platformLabel = PLATFORM_LABEL[platform];

  // Per-(platform, category) AI-generated sample listing — only on top-level
  // category pages (not sub-niche pages). Provides ~400 words of unique
  // content per page so Google can index the 36 category pSEO pages.
  const sampleListing = subNiche ? null : getSampleListing(platform, categorySlug);
  const categoryContent = getCategoryContent(categorySlug);

  // When rendering a sub-niche page, the sub-niche's label/hook/pains take
  // precedence; the parent category is surfaced via breadcrumb + "broader"
  // link so buyers understand the hierarchy.
  const displayLabel = subNiche?.label ?? category.label;
  const displayHook = subNiche?.hook ?? category.hook;
  const displayPains = subNiche?.pains ?? category.pains;

  const canonicalInner = subNiche
    ? `${category.slug}-${subNiche.slug}`
    : category.slug;

  // Cross-platform links keep the same granularity (sub-niche <-> sub-niche).
  const crossPlatformSlug = (p: typeof platform) =>
    `${p}-${canonicalInner}-listing-optimizer`;

  // Siblings: when on a sub-niche page, link other sub-niches in the same
  // category; when on the parent category page, link the sub-niches below it.
  const siblings = subNiche
    ? (category.subNiches ?? []).filter((s) => s.slug !== subNiche.slug)
    : (category.subNiches ?? []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-xs text-stone-500">
        <Link href="/guides" className="hover:text-stone-600">
          Guides
        </Link>{" "}
        / <span className="text-stone-700 dark:text-stone-300">{platformLabel}</span>{" "}
        /{" "}
        {subNiche ? (
          <>
            <Link
              href={`/guides/${platform}-${category.slug}-listing-optimizer`}
              className="text-stone-700 hover:text-stone-600 dark:text-stone-300"
            >
              {category.label}
            </Link>{" "}
            /{" "}
            <span className="text-stone-700 dark:text-stone-300">{subNiche.label}</span>
          </>
        ) : (
          <span className="text-stone-700 dark:text-stone-300">{category.label}</span>
        )}
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {platformLabel} {displayLabel} Listing Optimizer
        </h1>
        <p className="mt-3 text-lg text-stone-600 dark:text-stone-300">{displayHook}</p>
      </header>

      {/* Pain points → builds intent before showing the tool */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          Why {displayLabel.toLowerCase()} listings struggle
        </h2>
        <ul className="mt-4 space-y-2">
          {displayPains.map((p) => (
            <li
              key={p}
              className="flex gap-3 rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-stone-600" />
              <span className="text-sm text-stone-700 dark:text-stone-300">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick wins — sub-niche-specific actionable tips, each corresponding
          to one of the pain points above. Adds ~130 words of unique copy per
          sub-niche page to lift Google's content-quality signal. */}
      {subNiche && subNiche.tips.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            Quick wins for your {subNiche.label.toLowerCase()} listing
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            The fixes that move the needle fastest — applied directly to your copy by the optimizer below.
          </p>
          <ol className="mt-4 space-y-3">
            {subNiche.tips.map((tip, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950/50"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-stone-700 dark:text-stone-300">{tip}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Winning title formula — adds ~50 words of unique, platform-specific
          guidance per page. Renders only on category-level pages (not
          sub-niche) where we have the sample listing to anchor the example. */}
      {sampleListing && categoryContent && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">
            Winning {category.label.toLowerCase()} title formula on {platformLabel}
          </h2>
          <p className="mt-3 max-w-3xl text-stone-700 dark:text-stone-300">
            {categoryContent.winningTitleHints[platform]}
          </p>
          <figure className="mt-5 max-w-3xl rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-stone-950/50">
            <figcaption className="text-xs uppercase tracking-wider text-stone-500">
              Example title our optimizer just generated
            </figcaption>
            <blockquote className="mt-2 text-base font-medium leading-snug text-stone-900 dark:text-stone-100">
              {sampleListing.title}
            </blockquote>
          </figure>
        </section>
      )}

      {/* Sample listing — full title + bullets + description preview.
          ~400 words of unique content per (platform, category) combo. */}
      {sampleListing && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">
            See it work — sample {category.label.toLowerCase()} listing for {platformLabel}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            Generated by ListForge for a representative {category.label.toLowerCase()}{" "}
            product. Your output uses your features, not this one.
          </p>

          <div className="mt-6 max-w-3xl space-y-6 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-950">
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-500">
                Title
              </div>
              <p className="mt-1 font-medium text-stone-900 dark:text-stone-100">
                {sampleListing.title}
              </p>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-stone-500">
                Bullets
              </div>
              <ul className="mt-2 space-y-2">
                {sampleListing.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-stone-700 dark:text-stone-300"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <details className="group">
              <summary className="cursor-pointer text-xs uppercase tracking-wider text-stone-500 hover:text-stone-700">
                Description (click to expand)
              </summary>
              <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                {sampleListing.description}
              </div>
            </details>

            <details>
              <summary className="cursor-pointer text-xs uppercase tracking-wider text-stone-500 hover:text-stone-700">
                Backend keywords + SEO targets
              </summary>
              <div className="mt-3 space-y-3 text-sm text-stone-700 dark:text-stone-300">
                <div>
                  <span className="font-medium">Backend:</span>{" "}
                  <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs dark:bg-stone-800">
                    {sampleListing.backendKeywords}
                  </code>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sampleListing.seoKeywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-md bg-stone-100 px-2 py-0.5 text-xs dark:bg-stone-800"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>
      )}

      {/* The tool, pre-configured to the parent category (dropdown only
          carries category-level slugs). */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">
          Generate your {displayLabel.toLowerCase()} listing
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
          Pre-loaded for {platformLabel} & {displayLabel}. Drop in your raw
          notes — get a buyer-ready listing in seconds.
        </p>
        <div className="mt-6">
          <ListingOptimizer platform={platform} defaultCategory={category.slug} />
        </div>
      </section>

      {/* Common mistakes — adds ~120 words of unique, category-specific
          guidance per page. Renders only on category-level pages. */}
      {!subNiche && categoryContent && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">
            Mistakes that get {category.label.toLowerCase()} listings buried
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            The 3 patterns we see kill conversions for {platformLabel}{" "}
            {category.label.toLowerCase()} sellers — and what to do instead.
          </p>
          <dl className="mt-6 max-w-3xl divide-y divide-stone-200 dark:divide-stone-800">
            {categoryContent.commonMistakes.map((m, i) => (
              <div key={i} className="grid gap-2 py-5 sm:grid-cols-[auto_1fr] sm:gap-6">
                <dt className="flex items-start gap-2 text-sm font-medium text-stone-900 dark:text-stone-100">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {m.mistake}
                </dt>
                <dd className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {m.why}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Internal-link block: same (sub-)niche, other platforms */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">
          Same {subNiche ? "sub-niche" : "category"}, other platforms
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {(["amazon", "tiktok-shop", "shopify"] as const)
            .filter((p) => p !== platform)
            .map((p) => (
              <Link
                key={p}
                href={`/guides/${crossPlatformSlug(p)}`}
                className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm hover:border-stone-300 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-900/60"
              >
                <span>
                  {PLATFORM_LABEL[p]} {displayLabel} optimizer
                </span>
                <ArrowRight className="h-4 w-4 text-stone-400" />
              </Link>
            ))}
        </div>
      </section>

      {/* Sibling sub-niches (if any) */}
      {siblings.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">
            More {category.label} sub-niches on {platformLabel}
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/guides/${platform}-${category.slug}-${s.slug}-listing-optimizer`}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm hover:border-stone-300 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-900/60"
              >
                {platformLabel} {s.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Link up to parent category when on a sub-niche page */}
      {subNiche && (
        <section className="mt-12">
          <Link
            href={`/guides/${platform}-${category.slug}-listing-optimizer`}
            className="inline-flex items-center gap-2 text-sm text-stone-700 hover:underline dark:text-stone-400"
          >
            Broader guide: {platformLabel} {category.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {/* Internal-link block: same platform, other categories */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">
          More {platformLabel} category guides
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {ALL_GUIDES.filter(
            (g) =>
              g.kind === "pseo" &&
              // Only top-level category pages (not sub-niche pages), for clean navigation.
              g.slug.match(
                new RegExp(`^${platform}-[a-z-]+-listing-optimizer$`)
              ) &&
              parsePseoSlug(g.slug)?.subNicheSlug === null &&
              g.slug !== `${platform}-${category.slug}-listing-optimizer`
          )
            .slice(0, 9)
            .map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm hover:border-stone-300 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-900/60"
              >
                {g.title.replace(` — Free AI Copy Generator`, "")}
              </Link>
            ))}
        </div>
      </section>

      {/* Related editorial guides — internal links signal topic-cluster
          relevance to Google and give readers a deeper-dive path. */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">Related {platformLabel} guides</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {RELATED_EDITORIAL[platform]
            .map((s) => getGuide(s))
            .filter((g): g is NonNullable<typeof g> => Boolean(g))
            .map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-900/60"
              >
                <div className="text-xs uppercase tracking-wider text-stone-500">
                  Guide
                </div>
                <div className="mt-1 font-medium text-stone-900 group-hover:text-[var(--accent)] dark:text-stone-100">
                  {g.title.replace(/\s—.*$/, "")}
                </div>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                  {g.description}
                </p>
              </Link>
            ))}
        </div>
      </section>

      <FaqJsonLd platformLabel={platformLabel} categoryLabel={displayLabel} />
    </div>
  );
}

/** Editorial views — hand-curated long-form for topical authority */
function EditorialView({ slug }: { slug: string }) {
  const guide = getGuide(slug)!;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-xs text-stone-500">
        <Link href="/guides" className="hover:text-stone-600">
          Guides
        </Link>
      </nav>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-stone-600 dark:text-stone-400">{guide.description}</p>

      <div className="mt-8 space-y-4 text-stone-700 leading-7 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-stone-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_code]:rounded [&_code]:bg-stone-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm dark:text-stone-300 dark:[&_h2]:text-stone-100 dark:[&_h3]:text-stone-100 dark:[&_code]:bg-stone-800">
        {EDITORIAL_BODY[slug] ?? <p>Coming soon.</p>}
      </div>

      <div className="mt-12 rounded-xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-900/50 dark:bg-stone-950/30">
        <h3 className="font-semibold">Stop reading. Start forging.</h3>
        <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">
          You don&apos;t need another listicle. Try the free generator.
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/tools/amazon-listing-optimizer">
              Open the optimizer <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function FaqJsonLd({
  platformLabel,
  categoryLabel,
}: {
  platformLabel: string;
  categoryLabel: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is this ${platformLabel} listing optimizer free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ListForge is free for everyone, no signup. We rate-limit per IP to keep API costs sustainable.`,
        },
      },
      {
        "@type": "Question",
        name: `Will it invent ${categoryLabel.toLowerCase()} features I didn't list?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No. The system prompt locks the model to features you provide. It won't claim certifications, materials, or specs you didn't list.`,
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
