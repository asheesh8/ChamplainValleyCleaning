"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import {
  bookingSchema,
  galleryUpdateSchema,
  leadUpdateSchema,
  loginSchema,
  serviceSchema,
  testimonialSchema,
} from "@/lib/validation";

export type ActionState = { error?: string; ok?: boolean };

// ---------------------------------------------------------------- auth

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
  });

  // Same message either way so the form can't be used to enumerate accounts.
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return { error: "Those credentials don't match an account." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- leads

export async function updateLeadAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));

  const raw = {
    status: formData.get("status") || undefined,
    priority: formData.get("priority") || undefined,
    quotedAmount: formData.get("quotedAmount") || undefined,
  };

  const parsed = leadUpdateSchema.safeParse(raw);
  if (!parsed.success) return;

  const data = { ...parsed.data };
  if (raw.quotedAmount === "" || raw.quotedAmount === undefined) {
    delete data.quotedAmount;
  }

  await prisma.lead.update({ where: { id }, data });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function addLeadNoteAction(formData: FormData) {
  const user = await requireUser();
  const leadId = String(formData.get("leadId"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.leadNote.create({
    data: { leadId, body, authorId: user.id },
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLeadAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads");
}

// ---------------------------------------------------------------- services

function servicePayload(formData: FormData) {
  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const priceRaw = String(formData.get("priceFrom") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    blurb: String(formData.get("blurb") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "commercial"),
    icon: String(formData.get("icon") ?? "sparkle"),
    priceFrom: priceRaw === "" ? null : Number(priceRaw),
    priceUnit: String(formData.get("priceUnit") ?? "visit"),
    features,
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function saveServiceAction(formData: FormData) {
  await requireUser();
  const id = formData.get("id") ? String(formData.get("id")) : null;

  const parsed = serviceSchema.safeParse(servicePayload(formData));
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    );
  }

  const { features, ...rest } = parsed.data;
  const data = { ...rest, features: JSON.stringify(features) };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteServiceAction(formData: FormData) {
  await requireUser();
  await prisma.service.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function toggleServiceActiveAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return;

  await prisma.service.update({
    where: { id },
    data: { active: !service.active },
  });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

// ---------------------------------------------------------------- gallery

export async function updateGalleryItemAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));

  const parsed = galleryUpdateSchema.safeParse({
    title: formData.get("title") ?? undefined,
    caption: formData.get("caption") ?? undefined,
    category: formData.get("category") ?? undefined,
    sortOrder: formData.get("sortOrder") ?? undefined,
  });
  if (!parsed.success) return;

  await prisma.galleryItem.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function toggleGalleryFlagAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  const flag = String(formData.get("flag")) as "published" | "featured";
  if (flag !== "published" && flag !== "featured") return;

  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return;

  await prisma.galleryItem.update({
    where: { id },
    data: { [flag]: !item[flag] },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItemAction(formData: FormData) {
  await requireUser();
  await prisma.galleryItem.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

// ---------------------------------------------------------------- testimonials

export async function saveTestimonialAction(formData: FormData) {
  await requireUser();
  const id = formData.get("id") ? String(formData.get("id")) : null;

  const parsed = testimonialSchema.safeParse({
    author: String(formData.get("author") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    quote: String(formData.get("quote") ?? "").trim(),
    rating: Number(formData.get("rating") ?? 5),
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join("; "));
  }

  if (id) {
    await prisma.testimonial.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.testimonial.create({ data: parsed.data });
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireUser();
  await prisma.testimonial.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

// ---------------------------------------------------------------- bookings

export async function saveBookingAction(formData: FormData) {
  await requireUser();
  const id = formData.get("id") ? String(formData.get("id")) : null;

  const parsed = bookingSchema.safeParse({
    customerName: String(formData.get("customerName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    serviceId: formData.get("serviceId") || null,
    scheduledFor: String(formData.get("scheduledFor") ?? ""),
    durationMin: Number(formData.get("durationMin") ?? 120),
    status: String(formData.get("status") ?? "pending"),
    price: String(formData.get("price") ?? "").trim() || null,
    crew: String(formData.get("crew") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const d = parsed.data;
  const data = {
    customerName: d.customerName,
    email: d.email || null,
    phone: d.phone || null,
    address: d.address || null,
    serviceId: d.serviceId || null,
    scheduledFor: d.scheduledFor,
    durationMin: d.durationMin,
    status: d.status,
    price: d.price ?? null,
    crew: d.crew || null,
    notes: d.notes || null,
  };

  if (id) {
    await prisma.booking.update({ where: { id }, data });
  } else {
    await prisma.booking.create({ data });
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function deleteBookingAction(formData: FormData) {
  await requireUser();
  await prisma.booking.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

// ---------------------------------------------------------------- settings

export async function saveSettingsAction(formData: FormData) {
  await requireUser();

  const entries = Array.from(formData.entries()).filter(([k]) =>
    k.startsWith("setting:"),
  );

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteSetting.update({
        where: { key: key.replace("setting:", "") },
        data: { value: String(value) },
      }),
    ),
  );

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

/** Removes the demo leads seeded on first run. */
export async function purgeSampleDataAction() {
  await requireUser();
  await prisma.lead.deleteMany({ where: { source: "sample" } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
