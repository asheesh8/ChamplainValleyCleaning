import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children,
  className,
  title,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-card border border-border-base bg-surface",
        className,
      )}
    >
      {title && (
        <div className="border-b border-border-base px-5 py-4">
          <h2 className="font-semibold tracking-tight text-text">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-text-muted">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  href,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  href?: string;
  tone?: "brand" | "success" | "warning" | "neutral";
}) {
  const tones = {
    brand: "bg-lake-50 text-lake-700 dark:bg-lake-950 dark:text-lake-300",
    success: "bg-pine-50 text-pine-700 dark:bg-pine-950 dark:text-pine-300",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    neutral: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  };

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}>
          <Icon name={icon} className="size-5" />
        </span>
        {href && (
          <Icon
            name="arrow"
            className="size-4 text-text-subtle transition-transform group-hover:translate-x-0.5"
          />
        )}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums text-text">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-text-muted">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-text-subtle">{sub}</p>}
    </>
  );

  const base =
    "rounded-card border border-border-base bg-surface p-5 transition-colors";

  return href ? (
    <Link href={href} className={cn(base, "group hover:border-lake-300 dark:hover:border-lake-800")}>
      {inner}
    </Link>
  ) : (
    <div className={base}>{inner}</div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-16 text-center">
      <p className="font-medium text-text">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}
