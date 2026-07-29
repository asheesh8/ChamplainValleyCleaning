import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { Panel } from "@/components/admin/ui";
import { saveServiceAction } from "@/app/admin/actions";
import { serviceCategories } from "@/lib/validation";
import { parseFeatures } from "@/lib/utils";

type Service = {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  description: string;
  category: string;
  icon: string;
  priceFrom: number | null;
  priceUnit: string;
  features: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

const icons = [
  "building", "droplet", "sparkle", "shield", "hammer",
  "key", "home", "window", "users", "check",
];

export function ServiceForm({ service }: { service?: Service }) {
  const features = service ? parseFeatures(service.features).join("\n") : "";

  return (
    <form action={saveServiceAction} className="space-y-6">
      {service && <input type="hidden" name="id" value={service.id} />}

      <Panel title="Basics">
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" required>Name</Label>
            <Input id="name" name="name" defaultValue={service?.name} required />
          </div>
          <div>
            <Label htmlFor="slug" required hint="url-friendly">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={service?.slug}
              pattern="[a-z0-9\-]+"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="blurb" required hint="one line, shown on cards">
              Short blurb
            </Label>
            <Input id="blurb" name="blurb" defaultValue={service?.blurb} required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description" required>Full description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={service?.description}
              className="min-h-36"
              required
            />
          </div>
        </div>
      </Panel>

      <Panel title="Presentation">
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" defaultValue={service?.category ?? "commercial"}>
              {serviceCategories.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="icon">Icon</Label>
            <Select id="icon" name="icon" defaultValue={service?.icon ?? "sparkle"}>
              {icons.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="sortOrder" hint="lower first">Sort order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={service?.sortOrder ?? 100}
            />
          </div>

          <div className="sm:col-span-3">
            <Label htmlFor="features" hint="one per line">Feature bullets</Label>
            <Textarea
              id="features"
              name="features"
              defaultValue={features}
              className="min-h-32 font-mono text-sm"
              placeholder={"Written scope of work\nAfter-hours scheduling"}
            />
          </div>
        </div>
      </Panel>

      <Panel title="Pricing & visibility">
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="priceFrom" hint="blank = quote only">
              Starting price ($)
            </Label>
            <Input
              id="priceFrom"
              name="priceFrom"
              type="number"
              min={0}
              defaultValue={service?.priceFrom ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="priceUnit">Price unit</Label>
            <Select id="priceUnit" name="priceUnit" defaultValue={service?.priceUnit ?? "visit"}>
              <option value="visit">per visit</option>
              <option value="hour">per hour</option>
              <option value="sqft">per sq ft</option>
              <option value="month">per month</option>
            </Select>
          </div>

          <label className="flex items-center gap-3 rounded-field bg-surface-2 px-4 py-3">
            <input
              type="checkbox"
              name="active"
              defaultChecked={service?.active ?? true}
              className="size-4 accent-lake-700"
            />
            <span>
              <span className="block text-sm font-medium text-text">Active</span>
              <span className="block text-xs text-text-subtle">
                Shown on the website
              </span>
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-field bg-surface-2 px-4 py-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={service?.featured ?? false}
              className="size-4 accent-lake-700"
            />
            <span>
              <span className="block text-sm font-medium text-text">Featured</span>
              <span className="block text-xs text-text-subtle">
                Highlighted on the home page
              </span>
            </span>
          </label>
        </div>
      </Panel>

      <div className="flex gap-3">
        <Button type="submit" size="lg">
          {service ? "Save changes" : "Create service"}
        </Button>
        <Link
          href="/admin/services"
          className="inline-flex h-13 items-center rounded-field px-6 text-base font-medium text-text-muted ring-1 ring-inset ring-border-strong transition-colors hover:text-text"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
