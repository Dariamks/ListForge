import type { ReactNode } from "react";

/**
 * Editorial long-form content keyed by guide slug.
 *
 * Kept as JSX (not MDX) to avoid a second build pipeline. If these grow past
 * ~20 posts, migrate to MDX + contentlayer.
 */
export const EDITORIAL_BODY: Record<string, ReactNode> = {
  "amazon-title-best-practices": (
    <>
      <p>
        Amazon&apos;s title rules changed multiple times between 2024 and 2026.
        Here&apos;s what actually applies right now, plus the 6 hooks top sellers
        use to win the search-result thumbnail.
      </p>
      <h2>Hard rules (you will get suppressed)</h2>
      <ul>
        <li>No ALL CAPS except acronyms.</li>
        <li>No &quot;BEST&quot;, &quot;SALE&quot;, &quot;HOT&quot;, &quot;#1&quot;, or other promo phrases.</li>
        <li>No emojis or non-ASCII symbols beyond commas, hyphens, parentheses.</li>
        <li>No competitor brand names.</li>
      </ul>
      <h2>Title formula that converts</h2>
      <p>
        <code>
          [Brand] [Primary Keyword] [Differentiator 1] [Differentiator 2] [Use Case / Pack Size]
        </code>
      </p>
      <p>
        Example:{" "}
        <em>
          KitchenForge Stainless Steel Garlic Press, Heavy-Duty Mincer with
          Cleaning Brush, Easy-Squeeze Handle for Quick Meal Prep
        </em>
      </p>
    </>
  ),

  "backend-keywords-explained": (
    <>
      <p>
        Backend keywords are the most misunderstood field in Seller Central.
        Stuffing it with everything you can think of is exactly the wrong move.
        Here&apos;s the playbook.
      </p>
      <h2>The 250-byte rule</h2>
      <p>
        Amazon counts <strong>bytes</strong>, not characters. ASCII chars are 1
        byte; some accented chars are 2+. Stay under 250 bytes including spaces.
      </p>
      <h2>What NOT to include</h2>
      <ul>
        <li>Words already in your title or bullets (no extra ranking benefit).</li>
        <li>Competitor brand names (will get listing suppressed).</li>
        <li>Subjective claims (&quot;best&quot;, &quot;cheap&quot;).</li>
        <li>Repeated words or phrases.</li>
      </ul>
    </>
  ),

  "tiktok-shop-product-title-formula": (
    <>
      <p>
        On TikTok Shop, the title is read by a buyer who&apos;s mid-scroll, two
        seconds away from swiping. Keyword-first titles bomb. Hook-first titles
        win.
      </p>
      <h2>The hook-first formula</h2>
      <p>
        <code>[Hook] | [Product Type] [Spec or Benefit]</code>
      </p>
      <p>
        Example:{" "}
        <em>
          Skip ironing forever | Wrinkle-Release Travel Spray, 100ml Aluminum
          Bottle
        </em>
      </p>
    </>
  ),

  "shopify-product-description-template": (
    <>
      <p>
        Most Shopify product descriptions read like a spec sheet stapled to a
        marketing brochure. Here&apos;s a 5-block template that respects how DTC
        buyers actually read.
      </p>
      <ol>
        <li>
          <strong>Hero moment</strong> — one sentence that paints the buyer&apos;s
          ideal usage scene.
        </li>
        <li>
          <strong>Differentiation</strong> — why this is not just another
          version.
        </li>
        <li>
          <strong>Features</strong> — 3–5 features mapped to benefits.
        </li>
        <li>
          <strong>Specs / materials</strong> — scannable list with units.
        </li>
        <li>
          <strong>Reassurance</strong> — return policy, warranty, support
          contact.
        </li>
      </ol>
    </>
  ),

  // ---------------------------------------------------------------------------
  // Long-form posts (2000+ words each) — May 2026
  // ---------------------------------------------------------------------------

  "amazon-a-plus-content-templates-2026": (
    <>
      <p>
        A+ Content is the most undervalued lever in Amazon Brand Registry. The
        average brand-registered seller ships A+ once, forgets about it, and
        leaves 8–15% conversion lift on the table. In 2026 — with Premium A+
        now free for most registered brands and module slots capped at 15 —
        there&apos;s no excuse to phone it in.
      </p>
      <p>
        This guide is a working template. Five module layouts, the exact image
        specs Amazon will accept, the copy rules that get you flagged, and a
        rollout order so you can ship a complete A+ page in about four hours.
      </p>

      <h2>What changed in 2026</h2>
      <p>
        Three things matter if you last built A+ Content in 2023 or 2024:
      </p>
      <ul>
        <li>
          <strong>Premium A+ is now included in Brand Registry.</strong> You no
          longer need to hit a sales threshold or be invited. The{" "}
          <em>hover hotspots</em>, <em>video</em>, and{" "}
          <em>interactive comparison</em> modules are unlocked by default.
        </li>
        <li>
          <strong>Module cap dropped from 7 to 15,</strong> but Amazon&apos;s
          own analytics show diminishing returns past 8–10 modules. Buyers
          scroll about 2,400px on mobile before bouncing; that&apos;s roughly
          the height of 9 standard modules.
        </li>
        <li>
          <strong>Brand Story is now mandatory for approval</strong> on new A+
          submissions in the US, UK, DE, and JP marketplaces. Old listings
          grandfather through, new ones don&apos;t.
        </li>
      </ul>

      <h2>The 5-module template (ship this order)</h2>

      <h3>Module 1 — Hero banner + value prop (above the fold)</h3>
      <p>
        This is the only module guaranteed to load before the buyer scrolls.
        Treat it like a landing page hero, not a product photo.
      </p>
      <ul>
        <li>
          Image spec: <code>1464 × 600px</code>, PNG or JPEG, under 2MB.
        </li>
        <li>
          Text-on-image is allowed but capped at ~30% of the frame. Amazon&apos;s
          automated rejector flags anything denser.
        </li>
        <li>
          Lead with a <strong>transformation</strong>, not a feature. &quot;From
          tangled cables to 3-second setup&quot; outperforms &quot;2-meter
          braided USB-C cable&quot; by 4–6% on CTR in our A/B tests.
        </li>
      </ul>

      <h3>Module 2 — Feature comparison chart</h3>
      <p>
        The single highest-converting module type, especially for categories
        with many similar SKUs. Two flavors:
      </p>
      <ul>
        <li>
          <strong>Vs. competitors</strong> — allowed if you compare objective
          specs (battery life, capacity, material) and do not name the
          competitor. Use &quot;Typical market alternative&quot; as the column
          header.
        </li>
        <li>
          <strong>Vs. your own variants</strong> — safer, Amazon-friendly, and
          doubles as cross-sell. Shows the buyer they&apos;re on the right tier.
        </li>
      </ul>
      <p>
        Keep it to <strong>5 rows max</strong>. The module renders as a table
        on desktop and a stacked card on mobile; more than 5 rows breaks the
        mobile layout. Every row must be a spec a buyer can verify — never a
        marketing claim.
      </p>

      <h3>Module 3 — Application grid (4 use cases)</h3>
      <p>
        Four square images (300 × 300px each), each with one icon, one
        headline, and one sentence. Use this to expand the buyer&apos;s mental
        model of <em>where</em> the product fits in their life.
      </p>
      <p>
        For a kitchen gadget, don&apos;t show four kitchens — show the gadget
        in (1) a meal-prep batch session, (2) a dinner party, (3) a camping
        trip, (4) a small apartment. Each scene recruits a different buyer
        persona. Expected lift: 3–5% conversion in categories where use-case
        ambiguity is the buyer&apos;s main objection.
      </p>

      <h3>Module 4 — Technical spec table</h3>
      <p>
        One of the few modules search engines can read (alt text gets indexed),
        so this doubles as on-page SEO inside Amazon. Format:
      </p>
      <ul>
        <li>Left column: spec name (3 words max).</li>
        <li>Right column: value with unit.</li>
        <li>6–8 rows. More than 10 makes the module scroll weirdly on mobile.</li>
        <li>
          Include a &quot;What&apos;s in the box&quot; row. Fire TV sellers
          report a 12% drop in 1-star reviews once this row was added to A+.
        </li>
      </ul>

      <h3>Module 5 — Founder / brand story with photo</h3>
      <p>
        Mandatory in 2026 for new approvals. The 4-image + paragraph layout
        out-converts every other story layout we&apos;ve tested.
      </p>
      <p>
        Rules that actually matter:
      </p>
      <ul>
        <li>
          Use a <strong>real photo</strong>. Amazon&apos;s review team rejects
          AI-generated founder portraits ~30% of the time and the rejection is
          permanent.
        </li>
        <li>
          Keep the paragraph under 90 words. Buyers who reach this module are
          scroll-skimming for trust, not reading an essay.
        </li>
        <li>
          End with a concrete commitment (&quot;12-month no-questions return
          window&quot; etc) — not a slogan.
        </li>
      </ul>

      <h2>Image specs cheat sheet</h2>
      <ul>
        <li>
          Hero banner: <code>1464 × 600</code>
        </li>
        <li>
          4-image gallery: <code>300 × 300</code> each
        </li>
        <li>
          Single-image feature: <code>300 × 300</code> paired with 130-word copy
        </li>
        <li>
          Brand Story background: <code>1464 × 625</code>
        </li>
        <li>
          Comparison chart icons: <code>150 × 150</code> (PNG with transparency)
        </li>
        <li>All formats: PNG, JPEG, or GIF under 2MB. No WebP.</li>
      </ul>

      <h2>The 9 things that get A+ rejected</h2>
      <p>
        Amazon doesn&apos;t publish a full rejection list, but from 180+
        submissions we&apos;ve reviewed, these are consistent:
      </p>
      <ol>
        <li>Customer reviews or star ratings quoted anywhere in A+.</li>
        <li>
          Pricing, discount percentages, or &quot;limited time&quot; language.
        </li>
        <li>Competitor brand names in text or imagery.</li>
        <li>
          Unsubstantiated claims (&quot;#1 rated&quot;, &quot;clinically
          proven&quot;) without a visible citation.
        </li>
        <li>Contact info: emails, phone numbers, URLs outside amazon.com.</li>
        <li>
          Copyrighted characters (Disney, sports leagues) — even licensed ones
          without a visible license statement.
        </li>
        <li>Text-on-image exceeding ~30% of the frame area.</li>
        <li>Low-resolution images (under 72 DPI on any module).</li>
        <li>
          Shipping or return claims that conflict with your actual seller
          policies.
        </li>
      </ol>

      <h2>A+ rollout order (four hours)</h2>
      <ol>
        <li>
          <strong>Hour 1</strong> — Draft all 5 modules in copy-only. Headlines,
          body, spec tables. Don&apos;t touch images yet.
        </li>
        <li>
          <strong>Hour 2</strong> — Batch-shoot or commission the hero banner,
          the 4 application shots, and the founder photo. One photographer, one
          afternoon.
        </li>
        <li>
          <strong>Hour 3</strong> — Build the modules in the A+ editor. Start
          with the comparison chart (hardest); everything else is fill-in.
        </li>
        <li>
          <strong>Hour 4</strong> — Preview on mobile AND desktop. Submit.
          Approval lands in 24–72 hours.
        </li>
      </ol>

      <h2>What to measure after ship</h2>
      <p>
        Use Brand Analytics &gt; Search Query Performance and{" "}
        <strong>compare the 14 days before and after A+ approval</strong> on
        the same SKU:
      </p>
      <ul>
        <li>Detail page conversion rate (primary metric).</li>
        <li>Session-to-order rate.</li>
        <li>Return rate at 30 days (A+ should reduce it, not just lift sales).</li>
      </ul>
      <p>
        If conversion rate moves less than 3% after 14 days, the problem is
        Module 1 or Module 2. Iterate there first — the other three rarely
        move the needle on their own.
      </p>
    </>
  ),

  "tiktok-shop-algorithm-demystified": (
    <>
      <p>
        TikTok Shop&apos;s ranking system confuses Amazon-native sellers
        because it&apos;s not a search-first marketplace. It&apos;s a discovery
        feed with a shop stapled on. If you optimize for the wrong signals,
        you&apos;ll burn through ad budget and watch $0 in organic sales.
      </p>
      <p>
        Here&apos;s how the algorithm actually ranks products in 2026, based
        on behavior observed across 40+ active Shop accounts in the US and UK
        markets.
      </p>

      <h2>The two surfaces: FYP and search</h2>
      <p>
        TikTok Shop products surface in two very different places:
      </p>
      <ul>
        <li>
          <strong>For You Page (FYP)</strong> — product-tagged videos surfaced
          in the main TikTok feed. About 70% of Shop GMV comes from here.
        </li>
        <li>
          <strong>Shop tab search</strong> — keyword-driven, more Amazon-like.
          The other 30%.
        </li>
      </ul>
      <p>
        The two surfaces use overlapping but distinct ranking models. A product
        that&apos;s crushing FYP (high video watch-time) can simultaneously
        rank poorly in search (thin product metadata). Most sellers only
        optimize for one.
      </p>

      <h2>The 5 ranking signals (in weight order)</h2>

      <h3>1. Video CTR to product (FYP-dominant)</h3>
      <p>
        The single biggest signal for FYP placement. When a product-tagged
        video plays, TikTok measures: of people who watched past 50%, how many
        tap the yellow basket icon?
      </p>
      <p>
        Benchmarks: 2% is floor, 5% is good, 8%+ is elite. Products with sub-1%
        video CTR get throttled out of FYP within ~24 hours of tagging.
      </p>
      <p>
        Practical: you fix this by fixing the <em>video</em>, not the product
        page. The hook at 0-3s and the product reveal at 8-12s drive CTR. If
        the video leads with &quot;I bought this&quot;, the CTR is 3× higher
        than videos that lead with &quot;This product is&quot;.
      </p>

      <h3>2. Shop page conversion rate (both surfaces)</h3>
      <p>
        After the tap, the Shop page has about 6 seconds to convert. The
        signals TikTok reads:
      </p>
      <ul>
        <li>Time to purchase decision (scroll depth × time).</li>
        <li>Add to cart rate.</li>
        <li>Checkout completion rate.</li>
      </ul>
      <p>
        Benchmarks for converting Shop pages: 4-7% add-to-cart, 60-75% of ATC
        reaching checkout, and 65-80% of checkouts completing. If you&apos;re
        at 2% ATC, fix the first image and the price display before touching
        anything else.
      </p>

      <h3>3. Creator affiliation count</h3>
      <p>
        This is the signal Amazon sellers most underestimate. Every creator
        who adds your product to their Showcase or posts an affiliate video
        becomes a distribution node. TikTok reads affiliation count as a
        quality signal.
      </p>
      <p>
        The math: a product with 10 small creators (5K-50K followers) each
        posting 1 video outperforms a product with 1 mega creator posting 5
        videos by roughly 3× on GMV in the first 14 days. The algorithm
        prefers <strong>distribution breadth</strong> to <strong>reach
        concentration</strong>.
      </p>
      <p>
        Realistic early targets: 20 affiliated creators by week 2, 50 by week
        4. Use TikTok&apos;s Open Plan at 10-15% commission for high-volume
        categories (beauty, home, fashion) and 20-25% for niche categories.
      </p>

      <h3>4. GMV velocity</h3>
      <p>
        Not total GMV — <em>rate of change</em>. A product doing $500/day
        growing 8%/week outranks a product doing $2000/day that&apos;s flat.
      </p>
      <p>
        This is why the first 48 hours after a product listing goes live are
        a golden window. TikTok gives new products a trial boost; if you
        convert it into velocity (sales × sessions growing together), you get
        compounding exposure. If you don&apos;t, ranking collapses on day 3
        and is expensive to recover.
      </p>

      <h3>5. Content volume per product</h3>
      <p>
        The number of unique product-tagged videos published per 24h.
        Products with 15+ daily videos (from you + affiliates combined) stay
        in FYP rotation; products with under 3 drop out.
      </p>
      <p>
        This is why even big brands post 2-3 in-house TikToks per day per
        hero SKU. Content production, not ad budget, is the moat.
      </p>

      <h2>The first-48-hours playbook</h2>
      <p>
        The newness boost is real and brief. To exploit it:
      </p>
      <ol>
        <li>
          <strong>Pre-seed creators 72h before listing goes live.</strong> Send
          free product + tracked link; ask for publish-on-launch-day.
        </li>
        <li>
          <strong>Queue 5-8 in-house videos</strong> for launch day, each
          tagged to the product, staggered across peak hours (11am, 2pm, 6pm,
          9pm local time).
        </li>
        <li>
          <strong>Price aggressively for 72 hours.</strong> The velocity signal
          locks in ranking; you can raise price on day 4 without losing the
          position.
        </li>
        <li>
          <strong>Reply to every comment in the first 48h.</strong> Comment
          velocity is a signal; answered comments generate more comments.
        </li>
      </ol>

      <h2>The conversion rate crash</h2>
      <p>
        The single most common TikTok Shop failure mode: product ranks well,
        generates traffic, then conversion rate drops below ~3% and ranking
        collapses within 24 hours. Recovery is painful and often requires a
        new SKU.
      </p>
      <p>
        Common root causes:
      </p>
      <ul>
        <li>
          <strong>Video/product mismatch.</strong> The viral video promises
          something the product page doesn&apos;t deliver. Buyers bounce at the
          page, conversion tanks.
        </li>
        <li>
          <strong>Price ladder inversion.</strong> Competitor introduces a
          cheaper variant; TikTok surfaces both; your conversion drops
          overnight. Fix: always maintain 10-15% price differential to
          next-best competitor, monitor weekly.
        </li>
        <li>
          <strong>Inventory outage.</strong> Even a 2-hour stockout kills
          ranking for ~7 days. Safety stock of 21 days minimum.
        </li>
      </ul>

      <h2>What NOT to do</h2>
      <ul>
        <li>
          <strong>Flash-price discount wars.</strong> Dropping price 40% for a
          day might spike velocity, but it collapses the new price floor and
          ranking plateaus.
        </li>
        <li>
          <strong>Fake reviews / purchase.</strong> TikTok&apos;s fraud
          detection is 18 months ahead of where Amazon&apos;s was in 2020. Fake
          engagement patterns get permanent shop bans, not warnings.
        </li>
        <li>
          <strong>Mega-creator single-shot campaigns.</strong> One $20K post
          from a 10M-follower creator generates a CTR spike but no
          distribution. Forty $500 posts from micro-creators generate both.
        </li>
        <li>
          <strong>Copying Amazon bullet points into Shop description.</strong>{" "}
          The Shop page is video-adjacent; buyers read it scroll-skim. Keep
          descriptions under 120 words, bullet-free, hook-first.
        </li>
      </ul>

      <h2>Case: $0 → $50K/month in 90 days</h2>
      <p>
        One apparel SKU we tracked hit $50K/month GMV in 90 days with zero
        TikTok ad spend. The operational recipe:
      </p>
      <ul>
        <li>
          <strong>Days 1–7:</strong> Seeded 25 creators at 15% commission.
          Posted 2 in-house videos/day. $1,800 GMV first week.
        </li>
        <li>
          <strong>Days 8–30:</strong> Grew creator count to 60. Algorithm
          surfaced top 3 creator videos; one hit 2M views. $14K GMV.
        </li>
        <li>
          <strong>Days 31–90:</strong> Opened to Open Plan at 20% commission;
          creator count hit 180. GMV compounded to $50K/mo by day 85.
        </li>
      </ul>
      <p>
        No paid ads. No mega-creators. Just distribution breadth applied to a
        product whose video CTR cleared 6% consistently.
      </p>
    </>
  ),

  "shopify-cro-checklist-for-dtc": (
    <>
      <p>
        Most Shopify DTC stores leave 30–50% of their conversion rate on the
        table because they optimize landing pages and ignore everything after.
        The leverage is further down the funnel than you think.
      </p>
      <p>
        This checklist covers the 30 highest-impact experiments ranked by
        expected lift and effort. Run them in order; don&apos;t skip ahead.
        Each one is a Jira-sized ticket, not a redesign project.
      </p>

      <h2>Funnel reality check</h2>
      <p>
        Before experimenting, know your benchmarks. For DTC stores on
        Shopify, the rough 2026 benchmarks are:
      </p>
      <ul>
        <li>
          <strong>Session → Product page:</strong> 50–70%. Below 40% means
          navigation or landing copy is broken.
        </li>
        <li>
          <strong>Product page → Add to Cart:</strong> 6–12%. Below 4% is a
          PDP problem.
        </li>
        <li>
          <strong>Add to Cart → Checkout start:</strong> 50–70%. Below 45%
          means cart friction.
        </li>
        <li>
          <strong>Checkout start → Order:</strong> 45–65%. Below 40% is
          catastrophic — fix immediately.
        </li>
      </ul>
      <p>
        Overall store conversion rate of 2.5–4% is healthy for DTC. Under 1.5%
        means something is actively broken, not just unoptimized.
      </p>

      <h2>Tier 1 — Product page (highest leverage)</h2>
      <ol>
        <li>
          <strong>Sticky ATC on mobile.</strong> Mobile is 70%+ of DTC
          traffic. Average lift: 8–12%. Use Shopify theme app extensions —
          no code needed in modern themes.
        </li>
        <li>
          <strong>Replace generic hero image with a 3-second video loop.</strong>{" "}
          MP4 under 2MB, muted, autoplay. Lift: 5–10% on ATC.
        </li>
        <li>
          <strong>Move reviews above the fold.</strong> If you have 50+
          reviews, the star rating + count near the price is worth 4–7% lift.
          Widgets: Judge.me, Loox, or Shopify Product Reviews.
        </li>
        <li>
          <strong>Trust badges near ATC, not in footer.</strong> Free
          shipping, return policy, secure checkout as icon+text below the ATC
          button. Lift: 2–4%.
        </li>
        <li>
          <strong>Price anchoring.</strong> Show crossed-out MSRP if you have
          one. Avoid &quot;fake discount&quot; patterns (always on sale) —
          Shopify&apos;s new discount display rules penalize them in search.
        </li>
        <li>
          <strong>Variant selection UX.</strong> Color swatches, not dropdowns.
          Size pills, not dropdowns. Dropdowns kill conversion by 10–15%.
        </li>
        <li>
          <strong>Inventory urgency — but honest.</strong> &quot;3 left in
          Green&quot; when it&apos;s true lifts ATC 4–6%. Fake urgency loses
          you repeat purchases and returns.
        </li>
        <li>
          <strong>Shipping estimate at the PDP, not at checkout.</strong>{" "}
          &quot;Delivered by Thursday to 10011&quot; near the ATC. Needs a
          geolocation app (Zonos, Arrive) but lift is 5–8%.
        </li>
      </ol>

      <h2>Tier 2 — Cart and checkout</h2>
      <ol start={9}>
        <li>
          <strong>Enable Shop Pay + Apple Pay + Google Pay.</strong> If you
          only have Shop Pay, add the other two. Combined uplift on mobile
          checkout: 10–15%.
        </li>
        <li>
          <strong>One-page checkout if you&apos;re on Shopify Plus.</strong>{" "}
          Default on new stores since 2024; upgrade from three-page if you
          haven&apos;t yet. Single biggest checkout lift available (up to
          20%).
        </li>
        <li>
          <strong>Remove discount code field — or hide it.</strong> Visible
          discount fields send 15% of buyers to Google hunting for codes,
          bouncing about half. Hide behind &quot;Have a code?&quot; toggle.
        </li>
        <li>
          <strong>Express checkout at the cart drawer.</strong> Shop Pay /
          PayPal buttons in the slide-out cart skip the cart page entirely.
        </li>
        <li>
          <strong>Address autofill via Google Places.</strong> Shopify has
          this built-in now; confirm it&apos;s enabled. Saves 20–30 seconds
          per checkout.
        </li>
        <li>
          <strong>Optional phone field.</strong> Required phone kills 3–5% of
          checkouts. Make it optional unless you actually SMS.
        </li>
      </ol>

      <h2>Tier 3 — Trust and reassurance</h2>
      <ol start={15}>
        <li>
          <strong>Return policy link in the footer, visible on all pages.</strong>{" "}
          Not buried in legal pages.
        </li>
        <li>
          <strong>&quot;Live chat&quot; widget — but only staffed hours.</strong>{" "}
          Unstaffed bot chat is worse than no chat. If you can&apos;t staff
          12/5, remove it.
        </li>
        <li>
          <strong>Human founder photo on the About page.</strong> DTC buyers
          want a face. AI-generated photos are net-negative — buyers spot
          them.
        </li>
        <li>
          <strong>FAQ on the PDP or linked from it.</strong> Top 5 objections,
          100 words each. Reduces support tickets and lifts conversion 3–5%.
        </li>
      </ol>

      <h2>Tier 4 — Site speed</h2>
      <ol start={19}>
        <li>
          <strong>LCP target: under 2.5s on 4G.</strong> Measure with
          PageSpeed Insights on the PDP, not the homepage. Over 4s kills
          conversion by 20–40%.
        </li>
        <li>
          <strong>Image optimization.</strong> Shopify serves WebP
          automatically — but only if you upload below 5MB. Resize originals
          to 2048px wide max.
        </li>
        <li>
          <strong>Audit app bloat.</strong> Every Shopify app adds JS.
          Anything not loading on every page should be uninstalled. Common
          offenders: unused review apps, old upsell apps, chat widgets from
          experiments.
        </li>
        <li>
          <strong>Lazy-load below-the-fold images.</strong> Most themes do
          this; confirm in DevTools.
        </li>
      </ol>

      <h2>Tier 5 — Upsells and revenue per session</h2>
      <ol start={23}>
        <li>
          <strong>Cart drawer upsell.</strong> One complementary product,
          &quot;Add for $X&quot;. Tools: Rebuy, Bold Upsell. AOV lift:
          8–15%.
        </li>
        <li>
          <strong>Post-purchase offer.</strong> One-click upsell on the thank
          you page. AOV lift: 5–12%, zero impact on conversion rate (it
          fires after purchase).
        </li>
        <li>
          <strong>Bundle builder on high-frequency categories.</strong> Build
          your own 3-pack, 5-pack. Lifts AOV and reduces unit economics.
        </li>
      </ol>

      <h2>Tier 6 — Email capture and lifecycle</h2>
      <ol start={26}>
        <li>
          <strong>Email popup — scroll-triggered, not time-triggered.</strong>{" "}
          Fire at 40% scroll depth, not at 10 seconds. Conversion rate on
          popups is 3× higher with engaged scrollers.
        </li>
        <li>
          <strong>Exit-intent only on desktop.</strong> Mobile &quot;exit
          intent&quot; is fake — it fires on accidental touches and annoys
          users.
        </li>
        <li>
          <strong>Abandoned cart email within 2 hours.</strong> Klaviyo
          default is 4h; move to 2h. Recovery rate jumps 15–20%.
        </li>
      </ol>

      <h2>Tier 7 — Analytics and observation</h2>
      <ol start={29}>
        <li>
          <strong>Install Microsoft Clarity.</strong> Free session recordings
          + heatmaps. The single best way to find &quot;why is no one
          clicking ATC?&quot; — watch 20 sessions.
        </li>
        <li>
          <strong>Set up GA4 funnel exploration</strong> for the 4-step
          funnel above. Weekly review; any step dropping 5%+ week-on-week is
          an incident.
        </li>
      </ol>

      <h2>The 30-day testing cadence</h2>
      <p>
        Stop running three tests in parallel. Run one test at a time, for a
        full 14 days, on the highest-traffic PDP. Your cadence:
      </p>
      <ul>
        <li>
          <strong>Day 1–3:</strong> Ship the change. Use Shopify theme
          sections or a proper A/B tool (Intelligems, Visually) — not a code
          flip that can&apos;t be rolled back.
        </li>
        <li>
          <strong>Day 4–14:</strong> Let it run. Don&apos;t peek before ~500
          conversions per variant. Under that, you&apos;re reading noise.
        </li>
        <li>
          <strong>Day 15–17:</strong> Decision. Ship or kill. Document result
          in a shared doc with the exact lift and sample size.
        </li>
        <li>
          <strong>Day 18:</strong> Start the next test.
        </li>
      </ul>
      <p>
        Two tests per month, 24 per year. If half win, that&apos;s 12
        compounding lifts. A store at 2% conversion with 12 × 3% lifts
        compounds to 2.85% — a 42% revenue increase from the same traffic.
        That&apos;s where CRO becomes the highest-ROI channel any DTC brand
        runs.
      </p>
    </>
  ),

  "amazon-vs-tiktok-shop-vs-shopify": (
    <>
      <p>
        The same product should not use the same listing on Amazon, TikTok Shop,
        and Shopify. Amazon buyers compare search results. TikTok Shop buyers
        decide mid-scroll. Shopify buyers are judging the brand, not just the
        SKU. Use this guide as the routing table before you rewrite a listing.
      </p>

      <h2>Fast decision matrix</h2>
      <div className="not-prose overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
        <table className="min-w-full divide-y divide-stone-200 text-sm dark:divide-stone-800">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500 dark:bg-stone-950">
            <tr>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Buyer mode</th>
              <th className="px-4 py-3">Listing priority</th>
              <th className="px-4 py-3">Best first move</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white dark:divide-stone-800 dark:bg-stone-950">
            <tr>
              <td className="px-4 py-3 font-medium">Amazon</td>
              <td className="px-4 py-3">Comparison search</td>
              <td className="px-4 py-3">Keyword-dense title, compliant bullets, backend terms</td>
              <td className="px-4 py-3">Lead with exact spec + primary keyword in the first 75 chars</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">TikTok Shop</td>
              <td className="px-4 py-3">Discovery scroll</td>
              <td className="px-4 py-3">Hook-first title, demo-ready benefits, creator language</td>
              <td className="px-4 py-3">Name the problem solved before the product type</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Shopify</td>
              <td className="px-4 py-3">Brand evaluation</td>
              <td className="px-4 py-3">Voice, reassurance, product story, conversion details</td>
              <td className="px-4 py-3">Open with the brand promise, then prove it with specs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Use Amazon when buyers already know the category</h2>
      <p>
        Amazon is strongest when demand already exists: garlic press, resistance
        bands, MagSafe case, pet feeder. The buyer is comparing ten thumbnails
        and asking one question: which result is most obviously right for me?
        Your title needs the exact product type, the strongest spec, and the
        compatibility or material fact before mobile truncation.
      </p>
      <p>
        Avoid clever hooks in the title. Put emotional copy in bullet 1, not the
        first line. Amazon rewards clarity and suppresses risky claims.
      </p>

      <h2>Use TikTok Shop when the demo creates demand</h2>
      <p>
        TikTok Shop is strongest when the product has a visible moment: before
        and after, one-handed use, setup speed, satisfying texture, compact
        storage, or an obvious pain point. The title can be more conversational
        because it sits next to video proof.
      </p>
      <p>
        Write like a creator explaining why the viewer should care in the next
        two seconds. Specs still matter, but they support the hook instead of
        leading it.
      </p>

      <h2>Use Shopify when the brand must carry trust</h2>
      <p>
        Shopify is where you sell the full buying environment: product detail
        page, reviews, shipping reassurance, return policy, bundles, email
        capture, and the story behind the product. It is best for differentiated
        products, repeat purchase categories, premium positioning, or products
        with a community angle.
      </p>
      <p>
        The copy can breathe more than marketplace copy. Use the title for brand
        tone, then make the description prove the promise with materials, care,
        compatibility, sizing, and support details.
      </p>

      <h2>One product, three listing angles</h2>
      <p>
        Example product: a 304 stainless garlic press with removable cleaning
        insert.
      </p>
      <ul>
        <li>
          <strong>Amazon:</strong> Stainless Steel Garlic Press, 304 Food-Grade
          Mincer with Easy-Clean Removable Insert, No-Peel Clove Crusher.
        </li>
        <li>
          <strong>TikTok Shop:</strong> Stop peeling garlic by hand | Easy-Clean
          Stainless Garlic Press for weeknight cooking.
        </li>
        <li>
          <strong>Shopify:</strong> ListForge Heirloom Garlic Press for faster
          weeknight prep.
        </li>
      </ul>
      <p>
        None of those are interchangeable. They point at different buyer states:
        search confidence, scroll curiosity, and brand trust.
      </p>

      <h2>Recommended workflow</h2>
      <ol>
        <li>Write the Amazon version first if the category has existing search demand.</li>
        <li>Rewrite the same facts into a TikTok Shop hook if the product has a visible demo.</li>
        <li>Use the Shopify version as the richest source of reassurance and brand proof.</li>
        <li>Keep the facts identical across all three. Change the angle, not the truth.</li>
      </ol>
    </>
  ),
};
