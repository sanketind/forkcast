import { cookies } from "next/headers";

export type OutletProfile = {
  outletName: string;
  city: string;
  state: string;
  cuisine: string;
  seats: number;
  whatsappNumber?: string;
  outletId?: number;
};

export const OUTLET_COOKIE = "forkcast_outlet_profile";

const DEFAULT_PROFILE: OutletProfile = {
  outletName: "FC Road Kitchen",
  city: "Pune",
  state: "Maharashtra",
  cuisine: "North Indian",
  seats: 42
};

export async function getOutletProfile(): Promise<OutletProfile> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(OUTLET_COOKIE)?.value;

  if (!raw) return DEFAULT_PROFILE;

  try {
    return JSON.parse(raw) as OutletProfile;
  } catch {
    return DEFAULT_PROFILE;
  }
}
