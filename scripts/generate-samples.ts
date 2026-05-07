/**
 * One-shot generator: produce a real, AI-generated sample listing for each
 * (platform × category) combo (3 × 12 = 36) and persist to
 * `data/sample-listings.json`. The pSEO pages render this so each page has
 * ~400 words of unique, indexable content instead of a near-identical
 * template skeleton.
 *
 * Run: `npx tsx scripts/generate-samples.ts`
 *
 * Behavior:
 *   - Loads DEEPSEEK_API_KEY from .env.local (Node 22+ built-in).
 *   - Skips combos already present unless --force.
 *   - Writes incrementally so a mid-run crash doesn't lose progress.
 *   - Cost: ~36 calls, expected total <$0.40.
 */

// Load env BEFORE importing any module that reads process.env.
// Node 22+ ships this. The user is on Node 25.
// IMPORTANT: ESM hoists static `import` statements to the top, which would
// run BEFORE this line — so we keep all env-dependent imports as dynamic
// imports inside main() below.
process.loadEnvFile(".env.local");

import { writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { generateObject } from "ai";
import { z } from "zod";
import type { Platform } from "../lib/listing-prompts.js";

const OUT_PATH = "data/sample-listings.json";
const FORCE = process.argv.includes("--force");

// Mirror of the production OutputSchema in app/api/optimize/route.ts.
// Kept in sync manually — if that schema changes, update here too.
const OutputSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()).length(5),
  description: z.string(),
  backendKeywords: z.string(),
  seoKeywords: z.array(z.string()).min(8).max(12),
});

type SampleListing = z.infer<typeof OutputSchema>;

interface RepProduct {
  productName: string;
  brand: string;
  features: string;
  keywords: string;
}

/**
 * One representative product per category. Chosen to exercise the
 * category-specific prompt rules (e.g. material grade for kitchen-gadgets,
 * resistance level for home-fitness, hypoallergenic for jewelry).
 *
 * Features are written as terse seller-style notes — same shape real users
 * paste in.
 */
const REP_PRODUCTS: Record<string, RepProduct> = {
  "kitchen-gadgets": {
    productName: "Stainless Steel Garlic Press",
    brand: "ListForge",
    features:
      "304 food-grade stainless steel; soft non-slip grip handle; built-in cleaning brush included; dishwasher safe; presses cloves with skin on; reinforced hinge tested 30,000 cycles; rust-resistant",
    keywords: "garlic press, garlic mincer, easy clean, stainless steel",
  },
  "home-fitness": {
    productName: "5-Piece Resistance Band Set 5-150 lb",
    brand: "ListForge",
    features:
      "5 stackable bands: 10/20/30/40/50 lb each, stacks to 150 lb; natural latex (allergy-tested, no TPE); soft-grip foam handles; door anchor + ankle straps + carry bag; printed exercise guide; 30-day fit guarantee",
    keywords: "resistance bands, home gym, exercise bands, 150 lb",
  },
  "pet-supplies": {
    productName: "Heavy-Duty Squeaky Dog Toy for Tough Chewers",
    brand: "ListForge",
    features:
      "non-toxic natural rubber; medium-large breed sizing 25-90 lb; replaceable squeaker module; textured surface for teeth cleaning; floats; 90-day chew warranty; veterinarian-recommended",
    keywords: "tough dog toy, aggressive chewer, large breed, squeaky",
  },
  "skincare-beauty": {
    productName: "20% Vitamin C Serum with Hyaluronic Acid",
    brand: "ListForge",
    features:
      "20% L-ascorbic acid + 1% vitamin E + ferulic acid stabilizer; pH 3.0-3.5; amber glass airless pump 30 ml; vegan, fragrance-free, paraben-free; cruelty-free; cold-formulated for stability",
    keywords: "vitamin c serum, brightening, anti-aging, hyaluronic acid",
  },
  "baby-products": {
    productName: "Anti-Colic Baby Bottle Set 4-Pack 8 oz",
    brand: "ListForge",
    features:
      "internal venting tube reduces colic, gas, reflux; BPA/BPS/phthalate-free polypropylene; slow-flow silicone nipples (level 1, 0-3 mo); dishwasher + sterilizer safe; wide neck for easy clean; matches major breast pumps",
    keywords: "anti-colic bottle, baby bottle, slow flow, BPA free",
  },
  "outdoor-camping": {
    productName: "4-Season 2-Person Backpacking Tent",
    brand: "ListForge",
    features:
      "4.5 lb total trail weight; 20D ripstop nylon, 3000mm waterproof rating; 2 vestibules + 2 doors; aluminum DAC poles; freestanding; color-coded clip system; 4-season rated; vented for condensation",
    keywords: "backpacking tent, 2 person, ultralight, 4 season",
  },
  "office-stationery": {
    productName: "Gel Pens 0.5mm Needle Tip 24-Pack",
    brand: "ListForge",
    features:
      "0.5 mm needle tip for fine lines; smudge-free quick-dry ink; 12 classic + 12 pastel colors; comfortable rubber grip; tungsten carbide ball; refillable; left-handed friendly; archival-quality ink",
    keywords: "gel pens, fine point, smudge free, journaling",
  },
  "fashion-accessories": {
    productName: "Full-Grain Leather Belt 1.25 inch",
    brand: "ListForge",
    features:
      "100% full-grain Italian leather (not bonded); 1.25 inch width fits standard jean loops; brushed nickel buckle; hand-burnished edges; sized 30-44 (cut to fit included); develops patina over time; gift-boxed",
    keywords: "leather belt, full grain, mens, classic",
  },
  "phone-accessories": {
    productName: "iPhone 16 Pro Max Case with MagSafe",
    brand: "ListForge",
    features:
      "MagSafe-certified magnet ring (not just compatible); MIL-STD-810G drop tested 12 ft; precise camera cutouts for 16 Pro Max only; raised lip for screen + camera protection; matte anti-fingerprint TPU+PC; supports wireless charging",
    keywords: "iPhone 16 Pro Max case, MagSafe, drop protection, matte",
  },
  "smart-home": {
    productName: "Matter Smart Plug 4-Pack with Energy Monitoring",
    brand: "ListForge",
    features:
      "Matter over Wi-Fi 2.4GHz (works with Alexa, Google Home, Apple HomeKit, SmartThings, no hub needed); real-time kWh energy monitoring (±2% accuracy); 15A 1875W max; ETL safety certified; indoor only; compact design fits side-by-side outlets",
    keywords: "matter smart plug, energy monitoring, alexa, homekit",
  },
  jewelry: {
    productName: "Sterling Silver 925 CZ Stud Earrings",
    brand: "ListForge",
    features:
      "solid sterling silver 925 (stamped); 3 mm AAA-grade cubic zirconia; hypoallergenic for sensitive ears (nickel-free per ASTM F2999); secure push-back closure; rhodium-plated for tarnish resistance; arrives in gift box",
    keywords: "sterling silver studs, hypoallergenic, cubic zirconia, gift",
  },
  "home-decor": {
    productName: "Boucle Throw Pillow Covers 18x18 Set of 2",
    brand: "ListForge",
    features:
      "set of 2 cover-only (no insert included); textured boucle fabric in cream; hidden zipper closure; 18x18 inch (fits standard square inserts); machine washable cold; spot-clean recommended; wrinkle-resistant",
    keywords: "boucle pillow covers, neutral, cream, throw pillow",
  },
};

