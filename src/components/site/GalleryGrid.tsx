"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type GalleryPhoto = {
  id: string;
  filename: string;
  title: string;
  caption: string | null;
  category: string;
  width: number;
  height: number;
};

const labels: Record<string, string> = {
  all: "All",
  work: "On the job",
  equipment: "Equipment",
  place: "Around the valley",
  team: "The team",
};

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<number | null>(null);

  const categories = useMemo(() => {
    const present = Array.from(new Set(photos.map((p) => p.category)));
    return ["all", ...present];
  }, [photos]);

  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.category === filter)),
    [photos, filter],
  );

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((i) =>
        i === null ? null : (i + dir + visible.length) % visible.length,
      ),
    [visible.length],
  );

  useEffect(() => {
    if (active === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  const current = active === null ? null : visible[active];

  return (
    <>
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setFilter(c);
                setActive(null);
              }}
              aria-pressed={filter === c}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === c
                  ? "bg-lake-700 text-white dark:bg-lake-400 dark:text-lake-950"
                  : "bg-surface text-text-muted ring-1 ring-border-strong hover:text-text",
              )}
            >
              {labels[c] ?? c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4">
        {visible.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActive(i)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-card ring-1 ring-border-base transition-shadow hover:shadow-e2"
            aria-label={`View ${photo.title}`}
          >
            <span className="relative block">
              <Image
                src={`/gallery/${photo.filename}`}
                alt={photo.caption ?? photo.title}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-left text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {photo.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-text-muted">
          No photos in this category yet.
        </p>
      )}

      {/* Lightbox */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[70] flex flex-col bg-black/92 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-center justify-between gap-4 p-4 text-white">
            <p className="min-w-0 truncate text-sm font-medium">
              {current.title}
              <span className="ml-2 text-white/50">
                {active! + 1} / {visible.length}
              </span>
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid size-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/10"
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-3 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <Icon name="arrow" className="size-5 rotate-180" />
            </button>

            <Image
              src={`/gallery/${current.filename}`}
              alt={current.caption ?? current.title}
              width={current.width}
              height={current.height}
              sizes="90vw"
              className="max-h-full w-auto max-w-full rounded-card object-contain"
            />

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-3 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <Icon name="arrow" className="size-5" />
            </button>
          </div>

          {current.caption && (
            <p className="px-6 pb-6 text-center text-sm text-white/70">
              {current.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
