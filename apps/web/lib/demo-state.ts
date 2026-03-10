"use server";

import { cookies } from "next/headers";

export type OutletProfile = {
  outletName: string;
  city: string;
  state: string;
  cuisine: string;
  seats: number;
};

const OUTLET_COOKIE = "forkcast_outlet_profile";

export async function saveOutletProfile(formData: FormData) {
  const payload: OutletProfile = {
    outletName: String(formData.get("outletName") ?? "Koramangala Grill"),
    city: String(formData.get("city") ?? "Bengaluru"),
    state: String(formData.get("state") ?? "Karnataka"),
    cuisine: String(formData.get("cuisine") ?? "North Indian"),
    seats: Number(formData.get("seats") ?? 40)
  };

  const cookieStore = await cookies();
  cookieStore.set(OUTLET_COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}

export async function getOutletProfile(): Promise<OutletProfile> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(OUTLET_COOKIE)?.value;

  if (!raw) {
    return {
      outletName: "Koramangala Grill",
      city: "Bengaluru",
      state: "Karnataka",
      cuisine: "North Indian",
      seats: 42
    };
  }

  try {
    return JSON.parse(raw) as OutletProfile;
  } catch {
    return {
      outletName: "Koramangala Grill",
      city: "Bengaluru",
      state: "Karnataka",
      cuisine: "North Indian",
      seats: 42
    };
  }
}
