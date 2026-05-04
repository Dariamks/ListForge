import Link from "next/link";
import { Flame, Code2 } from "lucide-react";
import { SITE } from "@/lib/utils";

const NAV = [
  { href: "/tools/amazon-listing-optimizer", label: "Amazon" },
  { href: "/tools/tiktok-shop-optimizer", label: "TikTok Shop" },
  { href: "/tools/shopify-product-optimizer", label: "Shopify" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/90 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            <Flame className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-stone-900 dark:text-stone-100">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex dark:text-stone-400">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="transition-colors hover:text-stone-900 dark:hover:text-stone-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Dariamks/listforge-prompts"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline-flex dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            <Code2 className="h-4 w-4" />
          </a>
          <Link
            href="/tools/amazon-listing-optimizer"
            className="inline-flex h-9 items-center rounded-md bg-stone-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            Try free
          </Link>
        </div>
      </div>
    </header>
  );
}
