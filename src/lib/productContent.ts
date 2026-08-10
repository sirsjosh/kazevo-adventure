import type { ProductReviewsData } from "./judgeme.server";

export const SITE_URL = "https://kazevo.store";

export interface ProductPageContent {
  /** Route path, e.g. "/football-bag" */
  path: string;
  /** Shopify product handle */
  handle: string;
  /** Display name used in copy and structured data */
  name: string;
  /** Small pill above the H1 */
  eyebrow: string;
  /** H1 rendered as three coloured fragments */
  headline: [string, string, string];
  /** Paragraph under the H1 */
  intro: string;
  /** Four short checkmark bullets next to the buy button */
  bullets: string[];
  /** Benefit cards */
  benefits: Array<{ title: string; body: string }>;
  /** Section heading + subheading above the benefit cards */
  benefitsHeading: string;
  benefitsSub: string;
  /** Technical specs table rows */
  specs: Array<[string, string]>;
  faqs: Array<{ q: string; a: string }>;
  /** Closing CTA */
  ctaHeadline: string;
  ctaSub: string;
  /** SEO */
  title: string;
  description: string;
  fallbackImage: string;
}

const CDN = "https://cdn.shopify.com/s/files/1/0744/5200/9121/files";

export const productPages = {
  "football-bag": {
    path: "/football-bag",
    handle: "欧美跨境女包晚宴包橄榄球造形趣味手提包聚会包单肩包批发",
    name: "kazevo Football-Shaped Hand Bag",
    eyebrow: "Party · Statement · Gift",
    headline: ["kazevo", "football-shaped", "hand bag"],
    intro:
      "An oval, football-silhouette handbag in printed PU — small enough for an evening out, loud enough to be the thing everyone asks about.",
    bullets: [
      "Playful oval football shape",
      "Printed PU shell, polyester lining",
      "Zip closure, structured body",
      "Five colourways",
    ],
    benefits: [
      {
        title: "A shape people notice",
        body: "The oval football silhouette reads as a design piece, not a novelty — structured, clean-stitched and photogenic from every angle.",
      },
      {
        title: "Printed PU, wipe-clean",
        body: "The PU shell holds its print and shrugs off spills, so a party bag still looks new the next weekend.",
      },
      {
        title: "Holds the essentials",
        body: "At 23 × 15 × 16 cm it swallows a phone, cardholder, keys, lipstick and a compact — the full going-out kit, nothing more.",
      },
      {
        title: "Firm body, zip-secure",
        body: "A hard-structured shell keeps the shape under a crowded table, and the full-length zip keeps everything where you left it.",
      },
      {
        title: "Hand or shoulder",
        body: "Carry it by hand for dinner, drop the strap for a bar or a game-day tailgate — one bag, two moods.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns if the colour isn't what you pictured.",
      },
    ],
    benefitsHeading: "The party bag that starts the conversation",
    benefitsSub:
      "Structured, printed and unapologetically fun — built for nights out, game days and gifting.",
    specs: [
      ["Material", "PU (polyurethane)"],
      ["Lining", "Polyester"],
      ["Shape", "Oval / football silhouette"],
      ["Closure", "Zipper"],
      ["Structure", "Hard, self-supporting body"],
      ["Dimensions", "23 × 15 × 16 cm (pink: 23 × 16 × 16 cm)"],
      ["Weight", "360 g"],
      ["Colours", "Brown, White, Black, Denim Blue, Pink"],
      ["Style", "Street / statement, printed"],
      ["Best for", "Evenings out, parties, game days, gifting"],
    ],
    faqs: [
      {
        q: "How much actually fits inside?",
        a: "A large phone, cardholder, keys, lipstick and a small compact sit comfortably. It's an evening bag, not a day bag.",
      },
      {
        q: "Is it real leather?",
        a: "No — it's a printed PU shell with a polyester lining, chosen so the football print stays sharp and wipes clean.",
      },
      {
        q: "Does it stand up on its own?",
        a: "Yes. The body is hard-structured, so it holds its oval shape on a table rather than slumping.",
      },
      {
        q: "How do I clean it?",
        a: "Wipe with a damp cloth and mild soap, then air dry. Avoid solvents, which can lift the print.",
      },
    ],
    ctaHeadline: "Make an entrance.",
    ctaSub: "Free worldwide shipping on every kazevo football-shaped hand bag.",
    title: "kazevo Football-Shaped Hand Bag | Statement Party Bag",
    description:
      "The kazevo Football-Shaped Hand Bag: printed PU oval party bag with polyester lining, zip closure and a structured 23 × 15 × 16 cm body. Five colourways, free worldwide shipping.",
    fallbackImage: `${CDN}/pomelli_photoshoot_image_1_1_0809_7.png?v=1786259368`,
  },

  "retro-leather-backpack": {
    path: "/retro-leather-backpack",
    handle: "跨境bags-2024新款时尚韩版简约双肩包-时尚休闲复古软皮背包",
    name: "kazevo Retro Soft Leather Backpack",
    eyebrow: "Commute · City · Travel",
    headline: ["kazevo", "retro soft", "leather backpack"],
    intro:
      "A soft-touch PU backpack with clean top-stitching and a breathable back panel — minimal enough for the office, warm enough for a weekend away.",
    bullets: [
      "Soft-touch PU, retro finish",
      "Breathable back panel",
      "Hidden zip pocket inside",
      "Only 390 g",
    ],
    benefits: [
      {
        title: "Soft leather look, light build",
        body: "Supple PU gives the depth of worn leather at 390 g, so nothing digs in on a long commute.",
      },
      {
        title: "Breathable against your back",
        body: "The ventilated back panel keeps air moving on warm platforms and packed trains.",
      },
      {
        title: "Organised, not fussy",
        body: "A zipped interior pocket for your passport and cards, a divider for a tablet, and a 3D outer pocket for the things you grab most.",
      },
      {
        title: "Clean top-stitched lines",
        body: "Visible saddle stitching along every seam — the detail that keeps a simple silhouette from looking plain.",
      },
      {
        title: "Zip-closed, medium structure",
        body: "A full zip main opening with a mid-firm body: it holds shape when empty, still packs down when full.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Quiet leather looks, everyday weight",
    benefitsSub: "Urban-simple styling with the pockets you actually use.",
    specs: [
      ["Material", "PU (soft-touch)"],
      ["Lining", "Polyester"],
      ["Weight", "390 g"],
      ["Closure", "Zipper"],
      ["Interior", "Zipped hidden pocket, divider layer"],
      ["Exterior", "3D structured outer pocket"],
      ["Back panel", "Breathable"],
      ["Structure", "Medium firmness"],
      ["Colours", "Light Brown, Dark Brown, Black"],
      ["Best for", "Commuting, city days, light travel"],
    ],
    faqs: [
      {
        q: "Will a laptop fit?",
        a: "A 13-inch laptop or tablet fits in the divider layer. For a 15-inch machine, look at the kazevo Functional School Backpack instead.",
      },
      {
        q: "Is the leather real?",
        a: "No — it's a soft-touch PU chosen for the retro finish, lower weight and easier care.",
      },
      {
        q: "Is it waterproof?",
        a: "The PU shell sheds light rain, but it isn't sealed. Wipe it dry after a downpour.",
      },
      {
        q: "How do I keep the finish?",
        a: "Wipe with a damp cloth, air dry away from direct heat, and avoid alcohol-based cleaners.",
      },
    ],
    ctaHeadline: "Simple lines. Soft finish.",
    ctaSub: "Free worldwide shipping on every kazevo Retro Soft Leather Backpack.",
    title: "kazevo Retro Soft Leather Backpack | 390g PU Commuter Pack",
    description:
      "The kazevo Retro Soft Leather Backpack: 390 g soft-touch PU commuter pack with breathable back panel, hidden zip pocket and 3D outer pocket. Three colours, free worldwide shipping.",
    fallbackImage: `${CDN}/O1CN01RnRmvE1DpsHqrxZ8V__2217508950266-0-cib.jpg?v=1786246992`,
  },

  "functional-school-backpack": {
    path: "/functional-school-backpack",
    handle: "unilulu户外机能风潮流徒步旅行背包多巴胺撞色轻量化运动双肩包",
    name: "kazevo Functional School Backpack",
    eyebrow: "School · Trail · Techwear",
    headline: ["kazevo", "functional", "school backpack"],
    intro:
      "A 130 g techwear pack in dopamine colour-blocks, with arc-shaped straps and two compartments — light enough to forget you're wearing it.",
    bullets: [
      "Just 130 g empty",
      "Arc-shaped shoulder straps",
      "Two-compartment layout",
      "Five colour-block combos",
    ],
    benefits: [
      {
        title: "Barely-there 130 g",
        body: "One of the lightest packs we carry: the weight you notice is the weight you packed, not the bag.",
      },
      {
        title: "Arc straps that follow you",
        body: "Curved shoulder straps sit along the shoulder line instead of cutting across it, spreading load on long walks.",
      },
      {
        title: "Two compartments, no digging",
        body: "Books and a jacket in the main space, small kit in the second layer — everything has a home.",
      },
      {
        title: "Colour-block that pops",
        body: "Five dopamine pairings — pink + green, khaki + blue, blue + green, purple + blue, purple + green.",
      },
      {
        title: "Polyester that takes a beating",
        body: "Tight-woven polyester with top-stitched seams handles lockers, trail dust and the bottom of a bus.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Techwear looks, feather weight",
    benefitsSub: "Built for the walk to school and the trail after it.",
    specs: [
      ["Material", "Polyester"],
      ["Lining", "Polyester"],
      ["Weight", "130 g"],
      ["Capacity", "Under 20 L"],
      ["Compartments", "2"],
      ["Carry system", "Arc-shaped shoulder straps"],
      ["Laptop", "Fits an 8-inch tablet"],
      ["Colours", "Pink + Green, Khaki + Blue, Blue + Green, Purple + Blue, Purple + Green"],
      ["Style", "Urban minimal / functional"],
      ["Best for", "School, day hikes, outdoor sport"],
    ],
    faqs: [
      {
        q: "How light is 130 g really?",
        a: "About the weight of a paperback. It's a lightweight day pack — for heavy textbook loads, the kazevo Large-Capacity styles are a better fit.",
      },
      {
        q: "Will a laptop fit?",
        a: "It's sized for tablets up to 8 inches plus books. A full-size laptop won't sit safely.",
      },
      {
        q: "Is it water resistant?",
        a: "The polyester shell sheds light drizzle. It isn't a sealed dry bag, so keep electronics in a pouch on wet days.",
      },
      {
        q: "Do the straps adjust?",
        a: "Yes — the arc straps adjust for both younger teens and adults.",
      },
    ],
    ctaHeadline: "Less bag. More day.",
    ctaSub: "Free worldwide shipping on every kazevo Functional School Backpack.",
    title: "kazevo Functional School Backpack | 130g Colour-Block Pack",
    description:
      "The kazevo Functional School Backpack: a 130 g polyester day pack with arc-shaped straps, two compartments and five dopamine colour-block combos. Free worldwide shipping.",
    fallbackImage: `${CDN}/pomelli_photoshoot_image_1_1_0809_17.png?v=1786259914`,
  },

  "jiumeiso-backpack": {
    path: "/jiumeiso-backpack",
    handle: "韩版ins小清新纯色背包大容量上课补习通勤女书包旅行轻便双肩包",
    name: "kazevo Jiumeiso Backpack",
    eyebrow: "Study · Commute · Travel",
    headline: ["kazevo", "Jiumeiso", "backpack"],
    intro:
      "A soft-toned nylon pack in five colours and two sizes — breathable, ultralight and built to carry a full study day without pulling on your shoulders.",
    bullets: [
      "Breathable ultralight nylon",
      "Two sizes: small and big",
      "Arc straps for load relief",
      "Five muted colourways",
    ],
    benefits: [
      {
        title: "Pick your size",
        body: "Small for class and errands, big for a full timetable plus a laptop sleeve, gym kit and lunch.",
      },
      {
        title: "Load taken off your shoulders",
        body: "Arc-shaped straps plus a load-relief build spread weight across the back instead of hanging off two points.",
      },
      {
        title: "Breathable nylon",
        body: "Light, airy nylon with a polyester lining — no sweat patch after a long walk between buildings.",
      },
      {
        title: "Calm colours that go with everything",
        body: "Yellow, cream, green, pink and black in soft, unsaturated tones — clean enough for a lecture hall or an office.",
      },
      {
        title: "Everyday capacity",
        body: "Room for A4 folders, a water bottle and a jacket, with stitched seams that hold the shape when it's full.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Quiet colour, serious capacity",
    benefitsSub: "The clean everyday pack for class, tutoring and the commute in between.",
    specs: [
      ["Material", "Nylon"],
      ["Lining", "Polyester"],
      ["Functions", "Breathable, ultralight, load-relieving"],
      ["Carry system", "Arc-shaped shoulder straps"],
      ["Sizes", "Small and Big"],
      ["Colours", "Yellow, Cream, Green, Pink, Black"],
      ["Pattern", "Letter print"],
      ["Style", "Street / minimal"],
      ["Best for", "School, tutoring, commuting, light travel"],
    ],
    faqs: [
      {
        q: "What's the difference between small and big?",
        a: "Small suits a tablet, notebooks and daily kit. Big adds room for a laptop, A4 folders and a change of clothes.",
      },
      {
        q: "Can it carry heavy textbooks?",
        a: "Yes — the arc straps and load-relief back are designed for full book loads. Pack heaviest items closest to your back.",
      },
      {
        q: "Is the fabric water resistant?",
        a: "Nylon sheds light rain well, but it isn't sealed. Use a cover in sustained downpours.",
      },
      {
        q: "How do I wash it?",
        a: "Hand wash with cool water and mild soap, then air dry. Skip the tumble dryer.",
      },
    ],
    ctaHeadline: "Carry the whole day.",
    ctaSub: "Free worldwide shipping on every kazevo Jiumeiso Backpack.",
    title: "kazevo Jiumeiso Backpack | Lightweight Nylon School Pack",
    description:
      "The kazevo Jiumeiso Backpack: breathable ultralight nylon in five muted colours and two sizes, with arc-shaped load-relief straps for school and commuting. Free worldwide shipping.",
    fallbackImage: `${CDN}/pomelli_photoshoot_image_1_1_0809_19.png?v=1786260691`,
  },

  "color-block-kids-backpack": {
    path: "/color-block-kids-backpack",
    handle: "2026新款儿童书包多巴胺撞色学院风小背包休闲双肩包幼儿园女孩背",
    name: "kazevo Color-Block Kids Backpack",
    eyebrow: "Ages 3–6 · Preschool",
    headline: ["kazevo", "color-block", "kids backpack"],
    intro:
      "A preppy little nylon pack in five dopamine colours, sized for preschool shoulders and built with load-relieving arc straps.",
    bullets: [
      "Sized for ages 3–6",
      "Load-relieving arc straps",
      "Light nylon shell",
      "Five bright colours",
    ],
    benefits: [
      {
        title: "Made small on purpose",
        body: "A compact body proportioned to a preschooler's back, so it doesn't swing at the hips or push them forward.",
      },
      {
        title: "Kinder on growing shoulders",
        body: "Arc-shaped, load-relieving straps spread the weight of a lunchbox and a change of clothes across the whole shoulder.",
      },
      {
        title: "Colours they'll actually pick",
        body: "Light pink, yellow, dark pink, brown and black — bright college-style colour-blocking that's easy to spot on a peg rail.",
      },
      {
        title: "Nylon that survives the playground",
        body: "Tight nylon with a polyester lining wipes clean after the sandpit, the paint table and the puddle on the way home.",
      },
      {
        title: "Simple for small hands",
        body: "Wide zip pulls and one main compartment mean they can open and close it themselves.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Their first proper backpack",
    benefitsSub: "Light, bright and sized for little shoulders — no hand-me-down bulk.",
    specs: [
      ["Material", "Nylon"],
      ["Lining", "Polyester"],
      ["Function", "Load-relieving"],
      ["Carry system", "Arc-shaped shoulder straps"],
      ["Age range", "Preschool / kindergarten (approx. 3–6)"],
      ["Colours", "Pink, Yellow, Dark Pink, Brown, Black"],
      ["Pattern", "Colour-block, college style"],
      ["Style", "Playful / preppy"],
      ["Best for", "Preschool, nursery, days out"],
    ],
    faqs: [
      {
        q: "What age is this for?",
        a: "It's proportioned for preschool and kindergarten — roughly ages 3 to 6. For primary school, look at the kazevo Ultra-Light Kids Backpack.",
      },
      {
        q: "Will A4 folders fit?",
        a: "No — this is a small preschool size for a lunchbox, a water bottle and spare clothes.",
      },
      {
        q: "Can it be washed?",
        a: "Wipe the nylon shell with a damp cloth and mild soap, then air dry. Avoid the washing machine.",
      },
      {
        q: "Are the straps adjustable?",
        a: "Yes, so the bag can be set high on the back and grow with them for a season or two.",
      },
    ],
    ctaHeadline: "Big colour. Little pack.",
    ctaSub: "Free worldwide shipping on every kazevo Color-Block Kids Backpack.",
    title: "kazevo Color-Block Kids Backpack | Preschool Nylon Pack",
    description:
      "The kazevo Color-Block Kids Backpack: a light nylon preschool pack with load-relieving arc straps in five dopamine colours, sized for ages 3–6. Free worldwide shipping.",
    fallbackImage: `${CDN}/O1CN01ikamVK1nqdHhPZfz1__2216563525141-0-cib.jpg?v=1786165347`,
  },

  "ultra-light-kids-backpack": {
    path: "/ultra-light-kids-backpack",
    handle: "书包女2025新款小学生减负1-3-6年级儿童可爱痛包学生超轻双肩包",
    name: "kazevo Ultra-Light Kids Backpack",
    eyebrow: "Grades 1–6 · Primary School",
    headline: ["kazevo", "ultra-light", "kids backpack"],
    intro:
      "A waterproof Oxford school pack built around one idea: take weight off a primary schooler's back. Arc straps, load relief and heart-print detailing.",
    bullets: [
      "Waterproof Oxford fabric",
      "Load-relieving arc straps",
      "Sized for grades 1–6",
      "Pink, Purple, Blue",
    ],
    benefits: [
      {
        title: "Built to reduce the load",
        body: "The whole pack is engineered around load relief — arc straps, a shaped back and a body that keeps books close to the spine.",
      },
      {
        title: "Waterproof Oxford shell",
        body: "Oxford fabric with a waterproof finish keeps homework dry through the walk home in the rain.",
      },
      {
        title: "Room for a full timetable",
        body: "A4 books, folders, a lunchbox and a bottle all fit without forcing the zip.",
      },
      {
        title: "Details they love",
        body: "Heart motifs and printed accents in pink, purple and blue — cute enough to want, plain enough to last a few years.",
      },
      {
        title: "Wipe-clean lining",
        body: "The polyester lining wipes out after a leaky bottle instead of soaking through to the books.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Lighter on their back, every school day",
    benefitsSub: "A waterproof primary-school pack that carries a full timetable without the strain.",
    specs: [
      ["Material", "Oxford fabric"],
      ["Lining", "Polyester"],
      ["Function", "Waterproof, load-relieving"],
      ["Carry system", "Arc-shaped shoulder straps"],
      ["Age range", "Primary school, grades 1–6"],
      ["Colours", "Pink, Purple, Blue"],
      ["Pattern", "Hearts, print accents, top-stitching"],
      ["Style", "Playful / cute"],
      ["Best for", "School days, tutoring, after-school clubs"],
    ],
    faqs: [
      {
        q: "Is it really waterproof?",
        a: "The Oxford shell has a waterproof finish that keeps rain off books on a normal walk home. Seams aren't sealed, so it isn't a dry bag.",
      },
      {
        q: "Will A4 folders fit?",
        a: "Yes — the main compartment takes A4 books and folders flat.",
      },
      {
        q: "What age is it for?",
        a: "Primary school, roughly grades 1 to 6. For preschool, the Color-Block Kids Backpack is a better size.",
      },
      {
        q: "How do I clean it?",
        a: "Wipe with a damp cloth and mild soap, then air dry. Avoid the machine so the waterproof finish lasts.",
      },
    ],
    ctaHeadline: "Take the weight off.",
    ctaSub: "Free worldwide shipping on every kazevo Ultra-Light Kids Backpack.",
    title: "kazevo Ultra-Light Kids Backpack | Waterproof School Bag",
    description:
      "The kazevo Ultra-Light Kids Backpack: waterproof Oxford school bag with load-relieving arc straps, sized for grades 1–6 in pink, purple and blue. Free worldwide shipping.",
    fallbackImage: `${CDN}/pomelli_photoshoot_image_1_1_0809_3.png?v=1786261212`,
  },

  "crossbody-waist-bag": {
    path: "/crossbody-waist-bag",
    handle: "超便宜爆款可爱斜挎腰包日系新款清新百搭小包包女森系少女化妆包",
    name: "kazevo Crossbody Waist Bag – Japanese Style",
    eyebrow: "Everyday · Festival · Travel",
    headline: ["kazevo", "crossbody", "waist bag"],
    intro:
      "A soft canvas dumpling-shaped bag you can wear crossbody or at the waist — pin-friendly, roomy for its size and impossible to overthink.",
    bullets: [
      "Soft canvas, PU lining",
      "Crossbody or waist carry",
      "Zip pocket inside",
      "Pin and badge friendly",
    ],
    benefits: [
      {
        title: "Two ways to wear it",
        body: "Sling it across the chest or cinch it at the waist — the single adjustable strap does both without a swap.",
      },
      {
        title: "Soft canvas that packs flat",
        body: "The soft body squashes into a suitcase and springs back, so it travels as a second bag without taking room.",
      },
      {
        title: "Make it yours",
        body: "The flat canvas face is built for pins, badges and patches — the base for an itabag or a festival build.",
      },
      {
        title: "Bigger than it looks",
        body: "The dumpling shape opens wide: phone, wallet, sunglasses, a compact and a small bottle of water all fit.",
      },
      {
        title: "Zip pocket inside",
        body: "An interior zipped layer keeps cards and keys separate from loose make-up.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Small bag, no compromises",
    benefitsSub: "Japanese-style canvas that works for errands, festivals and travel days.",
    specs: [
      ["Material", "Canvas"],
      ["Lining", "PU"],
      ["Shape", "Dumpling / rounded crossbody"],
      ["Closure", "Zipper"],
      ["Carry", "Crossbody or waist, single adjustable strap"],
      ["Interior", "Zipped divider pocket"],
      ["Exterior", "3D structured outer pocket"],
      ["Structure", "Soft"],
      ["Colours", "Yellow, Lime Green, Light Purple, Pink"],
      ["Best for", "Everyday carry, festivals, travel, make-up"],
    ],
    faqs: [
      {
        q: "Do the badges come with it?",
        a: "No — the bag ships plain so you can pin your own. The flat canvas face is made for it.",
      },
      {
        q: "Can I wear it as a belt bag?",
        a: "Yes. The strap adjusts short enough to sit at the waist and long enough for a crossbody drop.",
      },
      {
        q: "Will a large phone fit?",
        a: "Yes — a Pro Max-size phone fits easily alongside a wallet and keys.",
      },
      {
        q: "How do I clean canvas?",
        a: "Spot clean with mild soap and cool water, then air dry. Don't machine wash — the PU lining doesn't like it.",
      },
    ],
    ctaHeadline: "Grab it and go.",
    ctaSub: "Free worldwide shipping on every kazevo Crossbody Waist Bag.",
    title: "kazevo Crossbody Waist Bag | Japanese Style Canvas Bag",
    description:
      "The kazevo Crossbody Waist Bag: soft canvas dumpling bag with PU lining, zip pocket and crossbody or waist carry. Four colours, pin-friendly, free worldwide shipping.",
    fallbackImage: `${CDN}/pomelli_photoshoot_image_1_1_0809_27.png?v=1786261017`,
  },

  "football-fan-leather-crossbody": {
    path: "/football-fan-leather-crossbody",
    handle: "新款疯马皮橄榄球包男士复古斜挎小包真皮单肩包休闲牛皮胸包男包",
    name: "kazevo Football Fan Leather Crossbody Bag",
    eyebrow: "Leather · Retro · Everyday",
    headline: ["kazevo", "football fan", "leather crossbody"],
    intro:
      "A full-grain cowhide crossbody shaped like a football, finished in crazy-horse leather that darkens and patinas the more you carry it.",
    bullets: [
      "Full-grain cowhide, crazy-horse finish",
      "Riveted retro hardware",
      "31 × 14 × 13 cm, 450 g",
      "Ten leather colourways",
    ],
    benefits: [
      {
        title: "Real full-grain cowhide",
        body: "Top-layer hide, not split or bonded leather — it creases where you fold it and softens instead of cracking.",
      },
      {
        title: "Crazy-horse patina",
        body: "The waxed crazy-horse finish shifts tone with wear, so scuffs read as character rather than damage.",
      },
      {
        title: "Football silhouette, done seriously",
        body: "The oval game-day shape is cut in leather with clean panel seams and rivets — a fan piece you can wear to dinner.",
      },
      {
        title: "Light for leather",
        body: "450 g across a 31 × 14 × 13 cm body: phone, wallet, keys, cables and a compact camera without the shoulder ache.",
      },
      {
        title: "Crossbody or chest carry",
        body: "Wear it long across the body or shortened as a chest bag — the strap adjusts for either, hands free both ways.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Game-day shape. Heirloom leather.",
    benefitsSub: "Vintage-cut cowhide built to age well season after season.",
    specs: [
      ["Material", "Full-grain cowhide (crazy-horse finish)"],
      ["Lining", "Poly-cotton"],
      ["Dimensions", "31 × 14 × 13 cm"],
      ["Weight", "450 g"],
      ["Hardware", "Rivets, metal zip pulls"],
      ["Carry", "Adjustable crossbody / chest strap"],
      ["Style", "Retro Americana"],
      ["Colours", "Black, Elephant Grain, Vintage Brown, Vintage Brown Light, Light Grey, Grain Brown, Horse Brown, Mocha Brown, Brown, Amber Grain"],
      ["Best for", "Daily carry, game days, travel"],
    ],
    faqs: [
      {
        q: "Is this genuine leather?",
        a: "Yes — full-grain top-layer cowhide with a waxed crazy-horse finish, lined in poly-cotton.",
      },
      {
        q: "Will it hold a large phone?",
        a: "Comfortably. A Pro Max-sized phone, cardholder, keys and cables all fit with room to spare.",
      },
      {
        q: "Why do the colours look slightly different in photos?",
        a: "Crazy-horse leather takes dye unevenly by design, so every piece varies a little. That variation is the finish, not a flaw.",
      },
      {
        q: "How should I care for it?",
        a: "Wipe with a dry cloth and treat occasionally with leather balm. Scratches buff out with your thumb.",
      },
    ],
    ctaHeadline: "Carry the game.",
    ctaSub: "Free worldwide shipping on every kazevo Football Fan Leather Crossbody Bag.",
    title: "kazevo Football Fan Leather Crossbody Bag | Full-Grain Cowhide",
    description:
      "The kazevo Football Fan Leather Crossbody Bag: 450 g full-grain crazy-horse cowhide crossbody, 31 × 14 × 13 cm, riveted retro hardware and ten colourways. Free worldwide shipping.",
    fallbackImage: `${CDN}/O1CN01JZlbUz1J3DgHol7Eb__2257160972-0-cib.jpg?v=1786251892`,
  },

  "outdoor-hiking-backpack": {
    path: "/outdoor-hiking-backpack",
    handle: "unilulu轻便撞色户外徒步多巴胺登山双肩包2026新款出行休闲背包",
    name: "kazevo Outdoor Hiking Backpack",
    eyebrow: "Hiking · Camping · Cycling",
    headline: ["kazevo", "outdoor", "hiking backpack"],
    intro:
      "A colour-blocked nylon daypack built for trails, campsites and bike commutes — 500 g, under 20 litres, and shaped to sit still while you move.",
    bullets: [
      "Ripstop-feel nylon shell",
      "Curved ergonomic shoulder straps",
      "Under 20 L day capacity",
      "Three dopamine colourways",
    ],
    benefits: [
      {
        title: "Nylon that takes a beating",
        body: "The nylon shell shrugs off branch scrapes, granite and gravel far better than the polyester packs at this weight.",
      },
      {
        title: "Curved straps that follow you",
        body: "Contoured shoulder straps track the shape of your shoulders, so the load stays centred on a scramble instead of swinging.",
      },
      {
        title: "Day-hike sized",
        body: "Under 20 litres: water, a shell layer, snacks, a first-aid kit and a camera — everything a day out needs, nothing you'd regret carrying.",
      },
      {
        title: "500 g on your back",
        body: "Half a kilo empty means the pack disappears once it's loaded and you're an hour into the climb.",
      },
      {
        title: "Colour blocks you can spot",
        body: "Purple-pink, pink-green and coffee-khaki — high-contrast panels that read on a trail and in a group photo.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "Light enough to forget. Tough enough to trust.",
    benefitsSub: "A dopamine-coloured daypack for hiking, camping and cycling.",
    specs: [
      ["Material", "Nylon"],
      ["Lining", "Polyester"],
      ["Capacity", "Under 20 L"],
      ["Weight", "500 g"],
      ["Harness", "Curved ergonomic shoulder straps"],
      ["Pattern", "Solid colour blocks"],
      ["Activities", "Hiking, camping, cycling"],
      ["Colours", "Purple with Pink, Pink with Green, Coffee Khaki"],
      ["Best for", "Day hikes, weekend camps, bike commutes"],
    ],
    faqs: [
      {
        q: "Is it big enough for an overnight trip?",
        a: "It's a sub-20 L daypack. Great for a full day out or a light overnight with compact gear, but not a multi-day load.",
      },
      {
        q: "Is it waterproof?",
        a: "The nylon shell sheds light rain and splash. For sustained downpours use a rain cover or a dry bag inside.",
      },
      {
        q: "Will it fit a laptop?",
        a: "A tablet or small 8-inch device fits. For a full laptop, look at the kazevo Functional School Backpack.",
      },
      {
        q: "How do I clean it?",
        a: "Hand wash with mild soap in cool water and air dry. Skip the machine and the tumble dryer.",
      },
    ],
    ctaHeadline: "Go further, carry less.",
    ctaSub: "Free worldwide shipping on every kazevo Outdoor Hiking Backpack.",
    title: "kazevo Outdoor Hiking Backpack | 500g Nylon Daypack",
    description:
      "The kazevo Outdoor Hiking Backpack: 500 g nylon daypack under 20 L with curved ergonomic straps, built for hiking, camping and cycling. Three colourways, free worldwide shipping.",
    fallbackImage: `${CDN}/pomelli_photoshoot_image_1_1_0810_29.png?v=1786337000`,
  },

  "mini-crossbody-bag": {
    path: "/mini-crossbody-bag",
    handle: "unilulu户外多巴胺单肩斜挎小方包露营徒步亲子小挎包轻量手机包",
    name: "kazevo Mini Crossbody Bag",
    eyebrow: "Phone · Trail · Everyday",
    headline: ["kazevo", "mini", "crossbody bag"],
    intro:
      "A 120 g square crossbody sized for a phone, a card and a key — the bag you take when you don't want to take a bag.",
    bullets: [
      "Just 120 g",
      "Dedicated phone and card pockets",
      "Single adjustable strap",
      "Four dopamine colours",
    ],
    benefits: [
      {
        title: "Barely there at 120 g",
        body: "Lighter than the phone inside it. You'll forget it's on until you reach for your card.",
      },
      {
        title: "Two pockets, zero rummaging",
        body: "A padded phone sleeve and a separate card pocket keep the two things you actually reach for apart.",
      },
      {
        title: "Small enough to say yes",
        body: "Camping, a festival, a school run, a walk with the kids — the horizontal square shape sits flat and never swings.",
      },
      {
        title: "Zip-closed and secure",
        body: "A full-length zip across the top keeps everything in when you crouch, climb or carry a toddler.",
      },
      {
        title: "Colours that pop",
        body: "Pink, yellow, blue and grey — bright enough to find in a tent, plain enough for the office run.",
      },
      {
        title: "Free worldwide shipping",
        body: "Ships free anywhere, with 7-day returns.",
      },
    ],
    benefitsHeading: "The smallest bag you'll wear the most",
    benefitsSub: "Phone, card, key. Nothing else, nothing missing.",
    specs: [
      ["Material", "Polyester"],
      ["Lining", "Polyester"],
      ["Weight", "120 g"],
      ["Shape", "Horizontal square, small"],
      ["Closure", "Zipper"],
      ["Interior", "Phone pocket, card pocket"],
      ["Strap", "Single adjustable shoulder strap"],
      ["Colours", "Pink, Yellow, Blue, Grey"],
      ["Best for", "Walks, camping, travel days, kids' outings"],
    ],
    faqs: [
      {
        q: "Will a large phone fit?",
        a: "Yes — the phone pocket takes a Pro Max or Ultra-sized handset, plus a card and a key alongside it.",
      },
      {
        q: "Is the strap adjustable?",
        a: "It is. Wear it long across the body or shortened on the shoulder.",
      },
      {
        q: "Is it suitable for kids?",
        a: "It's a favourite for family hikes — light, simple to open, and small enough for a child to carry their own snack and card.",
      },
      {
        q: "How do I clean it?",
        a: "Spot clean with mild soap and a damp cloth, then air dry.",
      },
    ],
    ctaHeadline: "Travel light. Really light.",
    ctaSub: "Free worldwide shipping on every kazevo Mini Crossbody Bag.",
    title: "kazevo Mini Crossbody Bag | 120g Lightweight Phone Bag",
    description:
      "The kazevo Mini Crossbody Bag: a 120 g polyester crossbody with phone and card pockets, zip closure and an adjustable strap. Four colours, free worldwide shipping.",
    fallbackImage: `${CDN}/pomelli_photoshoot_image_1_1_0810_20.png?v=1786337184`,
  },
} satisfies Record<string, ProductPageContent>;

export type ProductPageKey = keyof typeof productPages;

/** Builds the head() payload for a product page route. */
export function buildProductHead(
  content: ProductPageContent,
  reviews: ProductReviewsData | undefined,
) {
  const url = `${SITE_URL}${content.path}`;

  const scripts: Array<{ type: string; children: string }> = [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    },
  ];

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: content.name,
    description: content.description,
    image: content.fallbackImage,
    brand: { "@type": "Brand", name: "kazevo by solarah" },
    url,
  };

  if (reviews && reviews.reviewCount > 0) {
    productLd["aggregateRating"] = {
      "@type": "AggregateRating",
      ratingValue: String(reviews.averageRating),
      reviewCount: String(reviews.reviewCount),
    };
  }

  scripts.push({ type: "application/ld+json", children: JSON.stringify(productLd) });

  return {
    meta: [
      { title: content.title },
      { name: "description", content: content.description },
      { property: "og:title", content: content.title },
      { property: "og:description", content: content.description },
      { property: "og:type", content: "product" },
      { property: "og:url", content: url },
      { property: "og:image", content: content.fallbackImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: content.fallbackImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
