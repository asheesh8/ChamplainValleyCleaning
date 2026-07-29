import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getPlacePhoto } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Champlain Valley Cleaning is a Vermont janitorial company serving Burlington and the surrounding towns with commercial and residential cleaning.",
};

const values = [
  {
    icon: "check",
    title: "Detail over speed",
    body: "Anyone can move fast through a building. We would rather take the extra fifteen minutes and have you find nothing to point at.",
  },
  {
    icon: "users",
    title: "Local, and staying that way",
    body: "We live here. The buildings we clean belong to neighbours, and word travels fast in Vermont — that is the whole accountability model.",
  },
  {
    icon: "quote",
    title: "Say what it costs",
    body: "A written scope and a real number up front. If something falls outside it we tell you before we do it, not on the invoice.",
  },
];

export default async function AboutPage() {
  const photo = await getPlacePhoto();

  return (
    <>
      <section className="bg-topo">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-700 dark:text-lake-400">
              About us
            </p>
            <h1 className="mt-3 text-headline font-semibold text-text">
              Cleaning the Champlain Valley since {site.founded}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              {site.bio}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Work with us</ButtonLink>
              <ButtonLink href="/gallery" variant="secondary">
                See our work
              </ButtonLink>
            </div>
          </div>

          {photo && (
            <div className="relative aspect-4/3 overflow-hidden rounded-card shadow-e3 ring-1 ring-black/5">
              <Image
                src={`/gallery/${photo.filename}`}
                alt={photo.caption ?? photo.title}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-card border border-border-base bg-surface p-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-pine-50 text-pine-700 dark:bg-pine-950 dark:text-pine-300">
                <Icon name={v.icon} className="size-[1.35rem]" />
              </span>
              <h2 className="mt-4 font-semibold tracking-tight text-text">
                {v.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border-base bg-surface-2 py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-headline font-semibold text-text">
              Where we work
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-text-muted">
              We are based in {site.address.locality} and cover the Champlain
              Valley, with a growing share of our work in and around Burlington.
              If your town is not listed, ask anyway — we will give you a
              straight answer about whether the drive makes sense.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.serviceArea.map((town) => (
                <li
                  key={town}
                  className="rounded-full bg-surface px-3 py-1.5 text-sm text-text-muted ring-1 ring-border-base"
                >
                  {town}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-border-base bg-surface p-6 sm:p-8">
            <h2 className="font-semibold tracking-tight text-text">
              Get in touch
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex gap-3">
                <dt className="sr-only">Phone</dt>
                <Icon name="phone" className="mt-0.5 size-4 text-text-subtle" />
                <dd>
                  <a
                    href={site.phoneHref}
                    className="font-medium text-text hover:text-lake-700 dark:hover:text-lake-300"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Email</dt>
                <Icon name="mail" className="mt-0.5 size-4 shrink-0 text-text-subtle" />
                <dd>
                  <a
                    href={site.emailHref}
                    className="break-all font-medium text-text hover:text-lake-700 dark:hover:text-lake-300"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Location</dt>
                <Icon name="pin" className="mt-0.5 size-4 text-text-subtle" />
                <dd className="text-text-muted">
                  {site.address.locality}, {site.address.region}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Hours</dt>
                <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-text-subtle" />
                <dd className="space-y-1 text-text-muted">
                  {site.hours.map((h) => (
                    <p key={h.day}>
                      <span className="text-text">{h.day}</span>{" "}
                      {h.close ? `${h.open} – ${h.close}` : h.open}
                    </p>
                  ))}
                </dd>
              </div>
            </dl>

            <a
              href={site.social.facebook}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lake-700 hover:underline dark:text-lake-300"
            >
              Follow us on Facebook
              <Icon name="arrow" className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
