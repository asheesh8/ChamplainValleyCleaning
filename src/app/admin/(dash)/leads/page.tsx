import Link from "next/link";
import { PageHeader, Panel, EmptyState, Th, Td } from "@/components/admin/ui";
import { Badge, statusTone } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { leadStatuses } from "@/lib/validation";
import { formatCurrency, relativeTime, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({
      where: status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (s: string) =>
    s === "all"
      ? counts.reduce((n, c) => n + c._count, 0)
      : (counts.find((c) => c.status === s)?._count ?? 0);

  const filters = ["all", ...leadStatuses];

  return (
    <>
      <PageHeader
        title="Leads"
        description="Quote requests from the website, the chat widget and anywhere else you log them."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/leads" : `/admin/leads?status=${f}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
              status === f
                ? "bg-lake-700 text-white dark:bg-lake-400 dark:text-lake-950"
                : "bg-surface text-text-muted ring-1 ring-border-strong hover:text-text",
            )}
          >
            {f}
            <span
              className={cn(
                "ml-1.5",
                status === f ? "text-white/70 dark:text-lake-950/60" : "text-text-subtle",
              )}
            >
              {countFor(f)}
            </span>
          </Link>
        ))}
      </div>

      <Panel>
        {leads.length === 0 ? (
          <EmptyState
            title="No leads here"
            body={
              status === "all"
                ? "When someone submits the quote form it will appear in this list."
                : `No leads with status “${status}”.`
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead className="border-b border-border-base">
                <tr>
                  <Th>Contact</Th>
                  <Th>Service</Th>
                  <Th>Property</Th>
                  <Th>Quoted</Th>
                  <Th>Received</Th>
                  <Th className="text-right">Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition-colors hover:bg-surface-2"
                  >
                    <Td>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="flex items-center gap-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-text-muted">
                          {lead.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate font-medium text-text">
                              {lead.name}
                            </span>
                            {lead.priority === "high" && (
                              <Badge tone="danger">high</Badge>
                            )}
                            {lead.source === "sample" && (
                              <Badge tone="neutral">sample</Badge>
                            )}
                          </span>
                          <span className="block truncate text-xs text-text-subtle">
                            {lead.company ? `${lead.company} · ` : ""}
                            {lead.email}
                          </span>
                        </span>
                      </Link>
                    </Td>
                    <Td className="text-text-muted">
                      {lead.serviceSlug ?? <span className="text-text-subtle">—</span>}
                    </Td>
                    <Td className="capitalize text-text-muted">
                      {lead.propertyType}
                      {lead.squareFeet && (
                        <span className="block text-xs text-text-subtle">
                          {lead.squareFeet.toLocaleString()} sq ft
                        </span>
                      )}
                    </Td>
                    <Td className="tabular-nums text-text-muted">
                      {lead.quotedAmount != null
                        ? formatCurrency(lead.quotedAmount)
                        : "—"}
                    </Td>
                    <Td className="whitespace-nowrap text-text-subtle">
                      {relativeTime(lead.createdAt)}
                    </Td>
                    <Td className="text-right">
                      <Badge tone={statusTone[lead.status] ?? "neutral"}>
                        {lead.status}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
