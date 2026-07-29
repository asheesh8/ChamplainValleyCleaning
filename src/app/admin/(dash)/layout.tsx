import { getCurrentUser } from "@/lib/auth";
import { getAdminNewLeadCount } from "@/lib/admin-data";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function DashLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, newLeads] = await Promise.all([
    getCurrentUser(),
    getAdminNewLeadCount(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-bg-sunken lg:flex-row">
      <AdminNav user={{ name: user.name, email: user.email }} newLeads={newLeads} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
