import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ServiceCard } from "@/components/site/ServiceCard";
import { MountainScene } from "@/components/site/MountainScene";
import {
  getFeaturedServices,
  getPublishedGallery,
  getPublishedTestimonials,
} from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const promises = [
  {
    icon: "quote",
    title: "A written scope, not a handshake",
    body: "Every building gets a documented task list so you know exactly what is being cleaned and how often. No ambiguity when something gets missed.",
  },
  {
    icon: "users",
    title: "The same crew, wherever we can",
    body: "Consistency is what makes a clean building stay clean. We keep the same people on your site so they learn its quirks.",
  },
  {
    icon: "sparkle",
    title: "Commercial-grade equipment",
    body: "Kärcher extraction, floor machines and HEPA vacuums — the gear that separates a real clean from a quick wipe-down.",
  },
];

const steps = [
  { n: "01", title: "Tell us about the space", body: "Send the square footage, the surfaces and how often you need us. Two minutes on the form." },
  { n: "02", title: "We walk it with you", body: "For commercial work we visit in person. It's the only honest way to price a building." },
  { n: "03", title: "You get a written scope", body: "A task list and a fixed price. You approve it before anyone starts." },
  { n: "04", title: "We show up and prove it", body: "Consistent crews, a checklist left behind, and a direct line if something's off." },
];