const PLATFORMS: Platform[] = ["amazon", "tiktok-shop", "shopify"];

async function main() {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error(
      "DEEPSEEK_API_KEY missing. Add it to .env.local before running."
    );
    process.exit(1);
  }

  // Dynamic imports — see top-of-file comment about ESM hoisting.
  const { deepseek, DEEPSEEK_MODEL } = await import("../lib/deepseek.js");
  const { buildSystemPrompt, buildUserPrompt } = await import(
    "../lib/listing-prompts.js"
  );
  const { CATEGORIES } = await import("../lib/categories.js");

  let results: Record<string, SampleListing> = {};
  if (!FORCE && existsSync(OUT_PATH)) {
    try {
      results = JSON.parse(await readFile(OUT_PATH, "utf8"));
      console.log(
        `Loaded ${Object.keys(results).length} cached listings from ${OUT_PATH}`
      );
    } catch (e) {
      console.warn(`Could not parse existing ${OUT_PATH}, starting fresh`, e);
    }
  }

  const total = PLATFORMS.length * CATEGORIES.length;
  let i = 0;
  let skipped = 0;
  let failed = 0;
  let generated = 0;

  for (const platform of PLATFORMS) {
    for (const cat of CATEGORIES) {
      i++;
      const key = `${platform}-${cat.slug}`;

      if (!FORCE && results[key]) {
        skipped++;
        console.log(`[${i}/${total}] ${key}  ✓ cached`);
        continue;
      }

      const prod = REP_PRODUCTS[cat.slug];
      if (!prod) {
        failed++;
        console.warn(`[${i}/${total}] ${key}  ✗ no rep product`);
        continue;
      }

      try {
        const t0 = Date.now();
        const { object } = await generateObject({
          model: deepseek(DEEPSEEK_MODEL),
          schema: OutputSchema,
          system: buildSystemPrompt(platform, "balanced"),
          prompt: buildUserPrompt({
            platform,
            productName: prod.productName,
            category: cat.label,
            features: prod.features,
            brand: prod.brand,
            keywords: prod.keywords,
          }),
          temperature: 0.85,
        });
        results[key] = object;

        // Write incrementally — survives a crash mid-batch.
        await writeFile(OUT_PATH, JSON.stringify(results, null, 2));

        generated++;
        const dt = ((Date.now() - t0) / 1000).toFixed(1);
        const titlePreview = object.title.slice(0, 70);
        console.log(`[${i}/${total}] ${key}  ✓ ${dt}s — ${titlePreview}…`);
      } catch (err) {
        failed++;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[${i}/${total}] ${key}  ✗ ${msg}`);
      }
    }
  }

  console.log(
    `\nDone. ${generated} generated, ${skipped} cached, ${failed} failed.`
  );
  console.log(`Output: ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
