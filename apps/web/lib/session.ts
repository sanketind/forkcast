"use server";

import { cookies } from "next/headers";

export type DemoSession = {
  userName: string;
  email: string;
};

const SESSION_COOKIE = "forkcast_session";

export async function createSession(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const userName = String(formData.get("userName") ?? "Kitchen Owner").trim();

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    JSON.stringify({
      userName,
      email
    } satisfies DemoSession),
    { httpOnly: true, sameSite: "lax", path: "/" }
  );
}

export async function getSession(): Promise<DemoSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}
