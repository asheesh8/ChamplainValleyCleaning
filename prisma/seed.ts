import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

const services = [
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
      "Hard floors are the first thing people notice and the first thing to look tired. We strip old finish, deep-scrub grout, lay down fresh coats of commercial wax, and burnish to a even shine. We schedule around your hours so the floor is cured and open before you are.",
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

// ---------------------------------------------------------------------------
// Gallery
//
// All 34 photos scraped from the client's Facebook page are imported so the
// owner can see the whole library in the admin. Only images that were actually
// reviewed and are presentable are published by default — the rest stay hidden
// until someone looks at them and decides. `note` is admin-only context.
// ---------------------------------------------------------------------------

type GallerySeed = {
  id: string;
  w: number;
  h: number;
  title: string;
  caption?: string;
  category: string;
  published?: boolean;
  featured?: boolean;
  sortOrder?: number;
};

const gallery: GallerySeed[] = [
  // --- Reviewed and approved -------------------------------------------------
  {
    id: "461637326013455",
    w: 2048,
    h: 1536,
    title: "The valley we clean",
    caption: "Winter sunrise over the Champlain Valley.",
    category: "place",
    published: true,
    featured: true,
    sortOrder: 1,
  },
  {
    id: "200283565445155",
    w: 720,
    h: 960,
    title: "Hardwood floor care",
    caption: "Working a hardwood floor back to an even finish.",
    category: "work",
    published: true,
    featured: true,
    sortOrder: 2,
  },
  {
    id: "142309651242547",
    w: 960,
    h: 720,
    title: "Restroom after service",
    caption: "Fixtures, mirrors and floor after a full restroom clean.",
    category: "work",
    published: true,
    featured: true,
    sortOrder: 3,
  },
  {
    id: "543559001154620",
    w: 2048,
    h: 1996,
    title: "Commercial extraction equipment",
    caption: "Our Kärcher Professional carpet extractor.",
    category: "equipment",
    published: true,
    sortOrder: 4,
  },
  {
    id: "142314551242057",
    w: 960,
    h: 720,
    title: "Light fixture detail",
    caption: "Fixtures pulled and cleaned as part of a deep clean.",
    category: "work",
    published: true,
    sortOrder: 5,
  },

  // --- Imported, hidden pending review ---------------------------------------
  { id: "111031341037045", w: 2048, h: 1536, title: "Valley view (duplicate)", category: "place" },
  { id: "461637322680122", w: 1575, h: 423, title: "Facebook cover banner", category: "place" },
  { id: "111004804373032", w: 1575, h: 423, title: "Facebook cover banner (older)", category: "place" },
  { id: "110967731043406", w: 1290, h: 1290, title: "Facebook placeholder avatar", category: "place" },
  { id: "1071296988380816", w: 807, h: 423, title: "Facebook post graphic", category: "place" },
  { id: "1081887993988382", w: 1536, h: 2048, title: "Toner cartridge disposal", category: "work" },
  { id: "142309744575871", w: 720, h: 960, title: "Restroom before service", category: "work" },
  { id: "543558977821289", w: 2048, h: 1838, title: "Equipment photo", category: "equipment" },
  { id: "543558961154624", w: 1536, h: 2048, title: "Equipment photo", category: "equipment" },
  { id: "200283548778490", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "200283042111874", w: 444, h: 960, title: "Job photo", category: "work" },
  { id: "181883970618448", w: 792, h: 960, title: "Job photo", category: "work" },
  { id: "181879940618851", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "111768687629977", w: 960, h: 720, title: "Job photo", category: "work" },
  { id: "142309487909230", w: 892, h: 960, title: "Job photo", category: "work" },
  { id: "142309497909229", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142309531242559", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142309584575887", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142309594575886", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142309637909215", w: 960, h: 720, title: "Job photo", category: "work" },
  { id: "142309697909209", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142309714575874", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142314464575399", w: 960, h: 720, title: "Job photo", category: "work" },
  { id: "142314481242064", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142314517908727", w: 960, h: 720, title: "Job photo", category: "work" },
  { id: "142314524575393", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142314547908724", w: 720, h: 960, title: "Job photo", category: "work" },
  { id: "142314597908719", w: 960, h: 720, title: "Job photo", category: "work" },
  { id: "142314607908718", w: 720, h: 960, title: "Job photo", category: "work" },
];

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

const settings = [
  { key: "hero.eyebrow", value: "Chittenden County, Vermont", label: "Hero eyebrow", group: "hero", type: "text" },
  { key: "hero.headline", value: "A cleaning crew that sweats the details", label: "Hero headline", group: "hero", type: "text" },
  {
    key: "hero.subhead",
    value:
      "Commercial and residential cleaning across the Champlain Valley. Written scopes, consistent crews, and work you can actually inspect.",
    label: "Hero subhead",
    group: "hero",
    type: "textarea",
  },
  { key: "hero.ctaPrimary", value: "Get a free quote", label: "Primary button", group: "hero", type: "text" },
  { key: "contact.phone", value: "(802) 777-3824", label: "Phone number", group: "contact", type: "text" },
  { key: "contact.email", value: "champlainvalleycleaning@gmail.com", label: "Email address", group: "contact", type: "text" },
  { key: "contact.responseTime", value: "24 hours", label: "Quoted response time", group: "contact", type: "text" },
  { key: "seo.title", value: "Champlain Valley Cleaning — Commercial & Residential Cleaning in Vermont", label: "SEO title", group: "seo", type: "text" },
  {
    key: "seo.description",
    value:
      "Commercial janitorial, carpet extraction, floor care and residential cleaning across Burlington and the Champlain Valley. Free quotes, written scopes, insured crews.",
    label: "SEO description",
    group: "seo",
    type: "textarea",
  },
  { key: "general.acceptingWork", value: "true", label: "Accepting new clients", group: "general", type: "boolean" },
  { key: "general.serviceRadius", value: "35", label: "Service radius (miles)", group: "general", type: "number" },
];

// ---------------------------------------------------------------------------

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "owner@champlainvalleycleaning.com";
  const placeholderPassword = "admin-login-disabled";

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "CVC Owner",
      passwordHash: hashPassword(placeholderPassword),
      role: "owner",
    },
  });
  console.log(`✓ admin user  ${admin.email}`);

  for (const s of services) {
    const { features, ...rest } = s;
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...rest, features: JSON.stringify(features) },
      create: { ...rest, features: JSON.stringify(features) },
    });
  }
  console.log(`✓ services    ${services.length}`);

  for (const g of gallery) {
    const filename = `${g.id}.jpg`;
    await prisma.galleryItem.upsert({
      where: { filename },
      update: {},
      create: {
        filename,
        title: g.title,
        caption: g.caption ?? null,
        category: g.category,
        width: g.w,
        height: g.h,
        published: g.published ?? false,
        featured: g.featured ?? false,
        sortOrder: g.sortOrder ?? 100,
        sourceUrl: `https://www.facebook.com/photo/?fbid=${g.id}`,
      },
    });
  }
  const publishedCount = gallery.filter((g) => g.published).length;
  console.log(`✓ gallery     ${gallery.length} imported, ${publishedCount} published`);

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { label: s.label, group: s.group, type: s.type },
      create: s,
    });
  }
  console.log(`✓ settings    ${settings.length}`);

  // Placeholder testimonials. Left UNPUBLISHED on purpose — these are not real
  // customer quotes and must never render on the public site. Replace the text
  // with genuine reviews in the admin, then publish.
  const placeholders = [
    { author: "Placeholder — replace with a real review", role: "Property manager", location: "Burlington, VT" },
    { author: "Placeholder — replace with a real review", role: "Office manager", location: "South Burlington, VT" },
    { author: "Placeholder — replace with a real review", role: "Homeowner", location: "Essex Junction, VT" },
  ];
  for (const [i, p] of placeholders.entries()) {
    await prisma.testimonial.upsert({
      where: { id: `placeholder-${i + 1}` },
      update: {},
      create: {
        id: `placeholder-${i + 1}`,
        author: p.author,
        role: p.role,
        location: p.location,
        quote:
          "Paste a genuine customer review here, then set this entry to Published. Nothing in this record is real.",
        rating: 5,
        published: false,
        sortOrder: i,
      },
    });
  }
  console.log(`✓ testimonials ${placeholders.length} unpublished placeholders`);

  // Demo leads so the dashboard is not empty on first run. Tagged source
  // "sample" so they can be purged in one click from Admin → Settings.
  const sampleLeads = [
    { name: "Dana Whitcomb", email: "dana@example.com", phone: "(802) 555-0148", company: "Whitcomb Dental", propertyType: "commercial", serviceSlug: "commercial-janitorial", squareFeet: 3200, frequency: "weekly", status: "new", priority: "high", message: "Two-suite dental office, looking for nightly cleaning starting next month." },
    { name: "Marcus Feld", email: "marcus@example.com", phone: "(802) 555-0192", company: null, propertyType: "residential", serviceSlug: "residential-deep-clean", squareFeet: 1800, frequency: "one-time", status: "contacted", priority: "normal", message: "Three bed two bath in Winooski, hasn't had a proper clean in over a year." },
    { name: "Priya Raman", email: "priya@example.com", phone: null, company: "Northgate Properties", propertyType: "commercial", serviceSlug: "move-in-move-out", squareFeet: 950, frequency: "one-time", status: "quoted", priority: "normal", quotedAmount: 340, message: "Turnover on a one-bedroom unit, needs to be done before the 30th." },
    { name: "Sam Ouellette", email: "sam@example.com", phone: "(802) 555-0113", company: "Lakeview Cafe", propertyType: "commercial", serviceSlug: "hard-floor-care", squareFeet: 1400, frequency: "one-time", status: "won", priority: "normal", quotedAmount: 780, message: "VCT in the dining room needs stripping and re-waxing." },
  ];

  for (const lead of sampleLeads) {
    const exists = await prisma.lead.findFirst({ where: { email: lead.email, source: "sample" } });
    if (!exists) {
      await prisma.lead.create({ data: { ...lead, source: "sample" } });
    }
  }
  console.log(`✓ leads       ${sampleLeads.length} sample records (source="sample")`);

  console.log("\nAdmin preview is open at /admin — no login required.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
