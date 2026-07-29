import "server-only";

import { publishedGallery, services as staticServices } from "@/lib/content";
import { withDatabase } from "@/lib/data";
import { site } from "@/lib/site";

const fallbackDate = new Date("2026-01-01T00:00:00.000Z");

const serviceRows = staticServices.map((s) => ({
  id: s.slug,
  ...s,
  features: JSON.stringify(s.features),
  active: true,
  createdAt: fallbackDate,
  updatedAt: fallbackDate,
}));

const galleryRows = publishedGallery.map((g) => ({
  ...g,
  sourceUrl: `https://www.facebook.com/photo/?fbid=${g.id}`,
  createdAt: fallbackDate,
  updatedAt: fallbackDate,
}));

const settingsRows = [
  {
    key: "general.name",
    value: site.name,
    label: "Business name",
    group: "general",
    type: "text",
    updatedAt: fallbackDate,
  },
  {
    key: "contact.phone",
    value: site.phone,
    label: "Phone number",
    group: "contact",
    type: "text",
    updatedAt: fallbackDate,
  },
  {
    key: "contact.email",
    value: site.email,
    label: "Email address",
    group: "contact",
    type: "text",
    updatedAt: fallbackDate,
  },
  {
    key: "seo.title",
    value: `${site.name} - Commercial & Residential Cleaning in Vermont`,
    label: "SEO title",
    group: "seo",
    type: "text",
    updatedAt: fallbackDate,
  },
];

export async function getAdminNewLeadCount() {
  return withDatabase(
    (prisma) => prisma.lead.count({ where: { status: "new" } }),
    0,
  );
}

export async function getAdminDashboardData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 864e5);

  return withDatabase(
    async (prisma) => {
      const [
        totalLeads,
        newLeads,
        wonLeads,
        recentLeads,
        upcomingBookings,
        publishedPhotos,
        totalPhotos,
        activeServices,
        quotedSum,
        leadsLast30,
      ] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: "new" } }),
        prisma.lead.count({ where: { status: "won" } }),
        prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
        prisma.booking.findMany({
          where: { scheduledFor: { gte: now }, status: { not: "cancelled" } },
          orderBy: { scheduledFor: "asc" },
          take: 5,
          include: { service: { select: { name: true } } },
        }),
        prisma.galleryItem.count({ where: { published: true } }),
        prisma.galleryItem.count(),
        prisma.service.count({ where: { active: true } }),
        prisma.lead.aggregate({
          _sum: { quotedAmount: true },
          where: { status: "won" },
        }),
        prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      ]);

      return {
        totalLeads,
        newLeads,
        wonLeads,
        recentLeads,
        upcomingBookings,
        publishedPhotos,
        totalPhotos,
        activeServices,
        quotedAmountWon: quotedSum._sum.quotedAmount ?? 0,
        leadsLast30,
      };
    },
    {
      totalLeads: 0,
      newLeads: 0,
      wonLeads: 0,
      recentLeads: [],
      upcomingBookings: [],
      publishedPhotos: galleryRows.filter((g) => g.published).length,
      totalPhotos: galleryRows.length,
      activeServices: serviceRows.filter((s) => s.active).length,
      quotedAmountWon: 0,
      leadsLast30: 0,
    },
  );
}

export async function getAdminLeads(status: string) {
  return withDatabase(
    async (prisma) => {
      const [leads, counts] = await Promise.all([
        prisma.lead.findMany({
          where: status !== "all" ? { status } : undefined,
          orderBy: { createdAt: "desc" },
          take: 200,
        }),
        prisma.lead.groupBy({ by: ["status"], _count: true }),
      ]);

      return { leads, counts };
    },
    { leads: [], counts: [] },
  );
}

export async function getAdminLead(id: string) {
  return withDatabase(
    (prisma) =>
      prisma.lead.findUnique({
        where: { id },
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
            include: { author: { select: { name: true } } },
          },
        },
      }),
    null,
  );
}

export async function getAdminLeadMeta(id: string) {
  return withDatabase(
    (prisma) => prisma.lead.findUnique({ where: { id }, select: { name: true } }),
    null,
  );
}

export async function getAdminServices() {
  return withDatabase(
    (prisma) =>
      prisma.service.findMany({
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      }),
    [...serviceRows].sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder,
    ),
  );
}

export async function getAdminService(id: string) {
  return withDatabase(
    (prisma) => prisma.service.findUnique({ where: { id } }),
    serviceRows.find((s) => s.id === id || s.slug === id) ?? null,
  );
}

export async function getAdminBookings() {
  const now = new Date();

  return withDatabase(
    async (prisma) => {
      const [upcoming, past, services] = await Promise.all([
        prisma.booking.findMany({
          where: { scheduledFor: { gte: now } },
          orderBy: { scheduledFor: "asc" },
          include: { service: { select: { name: true } } },
        }),
        prisma.booking.findMany({
          where: { scheduledFor: { lt: now } },
          orderBy: { scheduledFor: "desc" },
          take: 25,
          include: { service: { select: { name: true } } },
        }),
        prisma.service.findMany({
          where: { active: true },
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true },
        }),
      ]);

      return { upcoming, past, services };
    },
    {
      upcoming: [],
      past: [],
      services: serviceRows.map((s) => ({ id: s.id, name: s.name })),
    },
  );
}

export async function getAdminGallery(filter: string) {
  const fallbackItems =
    filter === "published"
      ? galleryRows.filter((g) => g.published)
      : filter === "hidden"
        ? galleryRows.filter((g) => !g.published)
        : galleryRows;

  return withDatabase(
    async (prisma) => {
      const where =
        filter === "published"
          ? { published: true }
          : filter === "hidden"
            ? { published: false }
            : undefined;

      const [items, total, published] = await Promise.all([
        prisma.galleryItem.findMany({
          where,
          orderBy: [{ published: "desc" }, { sortOrder: "asc" }],
        }),
        prisma.galleryItem.count(),
        prisma.galleryItem.count({ where: { published: true } }),
      ]);

      return { items, total, published };
    },
    {
      items: fallbackItems,
      total: galleryRows.length,
      published: galleryRows.filter((g) => g.published).length,
    },
  );
}

export async function getAdminTestimonials() {
  return withDatabase(
    (prisma) =>
      prisma.testimonial.findMany({
        orderBy: [{ published: "desc" }, { sortOrder: "asc" }],
      }),
    [],
  );
}

export async function getAdminSettings() {
  return withDatabase(
    async (prisma) => {
      const [settings, sampleCount] = await Promise.all([
        prisma.siteSetting.findMany({ orderBy: { key: "asc" } }),
        prisma.lead.count({ where: { source: "sample" } }),
      ]);

      return { settings, sampleCount };
    },
    { settings: settingsRows, sampleCount: 0 },
  );
}
