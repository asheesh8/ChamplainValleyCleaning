import { cn } from "@/lib/utils";

/**
 * The client has no logo — their Facebook avatar is a default letter tile.
 * This mark is purpose-built: a lake horizon under the Green Mountains,
 * enclosed in a droplet. Pure SVG so it stays crisp and themeable.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("size-9", className)}
    >
      <path
        d="M20 2.5c6.6 6.2 11.5 12.2 11.5 18.2A11.5 11.5 0 0 1 8.5 20.7C8.5 14.7 13.4 8.7 20 2.5Z"
        className="fill-lake-700 dark:fill-lake-400"
      />
      {/* mountain ridge */}
      <path
        d="M11 24.6l4.7-5.6 3.3 3.8 4-5.1 5.9 6.9H11Z"
        className="fill-pine-300 dark:fill-pine-800"
      />
      {/* water */}
      <path
        d="M10.4 26.6h19.2a11.5 11.5 0 0 1-19.2 0Z"
        className="fill-lake-200 dark:fill-lake-950"
      />
      {/* shine */}
      <path
        d="M16.4 8.6c-2.6 3-4.2 5.6-4.8 8"
        stroke="currentColor"
        className="text-white/45 dark:text-lake-950/40"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[0.95rem] font-semibold tracking-tight text-text">
            Champlain Valley
          </span>
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-lake-700 dark:text-lake-400">
            Cleaning
          </span>
        </span>
      )}
    </span>
  );
}
