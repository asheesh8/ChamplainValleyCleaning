import { site } from "@/lib/site";

export type Message = {
  role: "visitor" | "assistant";
  body: string;
  actions?: { label: string; href: string }[];
};

export const GREETING: Message = {
  role: "assistant",
  body: `Hi! I'm the ${site.shortName} assistant. I can help with quotes, services and scheduling — what do you need?`,
};

export const QUICK_REPLIES = [
  "Get a quote",
  "What do you clean?",
  "How much does it cost?",
  "Do you serve my town?",
];

/**
 * ============================================================================
 * INTEGRATION SEAM
 * ============================================================================
 * This is a deterministic keyword responder, NOT a language model. It exists so
 * the widget can be designed, reviewed and demoed without an API key, a bill,
 * or the risk of a model inventing prices for a real business.
 *
 * To go live:
 *   1. POST the transcript to `/api/chat` (route stub already exists).
 *   2. In that route, call the model with a system prompt built from the
 *      `services`, `site_settings` and `gallery_items` tables so answers stay
 *      grounded in what the owner actually published.
 *   3. Stream tokens back and append to `messages` in ChatWidget.
 *   4. Persist to the `conversations` / `chat_messages` tables (already
 *      modelled) so the owner can read transcripts in the admin.
 *
 * Guardrails worth keeping when you do: never quote a firm price, always offer
 * the phone number, and hand off to the quote form for anything binding.
 * ============================================================================
 */
export function scriptedReply(input: string): Message {
  const q = input.toLowerCase();

  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("quote", "estimate", "book", "schedule", "appointment")) {
    return {
      role: "assistant",
      body: "Happy to help. The quote form takes about a minute — square footage and how often you need us are the two things that matter most. We reply within one business day.",
      actions: [
        { label: "Open quote form", href: "/contact" },
        { label: "See services", href: "/services" },
      ],
    };
  }

  if (has("price", "cost", "rate", "how much", "pricing", "charge")) {
    return {
      role: "assistant",
      body: "Pricing depends on the space and the condition it's in. Carpet extraction starts at $149 a visit and a residential deep clean at $240 — but commercial work is always quoted after a walkthrough so you're not paying for a guess.",
      actions: [{ label: "Get an exact quote", href: "/contact" }],
    };
  }

  if (has("service", "what do you", "offer", "clean", "carpet", "floor", "window", "office")) {
    return {
      role: "assistant",
      body: "Commercial: janitorial, carpet and upholstery extraction, hard floor care (strip and wax), deep cleaning and disinfection, post-construction cleanup and interior glass.\n\nResidential: deep cleans and move-in/move-out turnovers. We don't do weekly housekeeping — homes are one-time deep cleans only.",
      actions: [{ label: "Browse all services", href: "/services" }],
    };
  }

  if (has("area", "town", "serve", "location", "where", "burlington", "travel", "near")) {
    return {
      role: "assistant",
      body: `We're based in ${site.address.locality}, ${site.address.region} and work across the Champlain Valley — ${site.serviceArea.slice(0, 5).join(", ")} and the surrounding towns. If you're a little further out, just ask.`,
      actions: [{ label: "Check with us", href: "/contact" }],
    };
  }

  if (has("hour", "open", "when", "availability", "weekend", "night")) {
    return {
      role: "assistant",
      body: "Office hours are Monday to Friday 7am–6pm and Saturday 8am–2pm. Commercial cleaning itself is usually done after hours or overnight so we're not in your way.",
      actions: [{ label: "Ask about a time", href: "/contact" }],
    };
  }

  if (has("insur", "bond", "licen", "safe", "trust", "background")) {
    return {
      role: "assistant",
      body: "Good question to ask any cleaner. For current insurance and licensing details, give us a call — we'll send documentation over directly.",
      actions: [{ label: `Call ${site.phone}`, href: site.phoneHref }],
    };
  }

  if (has("photo", "gallery", "portfolio", "work", "example", "before", "after")) {
    return {
      role: "assistant",
      body: "There are photos from real jobs on the site — floor care, restrooms and our extraction equipment.",
      actions: [{ label: "See our work", href: "/gallery" }],
    };
  }

  if (has("hello", "hi", "hey", "morning", "afternoon")) {
    return {
      role: "assistant",
      body: "Hey there. Tell me a bit about the space you need cleaned — commercial or residential, and roughly how big?",
    };
  }

  if (has("human", "person", "call", "phone", "talk", "speak")) {
    return {
      role: "assistant",
      body: `Of course — ${site.phone}, or email ${site.email}. Whichever's easier.`,
      actions: [{ label: `Call ${site.phone}`, href: site.phoneHref }],
    };
  }

  if (has("thank", "thanks", "cheers", "appreciate")) {
    return {
      role: "assistant",
      body: "Anytime. Anything else I can dig into?",
    };
  }

  return {
    role: "assistant",
    body: "I want to get that right rather than guess. The fastest path is the quote form or a quick call — either way you'll hear back within a business day.",
    actions: [
      { label: "Request a quote", href: "/contact" },
      { label: `Call ${site.phone}`, href: site.phoneHref },
    ],
  };
}
