"use server";

import { cookies } from "next/headers";
import { OUTLET_COOKIE, getOutletProfile } from "./demo-state";
import type { OutletProfile } from "./demo-state";

export async function saveOutletProfile(formData: FormData) {
  const current = await getOutletProfile();

  const payload: OutletProfile = {
    ...current,
    outletName: String(formData.get("outletName") ?? current.outletName),
    city: String(formData.get("city") ?? current.city),
    state: String(formData.get("state") ?? current.state),
    cuisine: String(formData.get("cuisine") ?? current.cuisine),
    seats: Number(formData.get("seats") ?? current.seats),
    whatsappNumber: String(formData.get("whatsappNumber") ?? current.whatsappNumber ?? "")
  };

  const cookieStore = await cookies();
  cookieStore.set(OUTLET_COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}

export async function saveOutletId(outletId: number) {
  const current = await getOutletProfile();
  const cookieStore = await cookies();
  cookieStore.set(OUTLET_COOKIE, JSON.stringify({ ...current, outletId }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}
