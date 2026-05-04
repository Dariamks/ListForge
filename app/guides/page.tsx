import Link from "next/link";
import type { Metadata } from "next";
import { ALL_GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides — Marketplace listing optimization, by category and platform",
  description:
    "Free, practical guides on writing high-converting listings for Amazon, TikTok Shop, and Shopify, organized by product category.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  const editorial = ALL_GUIDES.filter((g) => g.kind === "editorial");
  const pseo = ALL_GUIDES.filter((g) => g.kind === "pseo");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Guides</h1>
        <p className="mt-3 text-stone-600 dark:text-stone-400">
          Practical, marketplace-specific copy advice. No fluff, no
          regurgitated &ldquo;10 tips&rdquo; listicles.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Editorial</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {editorial.map((g) => (
            <li
              key={g.slug}
              className="rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300 dark:border-stone-800 dark:bg-stone-950"
            >
              <Link href={`/guides/${g.slug}`} className="block">
                <h3 className="font-semibold">{g.title}</h3>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {g.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">By category & platform</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {pseo.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="block rounded-md border border-stone-200 bg-white px-4 py-3 text-sm transition-colors hover:border-stone-300 hover:text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-900/60"
              >
                {g.title.replace(" — Free AI Copy Generator", "")}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
