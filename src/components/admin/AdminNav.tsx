"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/leads", label: "Leads", icon: "quote", badge: true },
  { href: "/admin/bookings", label: "Schedule", icon: "calendar" },
  { href: "/admin/services", label: "Services", icon: "sparkle" },
  { href: "/admin/gallery", label: "Gallery", icon: "image" },
  { href: "/admin/testimonials", label: "Reviews", icon: "star" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export function AdminNav({
  user,
  newLeads,
}: {
  user: { name: string; email: string };
  newLeads: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-0.5" aria-label="Admin">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-lake-700 text-white dark:bg-lake-400 dark:text-lake-950"
                : "text-text-muted hover:bg-surface-2 hover:text-text",
            )}
          >
            <Icon name={l.icon} className="size-[1.15rem]" />
            <span className="flex-1">{l.label}</span>
            {l.badge && newLeads > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-2xs font-semibold",
                  active
                    ? "bg-white/20 text-white dark:bg-lake-950/20 dark:text-lake-950"
                    : "bg-lake-100 text-lake-800 dark:bg-lake-950 dark:text-lake-300",
                )}
              >
                {newLeads}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b border-border-base bg-surface px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <LogoMark className="size-7" />
          <span className="text-sm font-semibold text-text">Admin</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-full text-text-muted hover:bg-surface-2"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-b border-border-base bg-surface p-4 lg:hidden">
          {nav}
          <LogoutButton />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border-base bg-surface p-4 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2 py-2">
          <LogoMark className="size-8" />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-text">
              Champlain Valley
            </span>
            <span className="text-2xs font-medium uppercase tracking-[0.16em] text-lake-700 dark:text-lake-400">
              Admin
            </span>
          </span>
        </Link>

        <div className="mt-6 flex-1">{nav}</div>

        <div className="border-t border-border-base pt-4">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-3 rounded-field px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <Icon name="eye" className="size-[1.15rem]" />
            View website
          </Link>

          <div className="flex items-center gap-2 px-3 py-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lake-100 text-xs font-semibold text-lake-800 dark:bg-lake-950 dark:text-lake-300">
              {user.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{user.name}</p>
              <p className="truncate text-2xs text-text-subtle">{user.email}</p>
            </div>
            <ThemeToggle />
          </div>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction} className="mt-1">
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-field px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
      >
        <Icon name="logout" className="size-[1.15rem]" />
        Sign out
      </button>
    </form>
  );
}
