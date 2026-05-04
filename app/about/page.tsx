import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Sparkles, Zap, Eye, Globe, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${SITE.name} — why a solo indie dev built a free AI listing tool with open-source prompts.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 leading-7 text-stone-700 dark:text-stone-300">
      {/* Hero */}
      <header className="mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300">
          <Sparkles className="h-3 w-3" /> About {SITE.name}
        </span>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Free, transparent AI listings — built by one{" "}
          <span style={{ color: "var(--accent)" }}>indie dev</span>{" "}
          over a weekend
        </h1>
        <p className="mt-5 text-pretty text-lg text-stone-600 dark:text-stone-400">
          {SITE.name} is a free AI listing optimizer for Amazon, TikTok Shop,
          and Shopify sellers. No signup, no API key, no email harvesting —
          and the production prompts are{" "}
          <a
            href="https://github.com/Dariamks/listforge-prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-600 hover:underline"
          >
            open-sourced on GitHub
          </a>
          .
        </p>
      </header>

      <section className="prose pstone-zinc max-w-none dark:pstone-invert">
        <h2 className="mt-10 text-xl font-semibold text-stone-900 dark:text-white">
          Why this exists
        </h2>
        <p>
          Most &ldquo;AI listing tools&rdquo; for ecommerce sellers share the
          same two problems. They start at roughly{" "}
          <strong>$30&ndash;$50 per month</strong>, which is a hard sell for
          anyone running a handful of SKUs or testing a new niche. And they
          treat the underlying prompt like a trade secret — so you&rsquo;re
          pasting your product details into a black box with no way to tell
          whether it&rsquo;s nudging outputs toward an upsell, injecting
          generic filler, or just paraphrasing the last thing ChatGPT said.
        </p>
        <p>
          {SITE.name} is the version I wanted to use myself: free, gated by a
          per-IP hourly limit instead of a signup wall, and fully transparent
          about how it works. The{" "}
          <a
            href="https://github.com/Dariamks/listforge-prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:underline"
          >
            entire production prompt file
          </a>{" "}
          is public on GitHub under MIT license. Read it before you paste
          your next product into the tool — that&rsquo;s the whole idea.
        </p>
        <p>
          Building this as a solo indie project means a few things stay
          small on purpose: no venture funding, no sales team, no aggressive
          retargeting emails. The trade-off is that I can keep the tool
          genuinely free for the long tail of sellers who just need a clean
          listing draft and don&rsquo;t want to commit to another SaaS bill.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-stone-900 dark:text-white">
          What makes it different
        </h2>
        <ul className="mt-4 grid gap-4 not-prose sm:grid-cols-2">
          <li className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <Eye className="h-5 w-5 text-stone-500" />
            <h3 className="mt-2 font-semibold text-stone-900 dark:text-white">
              Open-source prompts
            </h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              The exact production prompt file is{" "}
              <a
                href="https://github.com/Dariamks/listforge-prompts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 hover:underline"
              >
                public on GitHub
              </a>{" "}
              under MIT license. Read it. Fork it. Submit a PR.
            </p>
          </li>
          <li className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <Zap className="h-5 w-5 text-stone-500" />
            <h3 className="mt-2 font-semibold text-stone-900 dark:text-white">
              3 streamed variants
            </h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Conservative (spec-driven), Balanced (mainstream), Creative
              (pain-point hook). Each one is a structurally different angle —
              not a paraphrase.
            </p>
          </li>
          <li className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <Globe className="h-5 w-5 text-stone-500" />
            <h3 className="mt-2 font-semibold text-stone-900 dark:text-white">
              Locale-aware
            </h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Pick &ldquo;United Kingdom&rdquo; → British English. Pick
              &ldquo;Germany&rdquo; → entire listing in German. Currently
              handles US, UK, AU, CA, DE, FR, JP.
            </p>
          </li>
          <li className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <Sparkles className="h-5 w-5 text-stone-500" />
            <h3 className="mt-2 font-semibold text-stone-900 dark:text-white">
              Free, no account
            </h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Per-IP hourly rate limit. Hit the cap, wait an hour. No card,
              no email, no &ldquo;upgrade for the real prompts&rdquo;
              gotcha.
            </p>
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-stone-900 dark:text-white">
          The build
        </h2>
        <p>
          {SITE.name} is a Next.js 16 app deployed on Vercel. It uses{" "}
          <a
            href="https://www.deepseek.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:underline"
          >
            DeepSeek
          </a>{" "}
          as the LLM backend (roughly 1/30 the output-token cost of GPT-4 at
          comparable listing quality — which is what makes the free tier
          sustainable). The Vercel AI SDK&apos;s <code>streamObject</code>{" "}
          function powers the parallel-streaming UI: three variants stream
          back simultaneously, multiplexed over a single NDJSON response.
          Rate limiting runs on Upstash Redis with a sliding-window token
          bucket. Total codebase: ~3,500 LOC.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-stone-900 dark:text-white">
          What this isn&apos;t
        </h2>
        <ul>
          <li>
            <strong>Not a Helium 10 / Jungle Scout replacement.</strong> No
            keyword research, PPC analytics, or competitor tracking.
          </li>
          <li>
            <strong>Not financial / legal advice.</strong> If you sell in a
            regulated category (supplements, electronics, kids&apos; products,
            etc.), have a human review the output before you publish.
          </li>
          <li>
            <strong>Not a moat.</strong> The prompts are open. If you can run
            this better than I do, please fork the code and out-execute me.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-stone-900 dark:text-white">
          Roadmap
        </h2>
        <p>
          Honest roadmap: there isn&apos;t a hard one. {SITE.name} is run
          break-even by a solo dev. Things being considered, in roughly
          decreasing likelihood:
        </p>
        <ul>
          <li>More target locales (Spanish, Italian, Korean)</li>
          <li>
            CSV bulk upload (likely behind a small paid tier — the free tier
            stays free)
          </li>
          <li>
            Comparison view (paste your existing listing → diff against
            generated alternatives)
          </li>
          <li>Optional GPT-4 / Claude backend for users who want it</li>
        </ul>
        <p>
          If you have a feature you actively need, open an issue on the{" "}
          <a
            href="https://github.com/Dariamks/listforge-prompts/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:underline"
          >
            prompts repo
          </a>{" "}
          or email me directly.
        </p>
      </section>

      {/* Contact + CTA */}
      <section className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-900/50 dark:bg-stone-950/40">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
          Get in touch
        </h2>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
          Bug reports, feature requests, prompt feedback, or just hello —
          all welcome.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="default">
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {SITE.email}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href="https://github.com/Dariamks/listforge-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Code2 className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Try {SITE.name} →</Link>
          </Button>
        </div>
      </section>
    </article>
  );
}
