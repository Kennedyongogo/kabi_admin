// Dummy content for the prototype. Photos are free Unsplash placeholders
// plus the site's own images; replace with real project photos later.

const photo = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?w=${width}&q=70&auto=format&fit=crop`;

export const PHOTOS = {
  seedlingHand: photo("photo-1530836369250-ef72a3f5cda8"),
  fieldSunset: photo("photo-1500382017468-9049fed747ef"),
  harvestVeg: photo("photo-1464226184884-fa280b87c399"),
  soilTrowel: photo("photo-1416879595882-3373a0480b5b"),
  pottedSeedlings: photo("photo-1523348837708-15d4a09cfac2"),
  gardenPath: photo("photo-1585320806297-9794b3e4eeae"),
  youngMaize: photo("photo-1625246333195-78d9c38ad449"),
  lawn: photo("photo-1558904541-efa843a96f01"),
  seedlingTrays: photo("photo-1466692476868-aef1dfb1e735"),
  produceShelf: photo("photo-1542838132-92c53300491e"),
  raisedBeds: photo("photo-1591857177580-dc82b9ac4e1e"),
  cropRows: photo("photo-1560493676-04071c5f467b"),
  fieldHarvest: photo("photo-1605000797499-95a51c5269ae"),
  maize: "/images/b1.jpg",
  vegetables: "/images/b2.jpg",
  sprouts: "/images/b3.jpg",
};

const daysFromNow = (days) => {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const session = (id, startIn, lengthDays, location, fee, capacity, seatsLeft) => ({
  id,
  start_date: daysFromNow(startIn),
  end_date: daysFromNow(startIn + lengthDays - 1),
  location,
  fee,
  capacity,
  seats_left: seatsLeft,
  status: "upcoming",
});

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

const media = (id, file_url, caption) => ({ id, file_url, caption, alt_text: caption });

export const galleryAlbums = [
  {
    id: "album-hydroponics",
    name: "Hydroponics",
    slug: "hydroponics",
    media: [
      media("g1", PHOTOS.seedlingHand, "Transplanting seedlings into grow trays"),
      media("g2", PHOTOS.seedlingTrays, "Seedlings ready for the nutrient system"),
    ],
  },
  {
    id: "album-vertical",
    name: "Vertical Farming",
    slug: "vertical-farming",
    media: [
      media("g3", PHOTOS.pottedSeedlings, "Starter pots for a vertical garden wall"),
      media("g4", PHOTOS.raisedBeds, "Compact beds for small urban spaces"),
    ],
  },
  {
    id: "album-organic",
    name: "Organic Farming",
    slug: "organic-farming",
    media: [
      media("g5", PHOTOS.harvestVeg, "A fresh organic vegetable harvest"),
      media("g6", PHOTOS.soilTrowel, "Mixing compost into potting soil"),
      media("g7", PHOTOS.vegetables, "Home-grown produce, chemical free"),
    ],
  },
  {
    id: "album-landscaping",
    name: "Landscaping",
    slug: "landscaping",
    media: [
      media("g8", PHOTOS.gardenPath, "A landscaped garden walkway"),
      media("g9", PHOTOS.lawn, "Newly established lawn for a commercial client"),
    ],
  },
  {
    id: "album-training",
    name: "Training",
    slug: "training",
    media: [
      media("g10", PHOTOS.sprouts, "Practical session: reading early crop emergence"),
      media("g11", PHOTOS.produceShelf, "Market-readiness module: what buyers look for"),
    ],
  },
  {
    id: "album-farm-visits",
    name: "Farm Visits",
    slug: "farm-visits",
    media: [
      media("g12", PHOTOS.youngMaize, "Checking young maize during a farm visit"),
      media("g13", PHOTOS.fieldHarvest, "Harvest day in the field"),
    ],
  },
  {
    id: "album-projects",
    name: "Projects",
    slug: "projects",
    media: [
      media("g14", PHOTOS.maize, "Maize block after the agronomy plan"),
      media("g15", PHOTOS.cropRows, "Well-spaced crop rows on a client farm"),
      media("g16", PHOTOS.fieldSunset, "Evening over a finished project site"),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Knowledge Centre                                                    */
/* ------------------------------------------------------------------ */

const author = { name: "Aludoh", role: "Founder & Lead Consultant" };

export const articles = [
  {
    id: "a1",
    slug: "getting-started-with-hydroponics",
    title: "Getting started with hydroponics: a beginner's guide",
    category: { name: "Hydroponics" },
    featured_image: PHOTOS.seedlingTrays,
    published_at: daysFromNow(-6),
    author,
    featured: true,
    excerpt:
      "Hydroponics lets you grow more food with less water and no soil. Here is how the main systems work and how to choose your first one.",
    content: `Hydroponics is the practice of growing plants in a nutrient solution instead of soil. Because roots get water, oxygen and nutrients directly, plants grow faster and use up to 90% less water than in open fields.

