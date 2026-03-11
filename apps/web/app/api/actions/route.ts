import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { actionCards, getDb } from "@forkcast/db";

const actionSchema = z.object({
  title: z.string().min(1).max(180),
  status: z.enum(["accepted", "dismissed"]),
  forecastDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = actionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { title, status, forecastDate } = parsed.data;

    // Read outletId from cookie
    const profileCookie = req.cookies.get("forkcast_outlet_profile");
    if (!profileCookie) {
      return NextResponse.json({ ok: true, stored: false });
    }

    let outletId: number | undefined;
    try {
      const profile = JSON.parse(profileCookie.value) as { outletId?: number };
      outletId = profile.outletId;
    } catch {
      return NextResponse.json({ ok: true, stored: false });
    }

    if (!outletId) {
      return NextResponse.json({ ok: true, stored: false });
    }

    const db = getDb();
    const dbStatus = status === "accepted" ? "accepted" : "dismissed";

    const existing = await db
      .select({ id: actionCards.id })
      .from(actionCards)
      .where(
        and(
          eq(actionCards.outletId, outletId),
          eq(actionCards.forecastDate, forecastDate),
          eq(actionCards.title, title)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(actionCards)
        .set({ status: dbStatus as "draft" | "accepted" | "dismissed" })
        .where(eq(actionCards.id, existing[0].id));
    } else {
      await db.insert(actionCards).values({
        outletId,
        forecastDate,
        title,
        priority: 1,
        category: "action",
        explanation: "",
        expectedImpact: "",
        status: dbStatus as "draft" | "accepted" | "dismissed"
      });
    }

    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[api/actions] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
