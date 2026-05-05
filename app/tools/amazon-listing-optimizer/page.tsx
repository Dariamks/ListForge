import type { Metadata } from "next";
import { ListingOptimizer } from "@/components/ListingOptimizer";

export const metadata: Metadata = {
  title: "Amazon Listing Optimizer — Free AI Title, Bullets & Keywords Generator",
  description:
    "Paste your product notes, get an Amazon-policy-safe title, 5 bullet points, A+ description, and backend keywords in seconds. Free, no signup.",
  alternates: { canonical: "/tools/amazon-listing-optimizer" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-10 max-w-3xl sm:mb-14">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          Amazon
        </div>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Amazon Listing Optimizer
        </h1>
        <p className="mt-4 text-pretty text-lg text-stone-600 dark:text-stone-400">
          Generate a compliant, conversion-friendly Amazon listing — title (≤200
          chars), 5 bullet points (benefit-led), product description, and backend
          keywords (under 250 bytes). No fluff. No fabricated features.
        </p>
      </div>

      <ListingOptimizer platform="amazon" />

      <FaqSection />
    </div>
  );
}

function FaqSection() {
  const faqs = [
    {
      q: "Is this really free?",
      a: "Yes. Free for everyone, no signup. We rate-limit per IP to keep costs sustainable. Heavy users will eventually have a paid tier with higher limits, model choice (Claude/GPT-4o), and bulk export — but the free tier stays.",
    },
    {
      q: "Will Amazon penalize AI-generated copy?",
      a: "Amazon does not ban AI-generated copy. They penalize policy violations: prohibited phrases, fabricated claims, ALL CAPS, emojis, competitor brand mentions. Our prompts are tuned to avoid all of those.",
    },
    {
      q: "Will it invent features I didn't list?",
      a: "No. The system prompt explicitly instructs the model to only use features you provide. If you don't list a certification, it won't claim one.",
    },
    {
      q: "Can I use this for non-English markets?",
      a: "Right now we're optimized for US/UK English. German / Japanese / Spanish are on the roadmap. You can still feed Chinese/English mixed notes — output will be English.",
    },
  ];
  return (
    <section className="mt-20 max-w-3xl sm:mt-24">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
        FAQ
      </div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
        Common questions
      </h2>
      <dl className="mt-8 divide-y divide-stone-200 dark:divide-stone-800">
        {faqs.map(({ q, a }) => (
          <div key={q} className="py-6 first:pt-0">
            <dt className="text-base font-semibold text-stone-900 dark:text-stone-50">{q}</dt>
            <dd className="mt-2 text-pretty text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