## The three systems we install most
- NFT (Nutrient Film Technique): a thin film of nutrient water flows through channels. Ideal for lettuce, spinach and herbs.
- Drip systems: nutrient solution drips onto a growing medium such as cocopeat. Great for tomatoes, peppers and cucumbers.
- Dutch buckets: individual buckets for large fruiting crops, easy to manage and expand.

## What you need to start
- A clean, reliable water source and a way to test pH and EC (nutrient strength).
- A balanced hydroponic nutrient mix, not ordinary fertiliser.
- Shade or a greenhouse to protect crops from heavy rain and pests.

## Common beginner mistakes
- Skipping daily pH and EC checks. Small swings quickly stress plants.
- Starting too big. A small pilot teaches you the system before you invest heavily.
- Ignoring hygiene. Clean channels and tanks between crop cycles to prevent root disease.

## Our advice
Start with leafy greens in an NFT or small drip setup. They are forgiving, harvest in 4–6 weeks and sell well. Once you are confident, expand into fruiting crops.`,
  },
  {
    id: "a2",
    slug: "how-to-read-a-soil-test-report",
    title: "How to read a soil test report (and act on it)",
    category: { name: "Agronomy" },
    featured_image: PHOTOS.sprouts,
    published_at: daysFromNow(-14),
    author,
    excerpt:
      "A soil test is the cheapest way to raise yields and cut fertiliser costs, but only if you understand the numbers. Here is what each value means.",
    content: `A soil test tells you what your soil already has, so you only buy what your crop actually needs. Most reports look intimidating, but a few values matter most.

## pH: the master value
Most crops prefer a pH between 5.5 and 7.0. Below 5.5, nutrients such as phosphorus get locked up and fertiliser is wasted. Acidic soils are corrected with agricultural lime, applied well before planting.

## N, P and K
- Nitrogen (N) drives leafy growth. It is usually applied in splits: some at planting, the rest as top dressing.
- Phosphorus (P) supports roots and early growth. Low P is common in many Kenyan soils.
- Potassium (K) improves fruit quality and drought tolerance.

## Organic matter
Organic matter above 3% means better water holding and healthier soil life. Compost, manure and crop residues build it up over time.

## Turning results into action
- Correct pH first; it makes every other input work better.
- Match fertiliser type and rate to the deficiencies shown, not to habit.
- Retest every two to three seasons to track progress.

If your report is confusing, send it to us and we will translate it into a simple fertiliser plan.`,
  },
  {
    id: "a3",
    slug: "composting-101",
    title: "Composting 101: turning farm waste into black gold",
    category: { name: "Organic Farming" },
    featured_image: PHOTOS.soilTrowel,
    published_at: daysFromNow(-21),
    author,
    excerpt:
      "Good compost feeds your soil, saves money on fertiliser and recycles farm waste. Follow these steps to make it right every time.",
    content: `Compost is decomposed organic material that improves soil structure, feeds soil life and slowly releases nutrients to crops.

## The right mix
Aim for roughly three parts "browns" to one part "greens".
- Browns (carbon): dry leaves, maize stalks, straw, sawdust.
- Greens (nitrogen): fresh grass, vegetable waste, animal manure.

## Building the heap
- Choose a shaded spot with good drainage.
- Layer browns and greens, sprinkling a little soil between layers to introduce microbes.
- Keep the heap as moist as a squeezed sponge.

## Turning and timing
Turn the heap every one to two weeks to add oxygen. A well-managed heap heats up in the first days and is ready in about two to three months, when it is dark, crumbly and smells earthy.

