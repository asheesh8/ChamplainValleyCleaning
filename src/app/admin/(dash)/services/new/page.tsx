import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "New service" };

export default function NewServicePage() {
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
        title="New service"
        description="It will appear on the website as soon as you save it with Active ticked."
      />

      <ServiceForm />
    </>
  );
}
