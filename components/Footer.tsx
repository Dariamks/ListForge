import Link from "next/link";
import { Flame } from "lucide-react";
import { SITE } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-50 py-12 dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                <Flame className="h-4 w-4" strokeWidth={2.5} />
              </span>
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
              Free AI listing optimizer for cross-border sellers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Tools</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><Link href="/tools/amazon-listing-optimizer" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">Amazon Listing Optimizer</Link></li>
              <li><Link href="/tools/tiktok-shop-optimizer" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">TikTok Shop Optimizer</Link></li>
              <li><Link href="/tools/shopify-product-optimizer" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">Shopify Product Optimizer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><Link href="/guides" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">All guides</Link></li>
              <li><Link href="/guides/amazon-title-best-practices" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">Amazon title rules</Link></li>
              <li><Link href="/guides/backend-keywords-explained" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">Backend keywords 101</Link></li>
              <li>
                <a
                  href="https://github.com/Dariamks/listforge-prompts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                >
                  Open-source prompts ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">About</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><Link href="/about" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">About {SITE.name}</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">Privacy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">Terms</Link></li>
              <li><a href={`mailto:${SITE.email}`} className="transition-colors hover:text-stone-900 dark:hover:text-stone-100">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-500">
          © {year} {SITE.name}. Not affiliated with Amazon, TikTok, or Shopify.
        </div>
      </div>
    </footer>
  );
}
