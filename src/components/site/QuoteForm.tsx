"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, FieldError } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

type ServiceOption = { slug: string; name: string };

type State = "idle" | "submitting" | "done";

export function QuoteForm({ services }: { services: ServiceOption[] }) {
  const params = useSearchParams();
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrors({});
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    // Drop empties so optional coercions (squareFeet) don't choke.
    for (const [k, v] of Object.entries(payload)) {
      if (v === "") delete payload[k];
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, source: "website" }),
      });

      if (res.ok) {
        setState("done");
        return;
      }

      const body = await res.json().catch(() => ({}));
      setErrors(body.fields ?? {});
      setFormError(body.error ?? "Something went wrong. Please try again.");
      setState("idle");
    } catch {
      setFormError(
        "We couldn't reach the server. Please try again, or call us directly.",
      );
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-card border border-pine-200 bg-pine-50 p-8 text-center dark:border-pine-900 dark:bg-pine-950">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-pine-600 text-white">
          <Icon name="check" className="size-6" />
        </span>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-text">
          Request received
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
          Thanks — we&apos;ve got it. You&apos;ll hear back within one business
          day. If it&apos;s urgent, calling is faster.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-6"
          onClick={() => setState("idle")}
        >
          Send another request
        </Button>
      </div>
    );
  }

  const busy = state === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && (
        <div
          role="alert"
          className="rounded-field border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          {formError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Your name
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
          />
          <FieldError>{errors.name}</FieldError>
        </div>

        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
          />
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
          <FieldError>{errors.phone}</FieldError>
        </div>

        <div>
          <Label htmlFor="company" hint="if applicable">
            Business name
          </Label>
          <Input id="company" name="company" autoComplete="organization" />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-text">
          What kind of property?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "commercial", label: "Commercial", icon: "building" },
            { value: "residential", label: "Residential", icon: "home" },
          ].map((opt, i) => (
            <label
              key={opt.value}
              className="relative flex cursor-pointer items-center gap-3 rounded-field bg-surface px-4 py-3 ring-1 ring-inset ring-border-strong transition-colors has-[:checked]:bg-lake-50 has-[:checked]:ring-2 has-[:checked]:ring-lake-600 dark:has-[:checked]:bg-lake-950"
            >
              <input
                type="radio"
                name="propertyType"
                value={opt.value}
                defaultChecked={i === 0}
                className="sr-only"
              />
              <Icon
                name={opt.icon}
                className="size-5 text-text-subtle peer-checked:text-lake-700"
              />
              <span className="text-sm font-medium text-text">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="serviceSlug">Service needed</Label>
          <Select
            id="serviceSlug"
            name="serviceSlug"
            defaultValue={params.get("service") ?? ""}
          >
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency">How often?</Label>
          <Select id="frequency" name="frequency" defaultValue="">
            <option value="">Not sure yet</option>
            <option value="one-time">One time</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every two weeks</option>
            <option value="monthly">Monthly</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="squareFeet" hint="approximate">
            Square footage
          </Label>
          <Input
            id="squareFeet"
            name="squareFeet"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="e.g. 2400"
          />
          <FieldError>{errors.squareFeet}</FieldError>
        </div>

        <div>
          <Label htmlFor="preferredDate">Ideal start</Label>
          <Input id="preferredDate" name="preferredDate" type="date" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Anything else we should know?</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Surfaces, problem areas, access hours, pets, anything unusual…"
        />
        <FieldError>{errors.message}</FieldError>
      </div>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Sending…" : "Request my quote"}
          {!busy && <Icon name="arrow" className="size-4" />}
        </Button>
        <p className="text-xs text-text-subtle">
          No obligation. We reply within one business day.
        </p>
      </div>
    </form>
  );
}
