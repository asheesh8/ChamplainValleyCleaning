import { z } from "zod";

export const leadStatuses = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
] as const;
export const bookingStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export const serviceCategories = [
  "commercial",
  "residential",
  "specialty",
] as const;
export const galleryCategories = [
  "work",
  "equipment",
  "team",
  "place",
] as const;

/** Public quote form. Deliberately forgiving — a lost lead is worse than a messy one. */
export const leadCreateSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  propertyType: z.enum(["commercial", "residential"]).default("commercial"),
  serviceSlug: z.string().trim().max(80).optional().or(z.literal("")),
  squareFeet: z.coerce.number().int().positive().max(1_000_000).optional(),
  frequency: z
    .enum(["one-time", "weekly", "biweekly", "monthly"])
    .optional()
    .or(z.literal("")),
  preferredDate: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  source: z.string().trim().max(40).default("website"),
  /** Honeypot — real users never fill this. */
  website: z.string().max(0).optional(),
});

export const leadUpdateSchema = z.object({
  status: z.enum(leadStatuses).optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
  quotedAmount: z.coerce.number().int().min(0).nullable().optional(),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  name: z.string().trim().min(2).max(120),
  blurb: z.string().trim().min(2).max(240),
  description: z.string().trim().min(2).max(4000),
  category: z.enum(serviceCategories).default("commercial"),
  icon: z.string().trim().max(40).default("sparkle"),
  priceFrom: z.coerce.number().int().min(0).nullable().optional(),
  priceUnit: z.enum(["visit", "hour", "sqft", "month"]).default("visit"),
  features: z.array(z.string().trim().max(200)).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const testimonialSchema = z.object({
  author: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  quote: z.string().trim().min(4).max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  published: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const bookingSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  email: z.email().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  serviceId: z.string().trim().max(40).nullable().optional(),
  leadId: z.string().trim().max(40).nullable().optional(),
  scheduledFor: z.coerce.date(),
  durationMin: z.coerce.number().int().min(15).max(1440).default(120),
  status: z.enum(bookingStatuses).default("pending"),
  price: z.coerce.number().int().min(0).nullable().optional(),
  crew: z.string().trim().max(160).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const galleryUpdateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  caption: z.string().trim().max(600).nullable().optional(),
  category: z.enum(galleryCategories).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