## Using your compost
Apply two to five tonnes per acre before planting, or a handful per planting hole for vegetables. Over a few seasons you will see better water holding and healthier crops.`,
  },
  {
    id: "a4",
    slug: "grow-more-in-less-space-vertical-farming",
    title: "Grow more in less space with vertical farming",
    category: { name: "Vertical Farming" },
    featured_image: PHOTOS.pottedSeedlings,
    published_at: daysFromNow(-30),
    author,
    excerpt:
      "Balconies, rooftops and school compounds can all produce food. Vertical systems stack production upwards to multiply what a small space can grow.",
    content: `Vertical farming grows crops in stacked layers or on walls, so a few square metres can produce as much as a much larger plot.

## Where it works best
- Urban homes with balconies or rooftops.
- Schools and institutions that want fresh greens for their kitchens.
- Restaurants and hotels growing herbs on site.

## Popular setups
- Wall-mounted pocket or gutter gardens for herbs and greens.
- A-frame towers that make the most of floor space.
- Stacked hydroponic racks for commercial indoor production.

## Crops to start with
Kale (sukuma wiki), spinach, lettuce, coriander, spring onions and strawberries all perform well in vertical systems.

## Keys to success
- At least five to six hours of light, or grow lights indoors.
- Even watering, ideally through a simple drip or recirculating system.
- Regular harvesting to keep plants productive.`,
  },
  {
    id: "a5",
    slug: "water-wise-landscaping",
    title: "Water-wise landscaping for homes and institutions",
    category: { name: "Landscaping" },
    featured_image: PHOTOS.gardenPath,
    published_at: daysFromNow(-40),
    author,
    excerpt:
      "A beautiful compound does not need a huge water bill. Smart plant choices and design keep gardens green through the dry season.",
    content: `Water-wise landscaping combines good design, suitable plants and efficient irrigation to create outdoor spaces that stay attractive with less water.

## Choose the right plants
Indigenous and drought-tolerant plants such as aloes, bougainvillea, lavender and ornamental grasses thrive with minimal watering once established.

## Group plants by water needs
Place thirsty plants together near water points, and drought-tolerant plants in drier, sunnier areas. This avoids over-watering the whole garden.

## Mulch everything
A 5–8 cm layer of mulch reduces evaporation, suppresses weeds and keeps roots cool.

## Irrigate smart
- Drip irrigation delivers water straight to the roots with little waste.
- Water early in the morning or late evening.
- Consider rainwater harvesting from roofs to supply the garden.`,
  },
  {
    id: "a6",
    slug: "maize-management-five-things",
    title: "Maize management: five things to get right this season",
    category: { name: "Agronomy" },
    featured_image: PHOTOS.youngMaize,
    published_at: daysFromNow(-52),
    author,
    excerpt:
      "Most maize yield is won or lost in the first six weeks. Focus on these five practices for a stronger harvest.",
    content: `Maize is Kenya's most important crop, yet many farms harvest far below their potential. These five practices make the biggest difference.

## 1. Certified seed suited to your area
Choose a variety matched to your altitude and rainfall. Certified seed has reliable germination and vigour.

## 2. Plant on time and at the right spacing
Plant with the onset of reliable rains. A common spacing is 75 cm between rows and 25–30 cm between plants, one seed per hole.

## 3. Feed according to your soil
Use a soil test to guide planting fertiliser, then top dress with nitrogen at knee height.

## 4. Weed early
Keep the field weed-free for the first six weeks. Weeds at this stage can cut yields dramatically.

## 5. Scout for fall armyworm
Check plants weekly from emergence. Early detection allows targeted control before damage spreads.`,
  },
  {
    id: "a7",
    slug: "what-an-eia-involves",
    title: "What an Environmental Impact Assessment involves",
    category: { name: "Environment" },
    featured_image: PHOTOS.cropRows,
    published_at: daysFromNow(-65),
    author,
    excerpt:
      "Planning a new development or farm expansion? Here is a clear overview of the EIA process and how to prepare for it.",
    content: `An Environmental Impact Assessment (EIA) identifies how a proposed project could affect the environment and people around it, and how those effects will be managed. In Kenya, many projects require NEMA approval before work begins.

## The main stages
- Screening: confirming whether the project needs an EIA and at what level.
- Scoping and baseline study: understanding the site, its ecology and its community.
- Impact assessment: predicting positive and negative effects.
- Public participation: consulting people who may be affected.
- Report and management plan: documenting findings and mitigation measures.

## How to prepare
- Have clear project plans, site maps and ownership documents ready.
- Engage early. Involving the community from the start avoids delays later.
- Budget time for review and any additional information requests.

