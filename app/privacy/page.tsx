import type { Metadata } from "next";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 leading-7 text-stone-700 dark:text-stone-300">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: 2026-01-01</p>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">What we collect</h2>
      <p>
        {SITE.name} is a free tool that does not require an account. We collect
        the minimum data needed to operate the service:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>Anonymous usage analytics (Google Analytics) — page views, country, device.</li>
        <li>IP-based rate-limit counters held in memory (not stored long-term).</li>
        <li>Inputs you submit to the optimizer are sent to our LLM provider (DeepSeek) for processing and are not retained on our servers.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">What we don&apos;t do</h2>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>We do not sell your data.</li>
        <li>We do not train models on your inputs.</li>
        <li>We do not require login or email.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">Cookies & ads</h2>
      <p>
        We may show contextual ads via Google AdSense. AdSense may use cookies to
        personalize ads. You can opt out via{" "}
        <a className="text-stone-600 underline" href="https://www.google.com/settings/ads">
          Google Ads Settings
        </a>
        .
      </p>

      <h2 className="mt-8 text-xl font-semibold text-stone-900 dark:text-white">Your rights & contact</h2>
      <p>
        For privacy questions, data access requests, or deletion requests, email{" "}
        <a className="text-stone-900 underline underline-offset-4 dark:text-stone-100" href={`mailto:${SITE.privacyEmail}`}>{SITE.privacyEmail}</a>
        . We respond within 30 days.
      </p>
    </article>
  );
}
