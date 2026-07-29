import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import { parseFeatures, priceLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Commercial janitorial, carpet and upholstery extraction, hard floor care, deep cleaning, post-construction cleanup, move-out turnovers, residential housekeeping and interior glass.",
};

const categoryLabels: Record<string, string> = {
  commercial: "Commercial",
  residential: "Residential",
  specialty: "Specialty",
};

const categoryNotes: Record<string, string> = {
  residential:
    "For homes we do deep cleans and turnovers only — one thorough visit, not weekly or biweekly housekeeping.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const grouped = Object.entries(
    services.reduce<Record<string, typeof services>>((acc, s) => {
      (acc[s.category] ??= []).push(s);
      return acc;
    }, {}),
  );

  return (
    <>
      <section className="bg-topo">
        <div className="container-page py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-700 dark:text-lake-400">
            Services
          </p>
          <h1 className="mt-3 max-w-3xl text-headline font-semibold text-text">
            Every building is scoped on its own terms
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            {`${services.length} services across commercial, residential and specialty work.`}{" "}
            Prices marked &ldquo;custom quote&rdquo; need a walkthrough — square
            footage alone won&apos;t tell us what a floor has been through.
          </p>

          <nav aria-label="Service categories" className="mt-8 flex flex-wrap gap-2">
            {grouped.map(([category, list]) => (
              <a
                key={category}
                href={`#cat-${category}`}
                className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-text-muted ring-1 ring-border-strong transition-colors hover:text-text"
              >
                {categoryLabels[category] ?? category}
                <span className="ml-1.5 text-text-subtle">{list.length}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-page space-y-20 py-16 lg:py-20">
        {grouped.map(([category, list]) => (
          <section key={category} id={`cat-${category}`} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-text">
              {categoryLabels[category] ?? category}
            </h2>
            {categoryNotes[category] && (
              <p className="mt-2 max-w-2xl text-sm text-text-muted">
                {categoryNotes[category]}
              </p>
            )}

            <div className="mt-8 space-y-6">
              {list.map((service) => {
                const features = parseFeatures(service.features);
                return (
                  <article
                    key={service.id}
                    id={service.slug}
                    className="scroll-mt-24 overflow-hidden rounded-card border border-border-base bg-surface"
                  >
                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
                      <div>
                        <div className="flex items-start gap-4">
                          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-lake-50 text-lake-700 dark:bg-lake-950 dark:text-lake-300">
                            <Icon name={service.icon} className="size-6" />
                          </span>
                          <div>
                            <h3 className="text-xl font-semibold tracking-tight text-text">
                              {service.name}
                            </h3>
                            <p className="mt-1 text-sm text-text-muted">
                              {service.blurb}
                            </p>
                          </div>
                        </div>

                        <p className="mt-5 leading-relaxed text-text-muted">
                          {service.description}
                        </p>
                      </div>

                      <div className="rounded-card bg-surface-2 p-5">
                        <p className="text-sm font-semibold text-text">
                          {priceLabel(service.priceFrom, service.priceUnit)}
                        </p>

                        {features.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {features.map((f) => (
                              <li
                                key={f}
                                className="flex gap-2.5 text-sm text-text-muted"
                              >
                                <Icon
                                  name="check"
                                  className="mt-0.5 size-4 shrink-0 text-pine-600 dark:text-pine-400"
                                />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <ButtonLink
                          href={`/contact?service=${service.slug}`}
                          size="sm"
                          className="mt-5 w-full"
                        >
                          Quote this service
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="container-page pb-8">
        <div className="rounded-card border border-border-base bg-surface-2 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            Not sure which one you need?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-muted">
            Describe the space and we&apos;ll tell you what it actually needs —
            including when the answer is &ldquo;less than you think&rdquo;.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact">Ask us</ButtonLink>
            <Link
              href={site.phoneHref}
              className="inline-flex h-11 items-center gap-2 rounded-field px-5 text-[0.9375rem] font-medium text-text ring-1 ring-inset ring-border-strong transition-colors hover:bg-surface"
            >
              <Icon name="phone" className="size-4" />
              {site.phone}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
