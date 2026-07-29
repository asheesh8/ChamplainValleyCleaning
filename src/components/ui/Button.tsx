import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-field font-medium " +
  "transition-[background-color,color,box-shadow,transform] duration-200 " +
  "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px " +
  "whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-lake-700 text-white shadow-e1 hover:bg-lake-800 dark:bg-lake-400 dark:text-lake-950 dark:hover:bg-lake-300",
  secondary:
    "bg-surface text-text ring-1 ring-inset ring-border-strong hover:bg-surface-2",
  ghost: "text-text-muted hover:bg-surface-2 hover:text-text",
  danger:
    "bg-red-600 text-white shadow-e1 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & { href: string } & Omit<
    React.ComponentProps<typeof Link>,
    "href" | "className"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
