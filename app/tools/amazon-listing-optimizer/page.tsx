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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Amazon Listing Optimizer
        </h1>
        <p className="mt-3 text-stone-600 dark:text-stone-400">
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
    <section className="mt-16 max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
      <dl className="mt-6 space-y-4">
        {faqs.map(({ q, a }) => (
          <div
            key={q}
            className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-950"
          >
            <dt className="font-semibold">{q}</dt>
            <dd className="mt-1 text-sm text-stone-600 dark:text-stone-400">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
