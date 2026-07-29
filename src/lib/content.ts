/**
 * Canonical site content.
 *
 * This is the single source of truth for services and the curated gallery.
 * `prisma/seed.ts` loads it into the database, and `src/lib/data.ts` falls back
 * to it verbatim when no database is reachable — which is what keeps the public
 * site rendering on a fresh deploy before Postgres is attached.
 */

export type ServiceContent = {
  slug: string;
  name: string;
  blurb: string;
  description: string;
  category: "commercial" | "residential" | "specialty";
  icon: string;
  priceFrom: number | null;
  priceUnit: string;
  features: string[];
  featured: boolean;
  sortOrder: number;
};

export const services: ServiceContent[] = [
  {
    slug: "commercial-janitorial",
    name: "Commercial Janitorial",
    blurb: "Recurring cleaning for offices, clinics and storefronts.",
    description:
      "A standing crew on a schedule you set — nightly, weekly, or somewhere in between. We handle trash and recycling, restrooms, breakrooms, glass, high-touch disinfection, and vacuuming, then leave a checklist behind so you know exactly what was done. Every building gets a written scope so nothing is left to interpretation.",
    category: "commercial",
    icon: "building",
    priceFrom: null,
    priceUnit: "month",
    features: [
      "Written, per-building scope of work",
      "Nightly, weekly or custom frequency",
      "Restroom sanitation and restocking",
      "High-touch point disinfection",
      "Trash and recycling handling",
    ],
    featured: true,
    sortOrder: 10,
  },
  {
    slug: "carpet-extraction",
    name: "Carpet & Upholstery Extraction",
    blurb: "Hot-water extraction that pulls out what vacuuming leaves behind.",
    description:
      "We run commercial Kärcher extraction equipment — the same class of machine used in hotels and medical offices. Hot-water extraction lifts embedded soil, traffic lanes and odour out of carpet and fabric furniture rather than just moving it around. Most rooms are walkable within a few hours.",
    category: "specialty",
    icon: "droplet",
    priceFrom: 149,
    priceUnit: "visit",
    features: [
      "Commercial Kärcher extraction equipment",
      "Traffic-lane and spot pre-treatment",
      "Upholstery and cubicle panels",
      "Fast dry times",
    ],
    featured: true,
    sortOrder: 20,
  },
  {
    slug: "hard-floor-care",
    name: "Hard Floor Care",
    blurb: "Strip, wax, buff and burnish for VCT, tile and vinyl.",
    description:
      "Hard floors are the first thing people notice and the first thing to look tired. We strip old finish, deep-scrub grout, lay down fresh coats of commercial wax, and burnish to an even shine. We schedule around your hours so the floor is cured and open before you are.",
    category: "specialty",
    icon: "sparkle",
    priceFrom: null,
    priceUnit: "sqft",
    features: [
      "Strip and refinish VCT",
      "Grout deep-scrub",
      "Burnishing and buffing",
      "After-hours scheduling",
    ],
    featured: true,
    sortOrder: 30,
  },
  {
    slug: "deep-clean-disinfection",
    name: "Deep Cleaning & Disinfection",
    blurb: "A full reset when routine cleaning is not enough.",
    description:
      "Top-to-bottom detail work: vents, baseboards, light fixtures, door frames, inside appliances, behind and under furniture. We follow it with an EPA-registered disinfectant on high-touch surfaces. Common before an inspection, after an illness in the building, or when a space has been neglected.",
    category: "commercial",
    icon: "shield",
    priceFrom: null,
    priceUnit: "visit",
    features: [
      "Detail work top to bottom",
      "EPA-registered disinfectants",
      "Vents, fixtures and baseboards",
      "Inspection-ready finish",
    ],
    featured: false,
    sortOrder: 40,
  },
  {
    slug: "post-construction",
    name: "Post-Construction Cleanup",
    blurb: "From dusty jobsite to move-in ready.",
    description:
      "Construction dust gets everywhere and ordinary cleaning will not touch it. We do the rough clean, the final clean, and the touch-up before handover — sticker and adhesive removal, window and track detail, fixture polish, and a full HEPA pass so the dust does not resettle a week later.",
    category: "specialty",
    icon: "hammer",
    priceFrom: null,
    priceUnit: "sqft",
    features: [
      "Rough, final and touch-up phases",
      "Adhesive and sticker removal",
      "Window and track detail",
      "HEPA vacuuming",
    ],
    featured: false,
    sortOrder: 50,
  },
  {
    slug: "move-in-move-out",
    name: "Move-In / Move-Out",
    blurb: "Turnover cleaning for landlords, tenants and realtors.",
    description:
      "A complete turnover so the unit shows well and the deposit is not in question. Inside cabinets, drawers, appliances, closets, and every fixture — plus the details that walkthroughs actually catch: window tracks, switch plates, and the top of the fridge.",
    category: "residential",
    icon: "key",
    priceFrom: 220,
    priceUnit: "visit",
    features: [
      "Inside cabinets and appliances",
      "Full fixture and hardware detail",
      "Window tracks and sills",
      "Walkthrough-ready",
    ],
    featured: false,
    sortOrder: 60,
  },
  {
    slug: "residential-deep-clean",
    name: "Residential Deep Clean",
    blurb: "A one-time, top-to-bottom reset for your home.",
    description:
      "For homes we do deep cleans only — not weekly housekeeping. That means one thorough visit where we get into everything routine cleaning skips: inside and on top of cabinets, behind and under appliances, baseboards, door frames, vents, light fixtures, window sills and tracks, and a full detail of every kitchen and bathroom surface. It is the clean you book before guests arrive, after a renovation, at the change of a season, or when a house simply needs a reset.",
    category: "residential",
    icon: "home",
    priceFrom: 240,
    priceUnit: "visit",
    features: [
      "One-time deep clean, not recurring service",
      "Inside cabinets, appliances and fixtures",
      "Baseboards, vents and door frames",
      "Full kitchen and bathroom detail",
    ],
    featured: true,
    sortOrder: 70,
  },
  {
    slug: "window-glass",
    name: "Windows & Glass",
    blurb: "Streak-free interior glass, partitions and entryways.",
    description:
      "Entry glass and storefronts are the handshake of your building. We clean interior glass, partitions, display cases and door glass — including frames, tracks and hardware, which is what separates a clean window from a clean-looking one.",
    category: "commercial",
    icon: "window",
    priceFrom: null,
    priceUnit: "visit",
    features: [
      "Interior glass and partitions",
      "Storefront and entry doors",
      "Frames, tracks and hardware",
      "Display cases",
    ],
    featured: false,
    sortOrder: 80,
  },
];

