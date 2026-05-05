import type { Metadata } from "next";
import { ListingOptimizer } from "@/components/ListingOptimizer";

export const metadata: Metadata = {
  title: "Shopify Product Description Generator — Free AI Copy for DTC Stores",
  description:
    "Brand-voice product descriptions for Shopify. Premium tone, zero filler — built for DTC merchants who care about CRO.",
  alternates: { canonical: "/tools/shopify-product-optimizer" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-10 max-w-3xl sm:mb-14">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          Shopify
        </div>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Shopify Product Optimizer
        </h1>
        <p className="mt-4 text-pretty text-lg text-stone-600 dark:text-stone-400">
          Brand-voice product copy for DTC Shopify stores. Hero moment first,
          features second, specs third — written like a real copywriter, not a
          chat bot.
        </p>
      </div>

      <ListingOptimizer platform="shopify" />
    </div>
  );
}
