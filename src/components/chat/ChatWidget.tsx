"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/site/Logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { scriptedReply, type Message, GREETING, QUICK_REPLIES } from "./script";

/**
 * Floating assistant.
 *
 * ⚠️ NOT WIRED TO AN LLM. Replies come from `./script`, a small deterministic
 * responder. The visual layer, streaming-style typing indicator, quick replies
 * and transcript shape are all final — swapping in a real model means replacing
 * the single `respond()` call below with a fetch to /api/chat and streaming the
 * result into `messages`. Nothing else needs to change.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function respond(text: string) {
    setTyping(true);
    // Deterministic stand-in for model latency.
    const delay = 420 + Math.min(text.length * 12, 900);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, scriptedReply(text)]);
      if (!open) setUnread(true);
    }, delay);
  }

  function send(text: string) {
    const body = text.trim();
    if (!body || typing) return;
    setMessages((m) => [...m, { role: "visitor", body }]);
    setDraft("");
    respond(body);
  }

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) setUnread(false);
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-controls="cvc-chat-panel"
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-5 right-5 z-[60] grid size-14 place-items-center rounded-full",
          "bg-lake-700 text-white shadow-e3 transition-all duration-300",
          "hover:bg-lake-800 hover:shadow-e3 focus-visible:outline-offset-4",
          "dark:bg-lake-400 dark:text-lake-950 dark:hover:bg-lake-300",
          open && "scale-90 rotate-90",
        )}
      >
        <Icon name={open ? "close" : "chat"} className="size-6" />
        {unread && !open && (
          <span className="absolute right-1 top-1 size-3 rounded-full bg-amber-400 ring-2 ring-lake-700 dark:ring-lake-400" />
        )}
      </button>

      {/* Panel */}
      <div
        id="cvc-chat-panel"
        ref={panelRef}
        role="dialog"
        aria-label="Chat with Champlain Valley Cleaning"
        aria-modal="false"
        className={cn(
          "fixed bottom-24 right-5 z-[60] flex w-[calc(100vw-2.5rem)] max-w-[23rem] flex-col",
          "overflow-hidden rounded-card border border-border-base bg-surface shadow-e3",
          "origin-bottom-right transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0",
        )}
        style={{ height: "min(32rem, calc(100vh - 8.5rem))" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border-base bg-surface-2 px-4 py-3">
          <span className="relative">
            <LogoMark className="size-8" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-pine-500 ring-2 ring-surface-2" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text">
              Champlain Valley Cleaning
            </p>
            <p className="text-xs text-text-subtle">
              Typically replies within a few minutes
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="grid size-8 place-items-center rounded-full text-text-subtle transition-colors hover:bg-surface hover:text-text"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        {/* Transcript */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
        >
          {messages.map((m, i) => (
            <Bubble key={i} message={m} />
          ))}

          {typing && (
            <div className="flex items-end gap-2">
              <LogoMark className="size-6 shrink-0" />
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-text-subtle"
                    style={{
                      animation: "blink 1.3s ease-in-out infinite",
                      animationDelay: `${i * 0.16}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {messages.length <= 1 && !typing && (
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-lake-500 hover:bg-lake-50 hover:text-lake-800 dark:hover:bg-lake-950 dark:hover:text-lake-200"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="border-t border-border-base bg-surface px-3 py-3"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about a quote, services, hours…"
              aria-label="Message"
              className="min-w-0 flex-1 rounded-full bg-surface-2 px-4 py-2.5 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-lake-500"
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              aria-label="Send message"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-lake-700 text-white transition-colors hover:bg-lake-800 disabled:opacity-40 dark:bg-lake-400 dark:text-lake-950"
            >
              <Icon name="send" className="size-4" />
            </button>
          </div>
          <p className="mt-2 px-1 text-center text-2xs text-text-subtle">
            Prefer a human?{" "}
            <a href={site.phoneHref} className="underline hover:text-text-muted">
              {site.phone}
            </a>{" "}
            ·{" "}
            <Link href="/contact" className="underline hover:text-text-muted">
              Request a quote
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

function Bubble({ message }: { message: Message }) {
  const mine = message.role === "visitor";

  return (
    <div className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
      {!mine && <LogoMark className="size-6 shrink-0" />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          mine
            ? "rounded-br-sm bg-lake-700 text-white dark:bg-lake-400 dark:text-lake-950"
            : "rounded-bl-sm bg-surface-2 text-text",
        )}
      >
        <p className="whitespace-pre-line">{message.body}</p>

        {message.actions && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-lake-800 ring-1 ring-border-strong transition-colors hover:bg-lake-50 dark:bg-stone-900 dark:text-lake-300 dark:hover:bg-stone-800"
              >
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
