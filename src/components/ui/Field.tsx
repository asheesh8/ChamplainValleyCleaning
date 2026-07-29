import { cn } from "@/lib/utils";

const control =
  "w-full rounded-field bg-surface px-3.5 py-2.5 text-[0.9375rem] text-text " +
  "ring-1 ring-inset ring-border-strong placeholder:text-text-subtle " +
  "transition-shadow focus:ring-2 focus:ring-lake-500 focus:outline-none " +
  "disabled:opacity-60 aria-[invalid=true]:ring-red-500";

export function Label({
  children,
  htmlFor,
  hint,
  required,
}: {
  children: React.ReactNode;
  htmlFor: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2">
      <span className="text-sm font-medium text-text">
        {children}
        {required && (
          <span className="text-red-600 dark:text-red-400" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </span>
      {hint && <span className="text-xs text-text-subtle">{hint}</span>}
    </label>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(control, "min-h-28 resize-y", className)} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, "appearance-none pr-9", className)} {...props}>
      {children}
    </select>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{children}</p>
  );
}
