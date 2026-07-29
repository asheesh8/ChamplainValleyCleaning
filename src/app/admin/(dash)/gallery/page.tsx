import Image from "next/image";
import Link from "next/link";
import { PageHeader, Panel } from "@/components/admin/ui";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input, Select } from "@/components/ui/Field";
import {
  deleteGalleryItemAction,
  toggleGalleryFlagAction,
  updateGalleryItemAction,
} from "@/app/admin/actions";
import { getAdminGallery } from "@/lib/admin-data";
import { galleryCategories } from "@/lib/validation";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gallery" };

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;

  const { items, total, published } = await getAdminGallery(filter);

  const filters = [
    { key: "all", label: "All", count: total },
    { key: "published", label: "Published", count: published },
    { key: "hidden", label: "Hidden", count: total - published },
  ];

  return (
    <>
      <PageHeader
        title="Gallery"
        description={`${total} photos imported from the Facebook page. Only published photos appear on the website — review the hidden ones and publish what looks good.`}
        action={
          <Link
            href="/gallery"
            target="_blank"
            className="inline-flex h-9 items-center gap-2 rounded-field px-3 text-sm font-medium text-text-muted ring-1 ring-inset ring-border-strong transition-colors hover:text-text"
          >
            <Icon name="eye" className="size-4" />
            View live gallery
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/admin/gallery" : `/admin/gallery?filter=${f.key}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "bg-lake-700 text-white dark:bg-lake-400 dark:text-lake-950"
                : "bg-surface text-text-muted ring-1 ring-border-strong hover:text-text",
            )}
          >
            {f.label}
            <span
              className={cn(
                "ml-1.5",
                filter === f.key
                  ? "text-white/70 dark:text-lake-950/60"
                  : "text-text-subtle",
              )}
            >
              {f.count}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Panel key={item.id} className="overflow-hidden">
            <div className="relative aspect-4/3 bg-surface-2">
              <Image
                src={`/gallery/${item.filename}`}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className={cn(
                  "object-cover transition-opacity",
                  !item.published && "opacity-45",
                )}
              />
              <div className="absolute left-2 top-2 flex gap-1.5">
                {item.published ? (
                  <Badge tone="success">live</Badge>
                ) : (
                  <Badge tone="neutral">hidden</Badge>
                )}
                {item.featured && <Badge tone="brand">featured</Badge>}
              </div>
              <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-2xs font-medium text-white">
                {item.width}×{item.height}
              </span>
            </div>

            <div className="space-y-3 p-4">
              <form action={updateGalleryItemAction} className="space-y-2.5">
                <input type="hidden" name="id" value={item.id} />
                <Input
                  name="title"
                  defaultValue={item.title}
                  aria-label="Photo title"
                  className="text-sm"
                />
                <Input
                  name="caption"
                  defaultValue={item.caption ?? ""}
                  placeholder="Caption (shown under the photo)"
                  aria-label="Caption"
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Select
                    name="category"
                    defaultValue={item.category}
                    aria-label="Category"
                    className="text-sm"
                  >
                    {galleryCategories.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </Select>
                  <Input
                    name="sortOrder"
                    type="number"
                    defaultValue={item.sortOrder}
                    aria-label="Sort order"
                    className="w-20 text-sm"
                  />
                </div>
                <Button type="submit" size="sm" variant="secondary" className="w-full">
                  Save details
                </Button>
              </form>

              <div className="flex gap-2 border-t border-border-base pt-3">
                <form action={toggleGalleryFlagAction} className="flex-1">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="flag" value="published" />
                  <Button
                    type="submit"
                    size="sm"
                    variant={item.published ? "secondary" : "primary"}
                    className="w-full"
                  >
                    <Icon
                      name={item.published ? "eyeOff" : "eye"}
                      className="size-4"
                    />
                    {item.published ? "Hide" : "Publish"}
                  </Button>
                </form>

                <form action={toggleGalleryFlagAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="flag" value="featured" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    aria-label={item.featured ? "Unfeature" : "Feature"}
                    title={item.featured ? "Unfeature" : "Feature on home page"}
                  >
                    <Icon
                      name="star"
                      className={cn(
                        "size-4",
                        item.featured && "fill-current text-amber-500",
                      )}
                    />
                  </Button>
                </form>

                <form action={deleteGalleryItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    aria-label="Delete photo"
                    title="Delete"
                  >
                    <Icon name="trash" className="size-4" />
                  </Button>
                </form>
              </div>

              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block text-2xs text-text-subtle hover:text-text-muted"
                >
                  View original on Facebook →
                </a>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
