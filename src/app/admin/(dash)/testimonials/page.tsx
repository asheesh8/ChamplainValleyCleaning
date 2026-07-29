import { PageHeader, Panel } from "@/components/admin/ui";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import {
  deleteTestimonialAction,
  saveTestimonialAction,
} from "@/app/admin/actions";
import { getAdminTestimonials } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Reviews" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  const placeholders = testimonials.filter((t) => t.id.startsWith("placeholder-"));

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Customer quotes shown on the home page. Only published reviews are visible to visitors."
      />

      {placeholders.length > 0 && (
        <div className="mb-6 flex gap-3 rounded-card border border-amber-300 bg-amber-50 px-5 py-4 dark:border-amber-900 dark:bg-amber-950">
          <Icon name="shield" className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              {placeholders.length} placeholder entries are not real reviews
            </p>
            <p className="mt-1 text-amber-800 dark:text-amber-300">
              They were seeded as templates and left unpublished on purpose.
              Replace the text with genuine customer feedback before publishing
              — never publish invented reviews.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* New review */}
        <Panel title="Add a review" description="Paste a real quote from a customer.">
          <form action={saveTestimonialAction} className="space-y-4 px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="author" required>Customer name</Label>
                <Input id="author" name="author" required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" placeholder="Office manager" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Burlington, VT" />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select id="rating" name="rating" defaultValue="5">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} stars</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="quote" required>The review</Label>
              <Textarea id="quote" name="quote" required />
            </div>

            <label className="flex items-center gap-3 rounded-field bg-surface-2 px-4 py-3">
              <input type="checkbox" name="published" className="size-4 accent-lake-700" />
              <span className="text-sm font-medium text-text">
                Publish to the website
              </span>
            </label>

            <Button type="submit" className="w-full">Add review</Button>
          </form>
        </Panel>

        {/* Existing */}
        <div className="space-y-4">
          {testimonials.length === 0 && (
            <Panel>
              <p className="px-5 py-12 text-center text-sm text-text-subtle">
                No reviews yet.
              </p>
            </Panel>
          )}

          {testimonials.map((t) => (
            <Panel key={t.id}>
              <form action={saveTestimonialAction} className="space-y-3 px-5 py-5">
                <input type="hidden" name="id" value={t.id} />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Icon key={i} name="star" className="size-4 fill-current" />
                    ))}
                  </div>
                  <Badge tone={t.published ? "success" : "neutral"}>
                    {t.published ? "live" : "draft"}
                  </Badge>
                </div>

                <Textarea
                  name="quote"
                  defaultValue={t.quote}
                  aria-label="Review text"
                  className="min-h-24 text-sm"
                  required
                />

                <div className="grid gap-2 sm:grid-cols-3">
                  <Input name="author" defaultValue={t.author} aria-label="Author" className="text-sm" required />
                  <Input name="role" defaultValue={t.role ?? ""} placeholder="Role" aria-label="Role" className="text-sm" />
                  <Input name="location" defaultValue={t.location ?? ""} placeholder="Location" aria-label="Location" className="text-sm" />
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <Select name="rating" defaultValue={String(t.rating)} aria-label="Rating" className="text-sm">
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} stars</option>
                    ))}
                  </Select>
                  <Input name="sortOrder" type="number" defaultValue={t.sortOrder} aria-label="Sort order" className="text-sm" />
                  <label className="flex items-center gap-2 rounded-field bg-surface-2 px-3">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={t.published}
                      className="size-4 accent-lake-700"
                    />
                    <span className="text-sm text-text">Published</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1">Save</Button>
                </div>
              </form>

              <form action={deleteTestimonialAction} className="border-t border-border-base px-5 py-3">
                <input type="hidden" name="id" value={t.id} />
                <Button type="submit" size="sm" variant="ghost" className="text-red-600 dark:text-red-400">
                  <Icon name="trash" className="size-4" />
                  Delete
                </Button>
              </form>
            </Panel>
          ))}
        </div>
      </div>
    </>
  );
}