export type GalleryContent = {
  id: string;
  filename: string;
  title: string;
  caption: string | null;
  category: string;
  width: number;
  height: number;
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

/** The five reviewed, presentable photos. The other 29 stay hidden. */
export const publishedGallery: GalleryContent[] = [
  {
    id: "461637326013455",
    filename: "461637326013455.jpg",
    title: "The valley we clean",
    caption: "Winter sunrise over the Champlain Valley.",
    category: "place",
    width: 2048,
    height: 1536,
    published: true,
    featured: true,
    sortOrder: 1,
  },
  {
    id: "200283565445155",
    filename: "200283565445155.jpg",
    title: "Hardwood floor care",
    caption: "Working a hardwood floor back to an even finish.",
    category: "work",
    width: 720,
    height: 960,
    published: true,
    featured: true,
    sortOrder: 2,
  },
  {
    id: "142309651242547",
    filename: "142309651242547.jpg",
    title: "Restroom after service",
    caption: "Fixtures, mirrors and floor after a full restroom clean.",
    category: "work",
    width: 960,
    height: 720,
    published: true,
    featured: true,
    sortOrder: 3,
  },
  {
    id: "543559001154620",
    filename: "543559001154620.jpg",
    title: "Commercial extraction equipment",
    caption: "Our Kärcher Professional carpet extractor.",
    category: "equipment",
    width: 2048,
    height: 1996,
    published: true,
    featured: false,
    sortOrder: 4,
  },
  {
    id: "142314551242057",
    filename: "142314551242057.jpg",
    title: "Light fixture detail",
    caption: "Fixtures pulled and cleaned as part of a deep clean.",
    category: "work",
    width: 960,
    height: 720,
    published: true,
    featured: false,
    sortOrder: 5,
  },
];
