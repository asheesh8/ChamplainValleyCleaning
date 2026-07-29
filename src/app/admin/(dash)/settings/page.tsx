import { PageHeader, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { purgeSampleDataAction, saveSettingsAction } from "@/app/admin/actions";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = { title: "Settings" };

const groupLabels: Record<string, { title: string; description: string }> = {
  hero: { title: "Home page hero", description: "The first thing visitors read." },
  contact: { title: "Contact details", description: "Shown across the site." },
  seo: { title: "Search & sharing", description: "Title and description for Google and link previews." },
  general: { title: "General", description: "Business-wide switches." },
};

export default async function SettingsPage() {
  const [settings, sampleCount] = await Promise.all([
    prisma.siteSetting.findMany({ orderBy: { key: "asc" } }),
    prisma.lead.count({ where: { source: "sample" } }),
  ]);

  const grouped = settings.reduce<Record<string, typeof settings>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Settings"
        description="Site copy and business details. Changes apply to the live website immediately."
      />

      <form action={saveSettingsAction} className="space-y-6">
        {Object.entries(grouped).map(([group, items]) => (
          <Panel
            key={group}
            title={groupLabels[group]?.title ?? group}
            description={groupLabels[group]?.description}
          >
            <div className="space-y-5 px-5 py-5">
              {items.map((s) => (
                <div key={s.key}>
                  <Label htmlFor={s.key} hint={s.key}>
                    {s.label}
                  </Label>
                  {s.type === "textarea" ? (
                    <Textarea
                      id={s.key}
                      name={`setting:${s.key}`}
                      defaultValue={s.value}
                    />
                  ) : s.type === "boolean" ? (
                    <label className="flex items-center gap-3 rounded-field bg-surface-2 px-4 py-3">
                      <input
                        type="checkbox"
                        name={`setting:${s.key}`}
                        value="true"
                        defaultChecked={s.value === "true"}
                        className="size-4 accent-lake-700"
                      />
                      <span className="text-sm text-text">Enabled</span>
                    </label>
                  ) : (
                    <Input
                      id={s.key}
                      name={`setting:${s.key}`}
                      type={s.type === "number" ? "number" : "text"}
                      defaultValue={s.value}
                    />
                  )}
                </div>
              ))}
            </div>
          </Panel>
        ))}

        <Button type="submit" size="lg">Save all settings</Button>
      </form>

      <Panel
        title="Business record"
        description="These live in code (src/lib/site.ts) because they rarely change."
        className="mt-6"
      >
        <dl className="grid gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-2">
          {[
            ["Business name", site.name],
            ["Category", site.category],
            ["Location", `${site.address.locality}, ${site.address.region}`],
            ["Phone", site.phone],
            ["Email", site.email],
            ["Domain", site.domain],
            ["Service area", `${site.serviceArea.length} towns`],
            ["Facebook", "Connected"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                {k}
              </dt>
              <dd className="mt-1 break-words text-sm text-text">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-border-base px-5 py-4">
          <p className="text-sm text-text-muted">
            Opening hours in{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
              src/lib/site.ts
            </code>{" "}
            are placeholders — confirm them with the owner before launch.
          </p>
        </div>
      </Panel>

      {sampleCount > 0 && (
        <Panel title="Sample data" className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
            <div className="text-sm">
              <p className="font-medium text-text">
                {sampleCount} demo leads are in your inbox
              </p>
              <p className="mt-1 text-text-muted">
                Seeded so the dashboard was not empty on first run. Remove them
                once real enquiries start arriving.
              </p>
            </div>
            <form action={purgeSampleDataAction}>
              <Button type="submit" variant="secondary" size="sm">
                <Icon name="trash" className="size-4" />
                Delete sample leads
              </Button>
            </form>
          </div>
        </Panel>
      )}
    </>
  );
}
