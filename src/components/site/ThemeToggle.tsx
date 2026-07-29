"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const THEME_CHANGE_EVENT = "cvc-theme-change";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(THEME_CHANGE_EVENT, notify);

  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(THEME_CHANGE_EVENT, notify);
  };
}

function getSnapshot() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cvc-theme", next ? "dark" : "light");
    } catch {
      /* private mode — fall back to per-session only */
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "grid size-9 place-items-center rounded-full text-text-muted transition-colors hover:bg-surface-2 hover:text-text",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="size-[1.15rem]"
        aria-hidden="true"
      >
        {dark ? (
          <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
