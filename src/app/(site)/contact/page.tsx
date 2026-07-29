import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Icon } from "@/components/ui/Icon";
import { getServiceOptions } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Request a free cleaning quote from Champlain Valley Cleaning. Commercial and residential, across Burlington and the Champlain Valley.",
};

export default async function ContactPage() {
  const services = await getServiceOptions();

  return (
    <>
      <section className="bg-topo">
        <div className="container-page py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-700 dark:text-lake-400">
            Get a quote
          </p>
          <h1 className="mt-3 max-w-2xl text-headline font-semibold text-text">
            Tell us about the space
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            The more detail you give us, the closer the first number will be.
            Commercial jobs get a walkthrough before anything is final.
          </p>
        </div>
      </section>

      <section className="container-page pb-8 pt-12 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div className="rounded-card border border-border-base bg-surface p-6 sm:p-8">
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-field bg-surface-2" />
              }
            >
              <QuoteForm services={services} />
            </Suspense>
          </div>

          <aside className="space-y-6">
            <div className="rounded-card border border-border-base bg-surface-2 p-6">
              <h2 className="font-semibold tracking-tight text-text">
                Rather just talk?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Some jobs are easier to describe out loud. Call or email and
                you&apos;ll get a person, not a queue.
              </p>

              <div className="mt-5 space-y-3">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-3 rounded-field bg-surface px-4 py-3 ring-1 ring-border-base transition-colors hover:ring-lake-400"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-lake-50 text-lake-700 dark:bg-lake-950 dark:text-lake-300">
                    <Icon name="phone" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-text">
                      {site.phone}
                    </span>
                    <span className="block text-xs text-text-subtle">
                      Mon–Fri, 7am–6pm
                    </span>
                  </span>
                </a>

                <a
                  href={site.emailHref}
                  className="flex items-center gap-3 rounded-field bg-surface px-4 py-3 ring-1 ring-border-base transition-colors hover:ring-lake-400"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lake-50 text-lake-700 dark:bg-lake-950 dark:text-lake-300">
                    <Icon name="mail" className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-text">
                      {site.email}
                    </span>
                    <span className="block text-xs text-text-subtle">
                      Replies within 1 business day
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <div className="rounded-card border border-border-base bg-surface p-6">
              <h2 className="font-semibold tracking-tight text-text">
                What happens next
              </h2>
              <ol className="mt-4 space-y-4">
                {[
                  "We read your request and call or email with any questions.",
                  "For commercial work, we schedule a short walkthrough.",
                  "You get a written scope and a fixed price to approve.",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lake-100 font-mono text-2xs font-semibold text-lake-800 dark:bg-lake-950 dark:text-lake-300">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-text-muted">
                      {s}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-card border border-border-base bg-surface p-6">
              <h2 className="font-semibold tracking-tight text-text">
                Service area
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {site.serviceArea.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
