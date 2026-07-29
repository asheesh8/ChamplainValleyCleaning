import Link from "next/link";
import { PageHeader, Panel, StatCard, EmptyState, Th, Td } from "@/components/admin/ui";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { getAdminDashboardData } from "@/lib/admin-data";
import { formatCurrency, formatDate, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const {
    totalLeads,
    newLeads,
    wonLeads,
    recentLeads,
    upcomingBookings,
    publishedPhotos,
    totalPhotos,
    activeServices,
    quotedAmountWon,
    leadsLast30,
  } = await getAdminDashboardData();

  const winRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Everything happening across the business right now."
        action={
          <ButtonLink href="/admin/leads" size="sm">
            View all leads
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="New leads"
          value={newLeads}
          sub={newLeads > 0 ? "Waiting on a reply" : "All caught up"}
          icon="quote"
          href="/admin/leads?status=new"
          tone={newLeads > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Leads (30 days)"
          value={leadsLast30}
          sub={`${totalLeads} all time`}
          icon="users"
          href="/admin/leads"
        />
        <StatCard
          label="Won work"
          value={formatCurrency(quotedAmountWon)}
          sub={`${winRate}% win rate`}
          icon="check"
          tone="success"
        />
        <StatCard
          label="Photos live"
          value={`${publishedPhotos} / ${totalPhotos}`}
          sub={`${totalPhotos - publishedPhotos} awaiting review`}
          icon="image"
          href="/admin/gallery"
          tone="neutral"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <Panel title="Recent leads" description="Newest requests first.">
          {recentLeads.length === 0 ? (
            <EmptyState
              title="No leads yet"
              body="Quote requests from the website will land here."
            />
          ) : (
            <ul className="divide-y divide-border-base">
              {recentLeads.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-text-muted">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">
                        {lead.name}
                        {lead.company && (
                          <span className="font-normal text-text-subtle">
                            {" "}
                            · {lead.company}
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-text-subtle">
                        {lead.serviceSlug ?? "No service selected"} ·{" "}
                        {relativeTime(lead.createdAt)}
                      </p>
                    </div>
                    <Badge tone={statusTone[lead.status] ?? "neutral"}>
                      {lead.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border-base px-5 py-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-lake-700 hover:underline dark:text-lake-300"
            >
              All leads
              <Icon name="arrow" className="size-3.5" />
            </Link>
          </div>
        </Panel>

        {/* Upcoming schedule */}
        <Panel title="Coming up" description="Next scheduled jobs.">
          {upcomingBookings.length === 0 ? (
            <EmptyState
              title="Nothing scheduled"
              body="Add a job to the calendar to see it here."
              action={
                <ButtonLink href="/admin/bookings" size="sm" variant="secondary">
                  Open schedule
                </ButtonLink>
              }
            />
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border-base">
                <tr>
                  <Th>Customer</Th>
                  <Th>When</Th>
                  <Th className="text-right">Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {upcomingBookings.map((b) => (
                  <tr key={b.id}>
                    <Td>
                      <p className="font-medium text-text">{b.customerName}</p>
                      <p className="text-xs text-text-subtle">
                        {b.service?.name ?? "—"}
                      </p>
                    </Td>
                    <Td className="whitespace-nowrap text-text-muted">
                      {formatDate(b.scheduledFor, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Td>
                    <Td className="text-right">
                      <Badge tone={statusTone[b.status] ?? "neutral"}>
                        {b.status}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="border-t border-border-base px-5 py-3">
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-lake-700 hover:underline dark:text-lake-300"
            >
              Full schedule
              <Icon name="arrow" className="size-3.5" />
            </Link>
          </div>
        </Panel>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/services", label: "Services", value: `${activeServices} active`, icon: "sparkle" },
          { href: "/admin/gallery", label: "Gallery", value: `${totalPhotos} photos`, icon: "image" },
          { href: "/admin/testimonials", label: "Reviews", value: "Manage", icon: "star" },
          { href: "/admin/settings", label: "Site settings", value: "Edit copy", icon: "settings" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center gap-3 rounded-card border border-border-base bg-surface p-4 transition-colors hover:border-lake-300 dark:hover:border-lake-800"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-surface-2 text-text-muted">
              <Icon name={l.icon} className="size-[1.15rem]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-text">{l.label}</span>
              <span className="block text-xs text-text-subtle">{l.value}</span>
            </span>
            <Icon
              name="arrow"
              className="size-4 text-text-subtle transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>
    </>
  );
}
