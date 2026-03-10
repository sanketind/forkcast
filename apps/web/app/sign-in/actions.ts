"use server";

import { redirect } from "next/navigation";

import { createSession } from "@/lib/session";

export async function signInAction(formData: FormData) {
  await createSession(formData);
  redirect("/onboarding");
}
