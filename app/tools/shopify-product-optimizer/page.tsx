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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Shopify Product Optimizer
        </h1>
        <p className="mt-3 text-stone-600 dark:text-stone-400">
          Brand-voice product copy for DTC Shopify stores. Hero moment first,
          features second, specs third — written like a real copywriter, not a
          chat bot.
        </p>
      </div>

      <ListingOptimizer platform="shopify" />
    </div>
  );
}