## Why it matters
A good EIA is more than a licence. It helps you design a project that is safer, more efficient and better accepted by the community.`,
  },
];

export const articleCategories = ["All", ...new Set(articles.map((a) => a.category.name))];

export const readingTime = (text = "") =>
  Math.max(1, Math.round(String(text).split(/\s+/).filter(Boolean).length / 200));

/* ------------------------------------------------------------------ */
/* Training                                                            */
/* ------------------------------------------------------------------ */

export const courses = [
  {
    id: "c1",
    name: "Hydroponic Farming Fundamentals",
    slug: "hydroponic-farming-fundamentals",
    category: "Hydroponics",
    level: "Beginner",
    featured: true,
    image: PHOTOS.seedlingHand,
    short_description: "A hands-on introduction to growing crops without soil.",
    description:
      "Build and run your own small hydroponic system. You will learn how NFT and drip systems work, how to mix and monitor nutrients, and how to grow healthy leafy greens from seedling to harvest.",
    duration: "3 Days",
    mode: "Physical",
    location: "Nairobi",
    fee: 12500,
    outcomes: [
      "Set up a working NFT or drip system",
      "Mix nutrients and monitor pH and EC",
      "Raise healthy seedlings and transplant them",
      "Spot and fix common crop problems",
    ],
    audience: "New farmers, hobby growers and students",
    sessions: [
      session("s1", 12, 3, "Nairobi training farm", 12500, 20, 6),
      session("s2", 40, 3, "Nairobi training farm", 12500, 20, 20),
    ],
  },
  {
    id: "c2",
    name: "Commercial Hydroponic Farming",
    slug: "commercial-hydroponic-farming",
    category: "Hydroponics",
    level: "Advanced",
    featured: true,
    image: PHOTOS.produceShelf,
    short_description: "Design, cost and manage a profitable hydroponic farm.",
    description:
      "For growers ready to scale. Covers greenhouse layout, system sizing, crop scheduling, costing, record keeping and selling to supermarkets, hotels and institutions.",
    duration: "5 Days",
    mode: "Physical",
    location: "Nairobi",
    fee: 28000,
    outcomes: [
      "Size and lay out a commercial system",
      "Plan continuous harvest schedules",
      "Calculate costs, margins and payback",
      "Meet buyer quality standards",
    ],
    audience: "Farm owners, investors and agribusiness managers",
    sessions: [session("s3", 25, 5, "Nairobi training farm", 28000, 15, 4)],
  },
  {
    id: "c3",
    name: "Vertical Farming",
    slug: "vertical-farming",
    category: "Vertical Farming",
    level: "Beginner",
    image: PHOTOS.pottedSeedlings,
    short_description: "Space-efficient systems for homes, schools and rooftops.",
    description:
      "Learn to plan, build and maintain vertical gardens that produce fresh food in small spaces, from wall gardens to stacked towers.",
    duration: "2 Days",
    mode: "Physical / Online",
    location: "Nairobi & Online",
    fee: 8500,
    outcomes: [
      "Choose the right vertical system for your space",
      "Build a simple wall or tower garden",
      "Select high-value crops for small spaces",
      "Maintain watering and plant health",
    ],
    audience: "Urban households, schools and institutions",
    sessions: [
      session("s4", 8, 2, "Online (Zoom)", 6000, 40, 18),
      session("s5", 33, 2, "Nairobi training farm", 8500, 20, 12),
    ],
  },
  {
    id: "c4",
    name: "Organic Agriculture",
    slug: "organic-agriculture",
    category: "Organic Farming",
    level: "Intermediate",
    image: PHOTOS.harvestVeg,
    short_description: "Healthy soils and sustainable, chemical-free production.",
    description:
      "Covers composting, soil health, natural pest management, crop rotation and the basics of organic certification.",
    duration: "3 Days",
    mode: "Physical",
    location: "Kiambu",
    fee: 10500,
    outcomes: [
      "Make and use quality compost",
      "Build soil health with rotation and cover crops",
      "Manage pests with natural methods",
      "Understand organic certification steps",
    ],
    audience: "Smallholder and commercial farmers",
    sessions: [session("s6", 18, 3, "Kiambu demo farm", 10500, 25, 9)],
  },
  {
    id: "c5",
    name: "Agronomy for Better Yields",
    slug: "agronomy",
    category: "Agronomy",
    level: "Intermediate",
    image: PHOTOS.maize,
    short_description: "Crop, soil and nutrient management that raises yields.",
    description:
      "Practical agronomy: reading soil tests, fertiliser planning, crop spacing, pest and disease scouting, and irrigation basics.",
    duration: "4 Days",
    mode: "Physical",
    location: "Nakuru",
    fee: 14000,
    outcomes: [
      "Interpret soil test results",
      "Plan fertiliser programmes by crop stage",
      "Scout and manage pests and diseases",
      "Improve planting and spacing practices",
    ],
    audience: "Farmers, farm managers and extension officers",
    sessions: [session("s7", 30, 4, "Nakuru field site", 14000, 25, 14)],
  },
  {
    id: "c6",
    name: "Greenhouse Management",
    slug: "greenhouse-management",
    category: "Hydroponics",
    level: "Intermediate",
    image: PHOTOS.sprouts,
    short_description: "Climate, crops and hygiene inside the greenhouse.",
    description:
      "Setup, ventilation, irrigation and crop management for tomatoes, capsicum and cucumbers under cover.",
    duration: "3 Days",
    mode: "Physical",
    location: "Nairobi",
    fee: 12000,
    outcomes: [
      "Control temperature and humidity",
      "Train and prune greenhouse crops",
      "Run efficient drip irrigation",
      "Prevent common greenhouse diseases",
    ],
    audience: "Greenhouse owners and workers",
    sessions: [session("s8", 46, 3, "Nairobi training farm", 12000, 20, 20)],
  },
  {
    id: "c7",
    name: "Urban Farming",
    slug: "urban-farming",
    category: "Vertical Farming",
    level: "Beginner",
    image: PHOTOS.raisedBeds,
    short_description: "Productive food gardens in limited city spaces.",
    description:
      "Raised beds, containers, sack gardens and simple hydroponics to grow food at home or on institutional grounds.",
    duration: "2 Days",
    mode: "Physical / Online",
    location: "Nairobi & Online",
    fee: 7000,
    outcomes: [
      "Plan a productive small garden",
      "Build raised beds and container gardens",
      "Grow a year-round vegetable supply",
      "Reuse kitchen waste as compost",
    ],
    audience: "City residents, youth groups and schools",
    sessions: [session("s9", 15, 2, "Online (Zoom)", 5000, 50, 31)],
  },
  {
    id: "c8",
    name: "Landscaping Essentials",
    slug: "landscaping-training",
    category: "Landscaping",
    level: "Beginner",
    image: PHOTOS.gardenPath,
    short_description: "Design, install and maintain beautiful outdoor spaces.",
    description:
      "Landscape design principles, plant selection, lawn establishment, irrigation and ongoing maintenance.",
    duration: "3 Days",
    mode: "Physical",
    location: "Nairobi",
    fee: 11000,
    outcomes: [
      "Sketch a simple landscape plan",
      "Choose plants for sun, shade and dry areas",
      "Establish and care for lawns",
      "Set up water-efficient irrigation",
    ],
    audience: "Gardeners, property managers and entrepreneurs",
    sessions: [session("s10", 22, 3, "Nairobi", 11000, 20, 11)],
  },
  {
    id: "c9",
    name: "Farm Business Management",
    slug: "farm-business-management",
    category: "Business",
    level: "Intermediate",
    image: PHOTOS.cropRows,
    short_description: "Plan, cost and run a profitable farm enterprise.",
    description:
      "Budgeting, record keeping, market research, pricing and accessing finance for farm businesses.",
    duration: "3 Days",
    mode: "Physical / Online",
    location: "Nairobi & Online",
    fee: 9500,
    outcomes: [
      "Prepare an enterprise budget",
      "Keep simple, useful farm records",
      "Find and negotiate with buyers",
      "Prepare for farm financing",
    ],
    audience: "Farmers, agripreneurs and cooperatives",
    sessions: [session("s11", 36, 3, "Online (Zoom)", 7500, 40, 26)],
  },
];

export const courseCategories = ["All", ...new Set(courses.map((c) => c.category))];

export const trainingHighlights = [
  { value: "70%", label: "Hands-on practice" },
  { value: "9", label: "Practical courses" },
  { value: "1,200+", label: "Farmers trained" },
  { value: "100%", label: "Certificate on completion" },
];
