import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseConfigured } from "@/lib/data";
import { leadCreateSchema } from "@/lib/validation";

const databaseUnavailable = () =>
  NextResponse.json(
    {
      error:
        "Online quote requests are temporarily unavailable. Please call or email us directly.",
    },
    { status: 503 },
  );

/** Public: submit a quote request. */
export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fields: Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
            k,
            v?.[0] ?? "Invalid",
          ]),
        ),
      },
      { status: 422 },
    );
  }

  const { website, ...data } = parsed.data;

  // Honeypot: a bot filled the hidden field. Return success so it doesn't retry.
  if (website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const empty = (v: string | undefined) => (v === "" ? null : (v ?? null));

  if (!isDatabaseConfigured()) return databaseUnavailable();

  let lead: { id: string; createdAt: Date };
  try {
    const { prisma } = await import("@/lib/db");
    lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: empty(data.phone),
        company: empty(data.company),
        propertyType: data.propertyType,
        serviceSlug: empty(data.serviceSlug),
        squareFeet: data.squareFeet ?? null,
        frequency: empty(data.frequency),
        preferredDate: empty(data.preferredDate),
        message: empty(data.message),
        source: data.source || "website",
      },
      select: { id: true, createdAt: true },
    });
  } catch (err) {
    console.error("[leads] failed to create lead", err);
    return databaseUnavailable();
  }

  // TODO(notify): send the owner an email/SMS here. Nothing is wired to an
  // outbound provider yet — leads live in the database and the admin inbox.

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}

/** Admin: list leads, newest first. */
export async function GET(req: NextRequest) {
  if (!isDatabaseConfigured()) return databaseUnavailable();

  try {
    const [{ getCurrentUser }, { prisma }] = await Promise.all([
      import("@/lib/auth"),
      import("@/lib/db"),
    ]);

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get("status");
    const leads = await prisma.lead.findMany({
      where: status && status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ leads });
  } catch (err) {
    console.error("[leads] failed to list leads", err);
    return databaseUnavailable();
  }
}
