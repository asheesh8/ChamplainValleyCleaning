import Link from "next/link";
import { PageHeader, Panel, EmptyState, Th, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  deleteServiceAction,
  toggleServiceActiveAction,
} from "@/app/admin/actions";
import { getAdminServices } from "@/lib/admin-data";
import { priceLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return (
    <>
      <PageHeader
        title="Services"
        description="What you sell, how it's described and what it starts at. Changes go live immediately."
        action={
          <ButtonLink href="/admin/services/new" size="sm">
            <Icon name="plus" className="size-4" />
            New service
          </ButtonLink>
        }
      />

      <Panel>
        {services.length === 0 ? (
          <EmptyState
            title="No services yet"
            body="Add your first service and it will appear on the website."
            action={<ButtonLink href="/admin/services/new" size="sm">Add a service</ButtonLink>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b border-border-base">
                <tr>
                  <Th>Service</Th>
                  <Th>Category</Th>
                  <Th>Starting price</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {services.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-surface-2">
                    <Td>
                      <Link
                        href={`/admin/services/${s.id}`}
                        className="flex items-center gap-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-lake-50 text-lake-700 dark:bg-lake-950 dark:text-lake-300">
                          <Icon name={s.icon} className="size-[1.1rem]" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="font-medium text-text">{s.name}</span>
                            {s.featured && <Badge tone="brand">featured</Badge>}
                          </span>
                          <span className="block truncate text-xs text-text-subtle">
                            {s.blurb}
                          </span>
                        </span>
                      </Link>
                    </Td>
                    <Td className="capitalize text-text-muted">{s.category}</Td>
                    <Td className="whitespace-nowrap text-text-muted">
                      {priceLabel(s.priceFrom, s.priceUnit)}
                    </Td>
                    <Td>
                      <Badge tone={s.active ? "success" : "neutral"}>
                        {s.active ? "active" : "hidden"}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/services/${s.id}`}
                          className="grid size-9 place-items-center rounded-field text-text-muted ring-1 ring-inset ring-border-strong transition-colors hover:text-text"
                          aria-label={`Edit ${s.name}`}
                        >
                          <Icon name="settings" className="size-4" />
                        </Link>
                        <form action={toggleServiceActiveAction}>
                          <input type="hidden" name="id" value={s.id} />
                          <Button
                            type="submit"
                            size="sm"
                            variant="secondary"
                            aria-label={s.active ? "Hide" : "Activate"}
                          >
                            <Icon
                              name={s.active ? "eyeOff" : "eye"}
                              className="size-4"
                            />
                          </Button>
                        </form>
                        <form action={deleteServiceAction}>
                          <input type="hidden" name="id" value={s.id} />
                          <Button
                            type="submit"
                            size="sm"
                            variant="secondary"
                            aria-label={`Delete ${s.name}`}
                          >
                            <Icon name="trash" className="size-4" />
                          </Button>
                        </form>
                      </div>
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
