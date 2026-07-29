import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Icon } from "@/components/ui/Icon";
import { getAdminService } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getAdminService(id);
  return { title: service ? `Edit ${service.name}` : "Service" };
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getAdminService(id);
  if (!service) notFound();

  return (
    <>
      <Link
        href="/admin/services"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <Icon name="arrow" className="size-4 rotate-180" />
        All services
      </Link>

      <PageHeader
        title={service.name}
        description={`/services#${service.slug}`}
        action={
          <Link
            href={`/services#${service.slug}`}
            target="_blank"
            className="inline-flex h-9 items-center gap-2 rounded-field px-3 text-sm font-medium text-text-muted ring-1 ring-inset ring-border-strong transition-colors hover:text-text"
          >
            <Icon name="eye" className="size-4" />
            View on site
          </Link>
        }
      />

      <ServiceForm service={service} />
    </>
  );
}
