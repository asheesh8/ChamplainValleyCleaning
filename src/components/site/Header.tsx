"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Our work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-shadow duration-300",
        scrolled
          ? "bg-bg/85 shadow-e1 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors",
                  active
                    ? "text-lake-800 dark:text-lake-300"
                    : "text-text-muted hover:text-text",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-lake-600 dark:bg-lake-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-[0.9375rem] font-medium text-text-muted transition-colors hover:text-text md:inline-flex"
          >
            <Icon name="phone" className="size-4" />
            {site.phone}
          </a>
          <ThemeToggle />
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Free quote
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full text-text-muted transition-colors hover:bg-surface-2 hover:text-text lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border-base bg-bg lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-field px-2 py-3 text-lg font-medium text-text transition-colors hover:bg-surface-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border-base pt-4">
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 px-2 py-2 font-medium text-text"
              >
                <Icon name="phone" className="size-4" />
                {site.phone}
              </a>
              <ButtonLink href="/contact" size="lg">
                Get a free quote
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
