import { cn } from "@/lib/utils";

/**
 * Layered Green Mountain ridgeline with atmospheric perspective — far ranges
 * sit high, pale and hazy; near ranges sit low and deep pine. Each layer has a
 * small number of bold, irregular summits offset from the layer behind it, so
 * the silhouette reads as terrain rather than a repeating wave. Decorative only.
 */
export function MountainScene({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 select-none",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 460"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        className="h-[42vh] min-h-80 w-full lg:h-[52vh]"
      >
        {/* ── Ridge 4 — farthest, palest, highest ────────────────────── */}
        <path
          d="M0 255 C80 250 150 180 200 118 C260 175 370 225 450 240
             C540 232 630 165 700 86 C780 155 880 222 950 250
             C1030 244 1120 190 1180 130 C1250 180 1360 215 1440 225
             L1440 460 L0 460 Z"
          className="fill-lake-200/60 dark:fill-lake-950/70"
        />

        {/* ── Ridge 3 ────────────────────────────────────────────────── */}
        <path
          d="M0 240 C40 228 65 220 90 215 C160 250 240 285 300 300
             C380 292 460 235 520 180 C600 240 670 288 730 305
             C810 296 890 245 950 205 C1030 250 1090 285 1150 298
             C1230 288 1300 235 1350 190 C1390 215 1420 240 1440 250
             L1440 460 L0 460 Z"
          className="fill-pine-200/75 dark:fill-pine-950"
        />

        {/* valley mist caught between the ranges */}
        <ellipse
          cx="420"
          cy="302"
          rx="330"
          ry="15"
          className="fill-white/50 blur-[7px] dark:fill-lake-900/25"
        />
        <ellipse
          cx="1080"
          cy="308"
          rx="290"
          ry="13"
          className="fill-white/40 blur-[7px] dark:fill-lake-900/20"
        />

        {/* ── Ridge 2 ────────────────────────────────────────────────── */}
        <path
          d="M0 330 C110 325 250 300 330 268 C420 305 490 340 560 352
             C650 344 710 295 780 250 C870 300 940 345 1010 358
             C1100 350 1180 315 1240 272 C1320 300 1390 322 1440 330
             L1440 460 L0 460 Z"
          className="fill-pine-400/85 dark:fill-pine-900"
        />

        {/* ── Ridge 1 — nearest, lowest, deepest ─────────────────────── */}
        <path
          d="M0 400 C70 388 130 372 180 368 C260 380 330 398 400 405
             C480 400 550 372 620 352 C700 372 780 400 850 410
             C940 404 1010 375 1080 362 C1160 378 1220 398 1280 405
             C1340 392 1390 365 1420 350 C1428 356 1436 362 1440 366
             L1440 460 L0 460 Z"
          className="fill-pine-700 dark:fill-pine-950"
        />
      </svg>
    </div>
  );
}
