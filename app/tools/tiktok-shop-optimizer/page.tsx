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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-10 max-w-3xl sm:mb-14">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          TikTok Shop
        </div>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          TikTok Shop Listing Optimizer
        </h1>
        <p className="mt-4 text-pretty text-lg text-stone-600 dark:text-stone-400">
          Hook-driven titles, scroll-stopping bullets, and creator-style
          descriptions tuned for TikTok Shop&apos;s short-form discovery engine.
          Free, no signup, no fluff.
        </p>
      </div>

      <ListingOptimizer platform="tiktok-shop" />
    </div>
  );
}
