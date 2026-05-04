import type { Metadata } from "next";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for using ${SITE.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 leading-7 text-stone-700 dark:text-stone-300">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: 2026-01-01</p>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">Use of the service</h2>
      <p>
        {SITE.name} is provided as-is, free of charge, with no warranty. You are
        responsible for reviewing all generated copy for accuracy and compliance
        with marketplace policies before publishing it to your store.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">Acceptable use</h2>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>No generating copy that infringes trademarks or makes false claims.</li>
        <li>No abusive automated scraping of our endpoints.</li>
        <li>No re-selling our service as your own SaaS without permission.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">Disclaimer</h2>
      <p>
        {SITE.name} is not affiliated with Amazon, TikTok, Shopify, or any other
        marketplace. Marketplace names and logos are trademarks of their
        respective owners.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">Contact</h2>
      <p>
        Email{" "}
        <a className="text-stone-600 underline" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </p>
    </article>
  );
}
