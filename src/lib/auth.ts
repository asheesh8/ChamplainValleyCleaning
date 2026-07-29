import "server-only";

import { cookies } from "next/headers";

export const SESSION_COOKIE = "cvc_session";

const previewAdminUser = {
  id: "preview-admin",
  email: "admin@champlainvalleycleaning.com",
  name: "Admin",
  role: "owner",
  lastLoginAt: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

export async function getCurrentUser() {
  return previewAdminUser;
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function requireUser() {
  return previewAdminUser;
}
