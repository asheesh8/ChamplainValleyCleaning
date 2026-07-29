import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  brand: "bg-lake-100 text-lake-800 dark:bg-lake-950 dark:text-lake-200",
  success: "bg-pine-100 text-pine-800 dark:bg-pine-950 dark:text-pine-200",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
} as const;

export type Tone = keyof typeof tones;

/** Maps a lead / booking status string onto a tone. */
export const statusTone: Record<string, Tone> = {
  new: "brand",
  contacted: "warning",
  quoted: "warning",
  won: "success",
  lost: "neutral",
  pending: "warning",
  confirmed: "brand",
  completed: "success",
  cancelled: "neutral",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
