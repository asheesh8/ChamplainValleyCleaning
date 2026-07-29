import "server-only";

import { publishedGallery, services as staticServices } from "@/lib/content";

/**
 * Database-optional reads.
 *
 * The public site must never 500 because the database is missing or asleep —
 * a marketing page going dark loses customers. Every read here tries Prisma
 * first and falls back to the static content in `content.ts`.
 *
 * `dbAvailable()` lets the admin tell the difference and say so plainly,
 * rather than silently showing stale content in a CRUD screen.
 */

async function safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[data] falling back to static content:", err);
    }
    return fallback;
  }
}

export function isDatabaseConfigured(): boolean {
  return process.env.NODE_ENV !== "production" || Boolean(process.env.DATABASE_URL);
}

async function getPrisma() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const { prisma } = await import("@/lib/db");
  return prisma;
}

export async function dbAvailable(): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;

  try {
    const prisma = await getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

const toRow = (s: (typeof staticServices)[number]) => ({
  id: s.slug,
  ...s,
  features: JSON.stringify(s.features),
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export async function getActiveServices() {
  return safe(
    async () => {
      const prisma = await getPrisma();
      return prisma.service.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      });
    },
    staticServices.map(toRow),
  );
}

export async function getFeaturedServices(take = 4) {
  return safe(
    async () => {
      const prisma = await getPrisma();
      return prisma.service.findMany({
        where: { active: true, featured: true },
        orderBy: { sortOrder: "asc" },
        take,
      });
    },
    staticServices.filter((s) => s.featured).slice(0, take).map(toRow),
  );
}

export async function getServiceOptions() {
  return safe(
    async () => {
      const prisma = await getPrisma();
      return prisma.service.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        select: { slug: true, name: true },
      });
    },
    staticServices.map((s) => ({ slug: s.slug, name: s.name })),
  );
}

export async function getPublishedGallery(take?: number) {
  const fallback = take ? publishedGallery.slice(0, take) : publishedGallery;

  return safe(
    async () => {
      const prisma = await getPrisma();
      return prisma.galleryItem.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
        ...(take ? { take } : {}),
      });
    },
    fallback.map((g) => ({
      ...g,
      sourceUrl: `https://www.facebook.com/photo/?fbid=${g.id}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );
}

/** Only ever returns genuinely published reviews — never the placeholders. */
export async function getPublishedTestimonials(take = 3) {
  return safe(
    async () => {
      const prisma = await getPrisma();
      return prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        take,
      });
    },
    [],
  );
}

export async function getPlacePhoto() {
  const all = await getPublishedGallery();
  return all.find((p) => p.category === "place") ?? all[0] ?? null;
}