export default async function HomePage() {
  const [featuredServices, heroPhotos, testimonials] = await Promise.all([
    getFeaturedServices(4),
    getPublishedGallery(5),
    getPublishedTestimonials(3),
  ]);

  const hero = heroPhotos[0];

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-sky-valley">
        {/* sun glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 size-[38rem] -translate-x-1/3 -translate-y-1/2 rounded-full bg-amber-200/25 blur-3xl dark:bg-lake-800/25"
        />

        <MountainScene />

        <div className="container-page relative z-10 grid items-center gap-12 pb-52 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-64 lg:pt-20">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-lake-800 ring-1 ring-lake-200 backdrop-blur dark:text-lake-300 dark:ring-lake-900">
              <Icon name="pin" className="size-3.5" />
              {site.address.locality}, Vermont
            </p>

            <h1 className="mt-5 text-display font-semibold text-text">
              A cleaning crew that{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-lake-700 dark:text-lake-300">
                  sweats the details
                </span>
                <svg
                  viewBox="0 0 320 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-3 w-full text-pine-300 dark:text-pine-700"
                >
                  <path
                    d="M2 9c60-5 120-7 180-6s90 3 136 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">
              Commercial and residential cleaning across the Champlain Valley.
              Written scopes, consistent crews, and work you can actually
              inspect.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact" size="lg">
                Get a free quote
                <Icon name="arrow" className="size-4" />
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="secondary">
                Browse services
              </ButtonLink>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-text-muted">
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 font-medium text-text transition-colors hover:text-lake-700 dark:hover:text-lake-300"
              >
                <Icon name="phone" className="size-4 text-lake-600 dark:text-lake-400" />
                {site.phone}
              </a>
              <span className="inline-flex items-center gap-2">
                <Icon name="clock" className="size-4 text-lake-600 dark:text-lake-400" />
                Replies within 1 business day
              </span>
            </div>
          </div>

          {/* Hero image collage */}
          <div className="relative animate-rise [animation-delay:120ms]">
            {hero ? (
              <div className="relative">
                <div className="relative aspect-4/3 overflow-hidden rounded-card shadow-e3 ring-1 ring-black/5">
                  <Image
                    src={`/gallery/${hero.filename}`}
                    alt={hero.caption ?? hero.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 44vw"
                    className="object-cover"
                  />
                </div>

                {heroPhotos[1] && (
                  <div className="absolute -bottom-8 -left-6 hidden w-40 overflow-hidden rounded-card shadow-e3 ring-4 ring-bg sm:block">
                    <div className="relative aspect-3/4">
                      <Image
                        src={`/gallery/${heroPhotos[1].filename}`}
                        alt={heroPhotos[1].caption ?? heroPhotos[1].title}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="absolute -right-3 -top-5 hidden rounded-card bg-surface px-4 py-3 shadow-e2 ring-1 ring-border-base sm:block">
                  <p className="text-2xl font-semibold tracking-tight text-text">
                    {site.serviceArea.length}+
                  </p>
                  <p className="text-xs text-text-muted">towns served</p>
                </div>
              </div>
            ) : (
              <div className="aspect-4/3 rounded-card bg-surface-2 ring-1 ring-border-base" />
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Promises */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {promises.map((p) => (
            <div
              key={p.title}
              className="rounded-card border border-border-base bg-surface p-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-pine-50 text-pine-700 dark:bg-pine-950 dark:text-pine-300">
                <Icon name={p.icon} className="size-[1.35rem]" />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight text-text">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- Services */}
      <section className="container-page py-8 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-700 dark:text-lake-400">
              What we do
            </p>
            <h2 className="mt-2 text-headline font-semibold text-text">
              Cleaning that matches the building
            </h2>
            <p className="mt-3 text-lg text-text-muted">
              A dental suite, a restaurant floor and a three-bedroom house need
              three different crews with three different kits. We scope each one
              separately.
            </p>
          </div>
          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-lake-700 hover:underline dark:text-lake-300"
          >
            All services
            <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- Work */}
      {heroPhotos.length > 2 && (
        <section className="container-page py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-700 dark:text-lake-400">
                Our work
              </p>
              <h2 className="mt-2 text-headline font-semibold text-text">
                Straight from the job
              </h2>
            </div>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-lake-700 hover:underline dark:text-lake-300"
            >
              See the gallery
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            {heroPhotos.slice(0, 4).map((photo, i) => (
              <Link
                key={photo.id}
                href="/gallery"
                className={`group relative overflow-hidden rounded-card ring-1 ring-border-base ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"
                }`}
              >
                <Image
                  src={`/gallery/${photo.filename}`}
                  alt={photo.caption ?? photo.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {photo.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- Process */}
      <section className="border-y border-border-base bg-surface-2 py-16 lg:py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-700 dark:text-lake-400">
              How it works
            </p>
            <h2 className="mt-2 text-headline font-semibold text-text">
              Four steps, no surprises
            </h2>
          </div>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="relative">
                <span className="font-mono text-sm font-medium text-lake-600 dark:text-lake-400">
                  {s.n}
                </span>
                <span className="mt-3 block h-px w-full bg-border-strong" />
                <h3 className="mt-4 font-semibold tracking-tight text-text">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------------- Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page py-16 lg:py-24">
          <h2 className="text-headline font-semibold text-text">
            What clients say
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col rounded-card border border-border-base bg-surface p-6"
              >
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Icon key={i} name="star" className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-border-base pt-4">
                  <p className="text-sm font-semibold text-text">{t.author}</p>
                  {(t.role || t.location) && (
                    <p className="text-xs text-text-subtle">
                      {[t.role, t.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- Area + CTA */}
      <section className="container-page pb-8 pt-16 lg:pt-24">
        <div className="overflow-hidden rounded-card bg-lake-800 dark:bg-lake-950">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-14">
            <div>
              <h2 className="text-headline font-semibold text-white">
                Get a quote this week
              </h2>
              <p className="mt-4 max-w-md text-lake-100">
                Tell us about the space and we&apos;ll come look at it. No
                obligation, no pressure, and a real number at the end of it.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  className="bg-white text-lake-900 hover:bg-lake-50 dark:bg-lake-300 dark:text-lake-950"
                >
                  Request a quote
                  <Icon name="arrow" className="size-4" />
                </ButtonLink>
                <a
                  href={site.phoneHref}
                  className="inline-flex h-13 items-center gap-2 rounded-field px-6 text-base font-medium text-white ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/10"
                >
                  <Icon name="phone" className="size-4" />
                  {site.phone}
                </a>
              </div>
            </div>

            <div className="lg:pl-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lake-300">
                Service area
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {site.serviceArea.map((town) => (
                  <li
                    key={town}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-lake-50"
                  >
                    {town}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-lake-200">
                Not on the list? We travel — ask and we&apos;ll tell you
                straight whether it works.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
