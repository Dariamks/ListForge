import type { Metadata } from "next";
import { ListingOptimizer } from "@/components/ListingOptimizer";

export const metadata: Metadata = {
  title: "TikTok Shop Title & Description Generator — Free AI Listing Tool",
  description:
    "Hook-first product titles and creator-style descriptions for TikTok Shop. Built to win short-form discovery and impulse-buy traffic.",
  alternates: { canonical: "/tools/tiktok-shop-optimizer" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          TikTok Shop Listing Optimizer
        </h1>
        <p className="mt-3 text-stone-600 dark:text-stone-400">
          Hook-driven titles, scroll-stopping bullets, and creator-style
          descriptions tuned for TikTok Shop&apos;s short-form discovery engine.
          Free, no signup, no fluff.
        </p>
      </div>

      <ListingOptimizer platform="tiktok-shop" />
    </div>
  );
}
