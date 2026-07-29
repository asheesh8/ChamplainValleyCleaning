import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { LogoMark } from "@/components/site/Logo";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-sunken px-5 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mx-auto flex w-fit items-center gap-2.5">
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="text-[0.95rem] font-semibold tracking-tight text-text">
              Champlain Valley
            </span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-lake-700 dark:text-lake-400">
              Cleaning
            </span>
          </span>
        </Link>

        <div className="mt-8 rounded-card border border-border-base bg-surface p-7 shadow-e2">
          <h1 className="text-xl font-semibold tracking-tight text-text">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Admin access for staff only.
          </p>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-text-subtle">
          <Link href="/" className="hover:text-text-muted">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
