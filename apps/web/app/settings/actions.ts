"use server";

import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getDb, outlets } from "@forkcast/db";
import { getOutletProfile } from "@/lib/demo-state";
import { saveOutletProfile } from "@/lib/outlet-actions";

export async function saveSettingsAction(formData: FormData) {
  // 1. Persist to cookie (works in demo mode too)
  await saveOutletProfile(formData);

  // 2. If a real outlet exists in DB, update it there as well
  const profile = await getOutletProfile();

  if (profile.outletId) {
    try {
      const db = getDb();
      const whatsapp = String(formData.get("whatsappNumber") ?? "").trim() || null;

      await db
        .update(outlets)
        .set({
          name: String(formData.get("outletName")),
          city: String(formData.get("city")),
          state: String(formData.get("state")),
          cuisine: String(formData.get("cuisine")),
          seats: Number(formData.get("seats")),
          whatsappNumber: whatsapp
        })
        .where(
          and(eq(outlets.id, profile.outletId))
        );
    } catch (err) {
      console.error("[settings] DB update failed:", err);
    }
  }

  redirect("/settings?saved=1");
}
