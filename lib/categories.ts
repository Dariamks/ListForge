/**
 * Master taxonomy used for Programmatic SEO landing pages.
 * Each category becomes /guides/<platform>-<slug>-listing-optimizer
 * Example: /guides/amazon-kitchen-gadgets-listing-optimizer
 *
 * A category may also declare a list of sub-niches. Each sub-niche adds
 * /guides/<platform>-<category>-<subNiche>-listing-optimizer
 * Example: /guides/amazon-kitchen-gadgets-garlic-tools-listing-optimizer
 */

export interface SubNiche {
  slug: string;
  label: string;
  /** Short, search-intent-friendly hook for hero copy (sub-niche-specific) */
  hook: string;
  /** 3 buyer pain points unique to this sub-niche */
  pains: string[];
}

export interface Category {
  slug: string;
  label: string;
  /** Short, search-intent-friendly hook for hero copy */
  hook: string;
  /** 3-5 buyer pain points this category struggles with */
  pains: string[];
  /** Optional sub-niches for long-tail pSEO coverage */
  subNiches?: SubNiche[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "kitchen-gadgets",
    label: "Kitchen Gadgets",
    hook: "Sell more spatulas, peelers, and gadgets buyers actually search for.",
    pains: [
      "Generic titles that get buried under brand listings",
      "Bullets that sound like spec sheets instead of solving meal-prep pain",
      "Backend keywords stuffed with duplicate words",
    ],
    subNiches: [
      {
        slug: "garlic-tools",
        label: "Garlic Tools",
        hook: "Garlic presses and mincers live or die on 'easy to clean' — make sure your listing says so first.",
        pains: [
          "Buyers skim-search for 'easy clean' and 'no peel' — titles miss those exact phrases",
          "Material truth (304 vs 201 stainless, zinc alloy) is usually buried in bullets",
          "Gift-set variants need distinct copy, not the single-unit title recycled",
        ],
      },
      {
        slug: "peelers-graters",
        label: "Peelers & Graters",
        hook: "Y-peelers, julienne tools, and microplane graters each attract different queries — stop collapsing them.",
        pains: [
          "Blade-type keywords (Y-peeler, julienne, serrated) often missing from title",
          "Safety copy (finger guards, non-slip base) gets lost in feature lists",
          "Multi-pack listings need different hooks than single-piece hero units",
        ],
      },
      {
        slug: "can-openers",
        label: "Can Openers",
        hook: "Arthritis-friendly, smooth-edge, and electric openers target three different buyer intents.",
        pains: [
          "Smooth-edge / side-cut openers need explicit 'no sharp edges' copy — buyers search for it",
          "Elderly and arthritis-friendly keywords often missing despite being the real intent",
          "Electric models compete on battery life and noise — specs usually in images, not text",
        ],
      },
      {
        slug: "silicone-tools",
        label: "Silicone Kitchen Tools",
        hook: "Heat rating and FDA-grade claims are non-negotiable — bury them and lose the sale.",
        pains: [
          "'Heat resistant to 500°F' must be in title or first bullet, not paragraph 3",
          "Food-grade / BPA-free / LFGB claims get repeated verbatim, eroding trust",
          "Color-variant listings split reviews; copy rarely mentions full palette upfront",
        ],
      },
    ],
  },
  {
    slug: "home-fitness",
    label: "Home Fitness",
    hook: "Stand out in a category where every listing claims to be 'professional grade'.",
    pains: [
      "Hard to differentiate from 50 nearly identical resistance bands",
      "Compliance-sensitive claims (weight loss, injury) need careful phrasing",
      "Mobile-first buyers skim — bullets must hook in 5 seconds",
    ],
    subNiches: [
      {
        slug: "resistance-bands",
        label: "Resistance Bands",
        hook: "Resistance-level specificity (5-150 lb) and loop-vs-tube distinction drive 80% of conversions here.",
        pains: [
          "Exact pound ratings per band color often missing from title and A+ content",
          "Buyers can't tell if product is loop, tube with handles, or booty band without photos",
          "Natural-latex vs TPE distinction matters for allergies — usually hidden",
        ],
      },
      {
        slug: "yoga-mats",
        label: "Yoga Mats",
        hook: "Thickness (6mm vs 8mm vs 10mm) and material (TPE, PU, cork) are the two keywords that matter.",
        pains: [
          "Thickness in title wins searches — 'extra thick 1/2 inch' outperforms 'premium yoga mat'",
          "Non-slip claims need texture/grip specifics, not marketing adjectives",
          "Eco-credential claims (biodegradable, SGS-certified) get buried under brand fluff",
        ],
      },
      {
        slug: "jump-ropes",
        label: "Jump Ropes",
        hook: "Weighted, speed, beaded, or cordless — each attracts a different athlete archetype.",
        pains: [
          "Rope-type (speed vs weighted vs beaded) not in first 80 chars of title",
          "Ball-bearing vs fixed-handle mechanism matters to boxing buyers — usually unmentioned",
          "Adjustability ('fits up to 6'6')' is a conversion driver left out of bullets",
        ],
      },
      {
        slug: "foam-rollers",
        label: "Foam Rollers",
        hook: "Density (soft, medium, firm) and texture (smooth, grid, trigger-point) define the buyer.",
        pains: [
          "Firmness level must be explicit — 'medium density EPP' beats 'premium quality'",
          "Length variants (12' vs 18' vs 36') serve different uses, rarely explained",
          "Vibrating / electric rollers need battery life & noise levels upfront",
        ],
      },
    ],
  },
  {
    slug: "pet-supplies",
    label: "Pet Supplies",
    hook: "Win pet parents with copy that speaks to love, safety, and convenience.",
    pains: [
      "Buyers care about safety claims more than features",
      "Size charts and compatibility (breed/weight) often missing from copy",
      "Emotional language wins, but Amazon penalizes hype words",
    ],
    subNiches: [
      {
        slug: "dog-toys",
        label: "Dog Toys",
        hook: "Chewer-level (light/moderate/aggressive) and dog-size filter must lead the title, not follow it.",
        pains: [
          "'Indestructible' claims get flagged — need calibrated language ('for tough chewers')",
          "Size-to-breed mapping (S/M/L → lb ranges) usually missing",
          "Squeaker vs non-squeaker preference split isn't surfaced in listings",
        ],
      },
      {
        slug: "cat-trees",
        label: "Cat Trees",
        hook: "Height, footprint, and weight capacity are all must-have facts — before aesthetics.",
        pains: [
          "Assembly difficulty and 'tools included' info are conversion blockers when missing",
          "Small-apartment variants need dedicated 'space-saving' copy, not main-SKU spillover",
          "Weight limit per perch matters for large-breed cats — usually under-specified",
        ],
      },
      {
        slug: "pet-grooming",
        label: "Pet Grooming",
        hook: "Deshedding tools, clippers, and brushes each solve different coat types — stop using one listing for all.",
        pains: [
          "Coat-type keywords (double coat, curly, short hair) missing from title",
          "Blade-replacement / maintenance info absent — drives negative reviews",
          "Noise level (for fearful pets) rarely called out even when it's a selling point",
        ],
      },
      {
        slug: "pet-feeders",
        label: "Pet Feeders",
        hook: "Auto-feeders, slow-feed bowls, and gravity waterers have zero overlap — treat them separately.",
        pains: [
          "Programmable portion size (1-50g) and schedule flexibility often left in images only",
          "Power source (battery, plug-in, both) is a deal-breaker buyers search for",
          "Dishwasher-safe and material-safety claims buried in bullet 4 instead of bullet 1",
        ],
      },
    ],
  },
  {
    slug: "skincare-beauty",
    label: "Skincare & Beauty",
    hook: "Compliant, conversion-friendly copy for a category Amazon scrutinizes.",
    pains: [
      "Ingredient call-outs vs. compliance restrictions",
      "Buyer skepticism — needs proof-style language without fake reviews",
      "Differentiation from K-beauty / drugstore alternatives",
    ],
    subNiches: [
      {
        slug: "vitamin-c-serums",
        label: "Vitamin C Serums",
        hook: "L-ascorbic acid %, pH, and stabilizer blend determine whether the serum works — or turns orange.",
        pains: [
          "Exact vitamin C form (L-ascorbic, THD, SAP) rarely surfaced in title",
          "pH range and concentration % claims are ignored unless you explain why they matter",
          "Dark-bottle / air-pump packaging is a trust signal that goes unmentioned",
        ],
      },
      {
        slug: "retinol-products",
        label: "Retinol Products",
        hook: "Beginner, intermediate, and advanced retinol strengths need three different listings, not one.",
        pains: [
          "Retinol % (0.25, 0.5, 1.0) must be in title for the buyer-intent match",
          "Encapsulated vs standard retinol distinction matters to sensitive-skin buyers",
          "Retinal (retinaldehyde) vs retinol confusion costs sales — explain the difference",
        ],
      },
      {
        slug: "sunscreens",
        label: "Sunscreens",
        hook: "Mineral vs chemical and finish (matte, dewy, tinted) divide buyers more than SPF number does.",
        pains: [
          "Mineral (zinc/titanium) vs chemical (avobenzone etc) needs to be in title",
          "Reef-safe, fragrance-free, non-comedogenic claims repeated instead of substantiated",
          "White-cast complaints dominate reviews — address pigmentation in bullets",
        ],
      },
      {
        slug: "face-masks",
        label: "Face Masks",
        hook: "Sheet, clay, sleeping, and exfoliating masks serve opposite concerns — don't mash them into one listing.",
        pains: [
          "Mask type must be in title — 'sheet mask' vs 'clay mask' can't be deduced from image alone",
          "Hero ingredient (hyaluronic, kaolin, AHA) must replace generic 'hydrating' adjectives",
          "Skin-type targeting (oily, dry, sensitive) often missing, leading to wrong-fit returns",
        ],
      },
    ],
  },
  {
    slug: "baby-products",
    label: "Baby & Toddler",
    hook: "Earn parent trust with copy that prioritizes safety and reassurance.",
    pains: [
      "ASTM/CPSC-relevant claims must be precise, not flowery",
      "Parents skim while holding a toddler — clarity beats cleverness",
      "Gift-buyer keywords are often missed",
    ],
    subNiches: [
      {
        slug: "baby-bottles",
        label: "Baby Bottles",
        hook: "Anti-colic venting, material (glass/PP/silicone), and nipple flow — the three facts every parent searches for.",
        pains: [
          "Flow rate (slow, medium, fast) and age range rarely paired in title",
          "BPA/BPS/phthalate-free claims need to specify scope — which parts",
          "Dishwasher + sterilizer compatibility is a returning-buyer question, often unanswered",
        ],
      },
      {
        slug: "baby-monitors",
        label: "Baby Monitors",
        hook: "WiFi vs local-only is a privacy-conscious buyer's first filter — surface it immediately.",
        pains: [
          "WiFi-free / non-app models attract privacy buyers — keyword is rarely used in title",
          "Battery life of the parent unit is searched for, usually only in spec images",
          "Range (ft) in open vs through-walls needs realistic numbers, not marketing peaks",
        ],
      },
      {
        slug: "teethers",
        label: "Teethers",
        hook: "Freezable, textured, and wooden teethers target different teething phases — don't bundle them.",
        pains: [
          "Freezer-safe vs fridge-only vs not-coolable is a distinction parents search for",
          "100% silicone vs silicone-plastic-blend matters for safety-conscious buyers",
          "Age range (0-3m vs 3-6m vs 6m+) must be in title, not bullet 5",
        ],
      },
      {
        slug: "swaddles",
        label: "Swaddles & Sleep Sacks",
        hook: "TOG rating, arms-up vs arms-down, and weight range define the SKU — none should be hidden.",
        pains: [
          "TOG rating (0.5, 1.0, 2.5) is industry-standard — buyers search by it",
          "Transition-phase products (arms up/down) need their own listing, not a variant note",
          "Organic-cotton / GOTS-certified claims often unverified — buyers check photos for labels",
        ],
      },
    ],
  },
  {
    slug: "outdoor-camping",
    label: "Outdoor & Camping",
    hook: "Capture campers, hikers, and overlanders with field-credible copy.",
    pains: [
      "Tech specs (weight, denier, fill power) need to be scannable",
      "Use-case keywords (backpacking vs. car camping) often conflated",
      "Seasonal demand spikes punish weak SEO",
    ],
    subNiches: [
      {
        slug: "camping-stoves",
        label: "Camping Stoves",
        hook: "Fuel type (canister, propane, wood, multi-fuel) is the first thing every buyer filters on.",
        pains: [
          "Fuel compatibility (isobutane, white gas) needs to be in title",
          "BTU output comparison is a real buyer intent — put the number in bullet 1",
          "Weight and pack size drive ultralight-backpacker buyers — bury them and lose the sale",
        ],
      },
      {
        slug: "sleeping-bags",
        label: "Sleeping Bags",
        hook: "Temperature rating (comfort vs lower-limit) and fill (down, synthetic) are non-negotiable title content.",
        pains: [
          "Lower-limit vs comfort rating confusion sells wrong bag to wrong buyer",
          "Fill power (down) or fill weight (synthetic) must be quantified",
          "Zipper direction / left-right matching for couples rarely called out",
        ],
      },
      {
        slug: "hiking-backpacks",
        label: "Hiking Backpacks",
        hook: "Liter capacity and torso-length fit are the two buyer filters — put them in the title.",
        pains: [
          "Capacity (L) in title outperforms 'large backpack' by wide margins",
          "Frame type (internal, frameless, external) differentiates use-case — often unclear",
          "Hydration-bladder compatibility needs an explicit yes/no/bladder-included statement",
        ],
      },
      {
        slug: "camping-lanterns",
        label: "Camping Lanterns",
        hook: "Lumens, runtime, and recharge method separate impulse-buyers from serious campers.",
        pains: [
          "Lumen rating at low/medium/high — buyers want all three, usually see only peak",
          "USB-C, solar, and hand-crank charging options rarely all surfaced",
          "IPX water resistance rating matters for rain campers — often buried in specs",
        ],
      },
    ],
  },
  {
    slug: "office-stationery",
    label: "Office & Stationery",
    hook: "Turn commodity desk supplies into 'must-add' bundle items.",
    pains: [
      "Office buyers search by very specific specs (e.g. '0.5mm needle tip')",
      "Subscription/refill messaging often missing from copy",
      "Bulk/multipack listings need different hooks than single-unit",
    ],
    subNiches: [
      {
        slug: "gel-pens",
        label: "Gel Pens",
        hook: "Tip size (0.38, 0.5, 0.7mm), ink color count, and smudge-proof claims — all must be in the title.",
        pains: [
          "Needle-tip vs bullet-tip distinction matters to left-handers and artists",
          "Ink-refill availability is a re-purchase driver, rarely mentioned upfront",
          "Pack-size math (24-count vs 48-count) affects per-pen pricing — surface it",
        ],
      },
      {
        slug: "sticky-notes",
        label: "Sticky Notes",
        hook: "Size (3x3, 3x5), paper type (lined, blank, grid), and adhesive strength are the real search terms.",
        pains: [
          "Size in inches + mm reaches international buyers — usually only one is present",
          "Restickable / super-sticky distinction rarely surfaced",
          "Pastel vs neon vs classic color set preference is a keyword worth targeting",
        ],
      },
      {
        slug: "desk-organizers",
        label: "Desk Organizers",
        hook: "Material (acrylic, bamboo, mesh) and compartment count determine the buyer archetype.",
        pains: [
          "Exact footprint (W × D × H in inches) is a desk-fit filter — must be prominent",
          "Modular / stackable claims need photos + copy, not just one or the other",
          "Cable-pass-through features differentiate premium units — often unlabeled",
        ],
      },
      {
        slug: "planner-notebooks",
        label: "Planner Notebooks",
        hook: "Dotted-bullet, weekly, undated, dated — four different buyers, four different listings.",
        pains: [
          "Paper GSM (80 vs 100 vs 120) affects fountain-pen bleed — buyers search for it",
          "Dated vs undated must be in title — wrong fit = instant return",
          "Page count and ribbon/pocket features rarely quantified",
        ],
      },
    ],
  },
  {
    slug: "fashion-accessories",
    label: "Fashion Accessories",
    hook: "Match buyer mood, occasion, and outfit — not just product specs.",
    pains: [
      "Search demand is mood-driven (Y2K, coastal grandma, quiet luxury)",
      "Sizing & material truth-in-listing matters for returns",
      "Competing with influencer-marketed dupes",
    ],
    subNiches: [
      {
        slug: "leather-belts",
        label: "Leather Belts",
        hook: "Genuine, top-grain, full-grain, or bonded — buyers know the difference, make sure your title does too.",
        pains: [
          "Leather grade specificity (full-grain vs top-grain) is a trust signal often fudged",
          "Belt width (1.25' vs 1.5') matters for jean-loop fit — rarely in title",
          "Reversible / single-sided distinction needs an immediate callout",
        ],
      },
      {
        slug: "silk-scarves",
        label: "Silk Scarves",
        hook: "Momme weight, silk grade (6A, mulberry), and dimensions determine premium vs polyester-blend.",
        pains: [
          "100% mulberry silk vs silk blend must be explicit — blend shoppers feel deceived otherwise",
          "Momme weight (16mm vs 22mm) is a quality signal unfamiliar to casual buyers — educate in bullets",
          "Hand-rolled edge vs machine-hemmed is a luxury cue worth calling out",
        ],
      },
      {
        slug: "sunglasses",
        label: "Sunglasses",
        hook: "Polarized, UV400, face-shape targeting — three angles, three different buyer queries.",
        pains: [
          "Polarization claim needs UV400 + category-3 lens backup, not standalone",
          "Face-shape fit guidance (oval, round, square) converts undecided buyers",
          "Lens material (polycarbonate vs CR-39) affects durability — rarely in copy",
        ],
      },
      {
        slug: "hair-accessories",
        label: "Hair Accessories",
        hook: "Claw clips, silk scrunchies, and acrylic barrettes are three separate trend cycles — don't bundle.",
        pains: [
          "Hair-thickness guidance (fine, medium, thick) prevents mis-fit returns",
          "Material-truth claims (real silk scrunchie vs satin-blend) matter to educated buyers",
          "Style-era keywords (Y2K, 90s, clean-girl) are search drivers, often absent",
        ],
      },
    ],
  },
  {
    slug: "phone-accessories",
    label: "Phone Accessories",
    hook: "Win the model-specific keyword war (iPhone 16 Pro Max, Galaxy S25 Ultra...).",
    pains: [
      "Compatibility lists must be exhaustive AND scannable",
      "Generic 'magnetic case' loses to model-targeted titles",
      "Buyers compare 6 listings on one screen — the first 80 chars decide",
    ],
    subNiches: [
      {
        slug: "phone-cases",
        label: "Phone Cases",
        hook: "Exact model number + MagSafe compatibility must be in first 60 characters — everything else is noise.",
        pains: [
          "Model variant (Plus, Pro, Pro Max) must match exactly — 'fits iPhone 16 series' is a lie and buyers know it",
          "Drop-test rating (MIL-STD-810G) backed up or not — builds trust",
          "MagSafe-compatible vs MagSafe-certified is a distinction the savvy buyer cares about",
        ],
      },
      {
        slug: "screen-protectors",
        label: "Screen Protectors",
        hook: "Tempered-glass hardness (9H), fit type (case-friendly, edge-to-edge), and count per pack — all title content.",
        pains: [
          "'Full coverage' vs 'case-friendly' is a common return cause — disambiguate",
          "Privacy vs standard vs matte vs blue-light: four different buyers, usually one listing",
          "Installation kit contents (alignment frame, dust stickers) rarely itemized",
        ],
      },
      {
        slug: "wireless-chargers",
        label: "Wireless Chargers",
        hook: "Watts (7.5W, 15W, MagSafe 15W) and device count are the two specs that drive the sale.",
        pains: [
          "MagSafe 15W vs Qi 15W is a meaningful speed difference — buyers ask, listings dodge",
          "PPS / PD power-delivery support matters for Samsung fast-charging — often omitted",
          "Multi-device pads need per-pad wattage breakdown, not just top-line total",
        ],
      },
      {
        slug: "phone-mounts",
        label: "Phone Mounts",
        hook: "Car, bike, desk, or gooseneck — each serves a mutually exclusive buyer journey.",
        pains: [
          "Mount interface (MagSafe, adhesive, air-vent, suction) must be in title",
          "Max phone size (width in mm) with or without case is a fit killer",
          "Vibration / road-bump stability is the #1 negative review — address it in bullets",
        ],
      },
    ],
  },
  {
    slug: "smart-home",
    label: "Smart Home",
    hook: "Speak fluent Alexa / Google Home / Matter without confusing buyers.",
    pains: [
      "Compatibility (hub required? Wi-Fi 2.4GHz only?) often hidden",
      "Setup-anxiety buyers need reassurance up front",
      "App ratings & data-privacy questions loom over conversions",
    ],
    subNiches: [
      {
        slug: "smart-plugs",
        label: "Smart Plugs",
        hook: "Matter, Wi-Fi 2.4GHz only, energy-monitoring — three keywords that route traffic to three different SKUs.",
        pains: [
          "Matter / Thread support is a title-worthy fact — pre-smart-home buyers search for it",
          "Indoor-only vs weatherproof distinction must be unmistakable, not footnoted",
          "Energy-monitoring accuracy (kWh precision) is a buying signal for savers — usually vague",
        ],
      },
      {
        slug: "smart-bulbs",
        label: "Smart Bulbs",
        hook: "Color-changing, white-tunable, Zigbee, Matter — the combinatorial explosion that kills generic listings.",
        pains: [
          "Lumens + color-temperature range must be specified — 'bright' is not a spec",
          "Hub-required vs hub-free is a dealbreaker question, often buried",
          "Voice-assistant compatibility (Alexa, Google, HomeKit, SmartThings) needs explicit yes/no per brand",
        ],
      },
      {
        slug: "motion-sensors",
        label: "Motion Sensors",
        hook: "PIR vs mmWave, battery life, and outdoor rating — the three facts every hobbyist checks first.",
        pains: [
          "PIR vs mmWave vs dual-tech is a skill-buyer distinction — surface it, don't dodge",
          "Battery life (months, not days) affects buying decision — often unspecified",
          "Indoor vs outdoor (IP rating) confusion drives returns — must be prominent",
        ],
      },
      {
        slug: "security-cameras",
        label: "Security Cameras",
        hook: "Subscription-free local storage, person detection, and cloud-vs-local processing are the new buyer questions.",
        pains: [
          "Subscription-free / no-monthly-fee messaging is a huge winning angle — often missing",
          "Local storage (SD, NAS, hub) vs cloud-only: privacy buyers read listings for this",
          "Night-vision spec (IR, color, distance in ft) rarely quantified clearly",
        ],
      },
    ],
  },
  {
    slug: "jewelry",
    label: "Jewelry",
    hook: "Sell sentiment, not specs — but get the specs right too.",
    pains: [
      "Material claims (sterling, gold-filled, plated) must be precise",
      "Gift-occasion keywords (anniversary, birthday) drive volume",
      "Photo-driven category — copy must extend, not repeat, the image",
    ],
    subNiches: [
      {
        slug: "stud-earrings",
        label: "Stud Earrings",
        hook: "Hypoallergenic material specifics — 14k, sterling 925, surgical steel — must be in title.",
        pains: [
          "Nickel-free / hypoallergenic claims need material backup (ASTM F899, etc.)",
          "Stone size in mm or carat weight rarely in title — it's a core search term",
          "Backing type (screw-back, push-back, lever) matters for sensitive lobes — often unmentioned",
        ],
      },
      {
        slug: "pendant-necklaces",
        label: "Pendant Necklaces",
        hook: "Chain length, pendant dimensions, and clasp type are the three spec questions that stall carts.",
        pains: [
          "Chain length (16', 18', 20') needs an explicit mention, not a size-chart image",
          "Initial / birthstone / custom options usually share a single listing — split them",
          "Tarnish resistance (PVD, rhodium-plated) is a durability signal buyers search for",
        ],
      },
      {
        slug: "stackable-rings",
        label: "Stackable Rings",
        hook: "Band width, finish (polished, matte, hammered), and stacking-set count are the keyword set.",
        pains: [
          "Individual band width (1mm vs 2mm vs 3mm) is a stackability decider — usually absent",
          "Set count (3-piece, 5-piece) and size uniformity affect fit confidence",
          "Finish compatibility (won't scratch, mixes gold/silver) is reassurance copy worth adding",
        ],
      },
      {
        slug: "charm-bracelets",
        label: "Charm Bracelets",
        hook: "Pandora-compatibility, chain type (link, bangle, cord), and charm inclusion — all title-worthy.",
        pains: [
          "Compatibility-with-X claims need legal care but are search drivers — handle both",
          "Number of included charms and whether they're replaceable matters to gifters",
          "Metal specifics (solid vs plated) for charm attachments rarely specified",
        ],
      },
    ],
  },
  {
    slug: "home-decor",
    label: "Home Decor",
    hook: "Turn aesthetic-driven shoppers into add-to-carts.",
    pains: [
      "Style keywords (Japandi, boho, mid-century) shift seasonally",
      "Dimensions & wall-fit anxiety stops conversions",
      "Generic 'modern decor' loses to style-specific hooks",
    ],
    subNiches: [
      {
        slug: "wall-art",
        label: "Wall Art",
        hook: "Canvas, framed poster, tapestry, or metal — four mediums, four totally different buyer searches.",
        pains: [
          "Medium (canvas, poster, metal) and framing must be in title — images alone aren't enough",
          "Exact print dimensions in inches AND cm reach both US and EU buyers",
          "Orientation (landscape, portrait, triptych) and multi-panel count need explicit callout",
        ],
      },
      {
        slug: "throw-pillows",
        label: "Throw Pillows",
        hook: "Cover-only vs insert-included is the #1 source of negative reviews — lead with it.",
        pains: [
          "'Cover only' vs 'insert included' must be in title, not bullet 3",
          "Material (linen blend, velvet, boucle) and wash-care rarely paired",
          "Size in inches + common equivalents (18x18, 20x20) affects sofa fit — surface both",
        ],
      },
      {
        slug: "area-rugs",
        label: "Area Rugs",
        hook: "Washable, low-pile, indoor-outdoor, and runner lengths are the four most-searched rug attributes of 2026.",
        pains: [
          "Machine-washable claim needs explicit machine-size limit (some are 'handwash only' in reality)",
          "Pile height (low, medium, high) determines door-clearance and vacuum compatibility",
          "Non-slip backing vs separate rug-pad-required distinction frustrates buyers when hidden",
        ],
      },
      {
        slug: "decorative-vases",
        label: "Decorative Vases",
        hook: "Floor vs tabletop, ceramic vs glass, and opening diameter — all spec-sheet essentials for the pickup buyer.",
        pains: [
          "Opening diameter dictates whether pampas grass / stems fit — usually unspecified",
          "Watertight vs decorative-only must be declared — real flowers are a common use case",
          "Set count and height range (for clustered styling) rarely surfaced as a benefit",
        ],
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubNiche(
  categorySlug: string,
  subNicheSlug: string
): SubNiche | undefined {
  return getCategoryBySlug(categorySlug)?.subNiches?.find(
    (s) => s.slug === subNicheSlug
  );
}
