import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ALL_GUIDES, getGuide, parsePseoSlug } from "@/lib/guides";
import { getCategoryBySlug, getSubNiche } from "@/lib/categories";
import { PLATFORM_LABEL } from "@/lib/listing-prompts";
import { EDITORIAL_BODY } from "@/lib/editorial-content";
import { ListingOptimizer } from "@/components/ListingOptimizer";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return ALL_GUIDES.map((g) => ({ slug: g.slug }));
}

type Params = Promise<{ slug: string }>;

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
