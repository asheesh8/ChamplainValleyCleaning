import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { getPublishedGallery } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our work",
  description:
    "Photos from real Champlain Valley Cleaning jobs — floor care, restroom sanitation and our commercial cleaning equipment.",
};

export default async function GalleryPage() {
  const photos = await getPublishedGallery();

  return (
    <>
      <section className="bg-topo">
        <div className="container-page py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-700 dark:text-lake-400">
            Our work
          </p>
          <h1 className="mt-3 max-w-2xl text-headline font-semibold text-text">
            Photos from actual jobs
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            No stock photography. Everything here is a building we cleaned or
            equipment we own.
          </p>
        </div>
      </section>

      <section className="container-page py-12 lg:py-16">
        {photos.length > 0 ? (
          <GalleryGrid photos={photos} />
        ) : (
          <div className="rounded-card border border-dashed border-border-strong py-20 text-center">
            <p className="font-medium text-text">No photos published yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
              Photos are managed in the admin. Publish a few from the gallery
              library and they will appear here.
            </p>
          </div>
        )}
      </section>

      <section className="container-page pb-8">
        <div className="rounded-card bg-lake-800 p-8 text-center sm:p-12 dark:bg-lake-950">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Want your building to look like this?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-lake-100">
            Tell us what you need cleaned and we&apos;ll put a number on it.
          </p>
          <ButtonLink
            href="/contact"
            size="lg"
            className="mt-6 bg-white text-lake-900 hover:bg-lake-50 dark:bg-lake-300 dark:text-lake-950"
          >
            Get a free quote
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
