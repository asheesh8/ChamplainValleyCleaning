import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/admin/ui";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import {
  addLeadNoteAction,
  deleteLeadAction,
  updateLeadAction,
} from "@/app/admin/actions";
import { prisma } from "@/lib/db";
import { leadStatuses } from "@/lib/validation";
import { formatDateTime, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  return { title: lead ? `${lead.name} — Lead` : "Lead" };
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!lead) notFound();

  const detail: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${lead.email}`} className="text-lake-700 hover:underline dark:text-lake-300">{lead.email}</a>],
    ["Phone", lead.phone ? <a key="p" href={`tel:${lead.phone}`} className="text-lake-700 hover:underline dark:text-lake-300">{lead.phone}</a> : "—"],
    ["Business", lead.company || "—"],
    ["Property", <span key="pt" className="capitalize">{lead.propertyType}</span>],
    ["Service", lead.serviceSlug || "—"],
    ["Square feet", lead.squareFeet ? lead.squareFeet.toLocaleString() : "—"],
    ["Frequency", lead.frequency || "—"],
    ["Ideal start", lead.preferredDate || "—"],
    ["Source", <span key="s" className="capitalize">{lead.source}</span>],
    ["Received", formatDateTime(lead.createdAt)],
  ];

  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <Icon name="arrow" className="size-4 rotate-180" />
        All leads
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              {lead.name}
            </h1>
            <Badge tone={statusTone[lead.status] ?? "neutral"}>{lead.status}</Badge>
            {lead.priority === "high" && <Badge tone="danger">high priority</Badge>}
            {lead.source === "sample" && <Badge tone="neutral">sample data</Badge>}
          </div>
          <p className="mt-1.5 text-sm text-text-muted">
            {lead.company ? `${lead.company} · ` : ""}
            Received {relativeTime(lead.createdAt)}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={`mailto:${lead.email}`}
            className="inline-flex h-9 items-center gap-2 rounded-field bg-lake-700 px-3 text-sm font-medium text-white transition-colors hover:bg-lake-800 dark:bg-lake-400 dark:text-lake-950"
          >
            <Icon name="mail" className="size-4" />
            Reply
          </a>
          <form action={deleteLeadAction}>
            <input type="hidden" name="id" value={lead.id} />
            <Button type="submit" variant="secondary" size="sm">
              <Icon name="trash" className="size-4" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="Request details">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-2">
              {detail.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-text">{value}</dd>
                </div>
              ))}
            </dl>

            {lead.message && (
              <div className="border-t border-border-base px-5 py-5">
                <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                  Message
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-muted">
                  {lead.message}
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Activity" description="Internal notes — never shown to the customer.">
            <form action={addLeadNoteAction} className="border-b border-border-base px-5 py-4">
              <input type="hidden" name="leadId" value={lead.id} />
              <Label htmlFor="body">Add a note</Label>
              <Textarea
                id="body"
                name="body"
                required
                placeholder="Called and left a voicemail. Walkthrough booked for Thursday…"
                className="min-h-20"
              />
              <Button type="submit" size="sm" className="mt-3">
                Save note
              </Button>
            </form>

            {lead.notes.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-text-subtle">
                No notes yet.
              </p>
            ) : (
              <ul className="divide-y divide-border-base">
                {lead.notes.map((note) => (
                  <li key={note.id} className="px-5 py-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-text">
                      {note.body}
                    </p>
                    <p className="mt-1.5 text-xs text-text-subtle">
                      {note.author?.name ?? "Someone"} ·{" "}
                      {formatDateTime(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Update">
          <form action={updateLeadAction} className="space-y-4 px-5 py-5">
            <input type="hidden" name="id" value={lead.id} />

            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={lead.status}>
                {leadStatuses.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" name="priority" defaultValue={lead.priority}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="quotedAmount" hint="whole dollars">
                Quoted amount
              </Label>
              <Input
                id="quotedAmount"
                name="quotedAmount"
                type="number"
                min={0}
                defaultValue={lead.quotedAmount ?? ""}
                placeholder="e.g. 780"
              />
            </div>

            <Button type="submit" className="w-full">
              Save changes
            </Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
