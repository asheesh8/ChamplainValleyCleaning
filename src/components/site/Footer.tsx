import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/services#commercial-janitorial", label: "Commercial janitorial" },
      { href: "/services#carpet-extraction", label: "Carpet extraction" },
      { href: "/services#hard-floor-care", label: "Hard floor care" },
      { href: "/services#residential-deep-clean", label: "Residential deep clean" },
      { href: "/services", label: "All services" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/gallery", label: "Our work" },
      { href: "/contact", label: "Get a quote" },
      { href: site.social.facebook, label: "Facebook", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-base bg-surface-2">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted">
              Commercial and residential cleaning across the Champlain Valley.
              Written scopes, consistent crews, and work you can inspect.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-sm">
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2.5 text-text transition-colors hover:text-lake-700 dark:hover:text-lake-300"
              >
                <Icon name="phone" className="size-4 text-text-subtle" />
                {site.phone}
              </a>
              <a
                href={site.emailHref}
                className="inline-flex items-center gap-2.5 break-all text-text transition-colors hover:text-lake-700 dark:hover:text-lake-300"
              >
                <Icon name="mail" className="size-4 shrink-0 text-text-subtle" />
                {site.email}
              </a>
              <p className="inline-flex items-center gap-2.5 text-text-muted">
                <Icon name="pin" className="size-4 text-text-subtle" />
                {site.address.locality}, {site.address.region}
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold text-text">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-text-muted transition-colors hover:text-text"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted transition-colors hover:text-text"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border-base pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-subtle">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-text-subtle">
            Serving {site.serviceArea.slice(0, 4).join(", ")} and the wider
            Champlain Valley.
          </p>
        </div>
      </div>
    </footer>
  );
}
