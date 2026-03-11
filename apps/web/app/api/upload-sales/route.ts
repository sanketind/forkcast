import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

import type { PosCsvRow } from "@forkcast/integrations";
import {
  getDb,
  ingredients,
  menuItems,
  onboardingMappings,
  outlets,
  recipes,
  salesDays,
  salesOrderItems,
  salesOrders,
  tenants,
  users
} from "@forkcast/db";

type IngredientMapping = {
  sku: string;
  itemName: string;
  ingredientText: string;
};

type UploadBody = {
  rows: PosCsvRow[];
  mappings: IngredientMapping[];
  outletProfile: {
    outletName: string;
    city: string;
    state: string;
    cuisine: string;
    seats: number;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UploadBody;
    const { rows, mappings, outletProfile } = body;

    if (!rows || rows.length === 0) {
      return Response.json({ error: "No rows provided." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionRaw = cookieStore.get("forkcast_session")?.value;
    const session = sessionRaw
      ? (JSON.parse(sessionRaw) as { userName: string; email: string })
      : { userName: "Demo Owner", email: "demo@forkcast.in" };

    const db = getDb();

    // 1. Upsert user by email
    const existingUsers = await db.select({ id: users.id }).from(users).where(eq(users.email, session.email)).limit(1);

    let userId: number;
    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      const [newUser] = await db
        .insert(users)
        .values({ email: session.email, name: session.userName, passwordHash: "demo-placeholder" })
        .returning({ id: users.id });
      userId = newUser.id;
    }

    // 2. Ensure a tenant exists (one global demo tenant per user)
    let tenantId: number;
    const existingTenants = await db.select({ id: tenants.id }).from(tenants).limit(1);
    if (existingTenants.length > 0) {
      tenantId = existingTenants[0].id;
    } else {
      const [newTenant] = await db
        .insert(tenants)
        .values({ name: "Demo Kitchens India", primaryRegion: "India" })
        .returning({ id: tenants.id });
      tenantId = newTenant.id;
    }

    // 3. Upsert outlet (one outlet per user in demo mode)
    let outletId: number;
    const existingOutlets = await db
      .select({ id: outlets.id })
      .from(outlets)
      .where(eq(outlets.ownerUserId, userId))
      .limit(1);

    if (existingOutlets.length > 0) {
      outletId = existingOutlets[0].id;
      await db
        .update(outlets)
        .set({
          name: outletProfile.outletName,
          city: outletProfile.city,
          state: outletProfile.state,
          cuisine: outletProfile.cuisine,
          seats: outletProfile.seats
        })
        .where(eq(outlets.id, outletId));
    } else {
      const [newOutlet] = await db
        .insert(outlets)
        .values({
          tenantId,
          ownerUserId: userId,
          name: outletProfile.outletName,
          city: outletProfile.city,
          state: outletProfile.state,
          cuisine: outletProfile.cuisine,
          seats: outletProfile.seats
        })
        .returning({ id: outlets.id });
      outletId = newOutlet.id;
    }

    // 4. Upsert menu items from unique SKUs
    const uniqueSkus = new Map<string, { sku: string; itemName: string; totalRevenue: number; totalQty: number }>();
    for (const row of rows) {
      const existing = uniqueSkus.get(row.sku);
      if (existing) {
        existing.totalRevenue += row.lineRevenue;
        existing.totalQty += row.quantity;
      } else {
        uniqueSkus.set(row.sku, { sku: row.sku, itemName: row.itemName, totalRevenue: row.lineRevenue, totalQty: row.quantity });
      }
    }

    const menuItemIdMap = new Map<string, number>(); // sku → menuItemId
    for (const { sku, itemName, totalRevenue, totalQty } of uniqueSkus.values()) {
      const avgPrice = totalQty > 0 ? totalRevenue / totalQty : 0;

      const existing = await db
        .select({ id: menuItems.id })
        .from(menuItems)
        .where(and(eq(menuItems.outletId, outletId), eq(menuItems.sku, sku)))
        .limit(1);

      let menuItemId: number;
      if (existing.length > 0) {
        menuItemId = existing[0].id;
        await db.update(menuItems).set({ name: itemName }).where(eq(menuItems.id, menuItemId));
      } else {
        const [newItem] = await db
          .insert(menuItems)
          .values({
            outletId,
            sku,
            name: itemName,
            category: "food",
            price: avgPrice.toFixed(2),
            isTopSku: true
          })
          .returning({ id: menuItems.id });
        menuItemId = newItem.id;
      }

      menuItemIdMap.set(sku, menuItemId);

      // Record onboarding mapping (external POS name → internal menu item)
      const existingMapping = await db
        .select({ id: onboardingMappings.id })
        .from(onboardingMappings)
        .where(and(eq(onboardingMappings.outletId, outletId), eq(onboardingMappings.externalItemName, itemName)))
        .limit(1);

      if (existingMapping.length === 0) {
        await db.insert(onboardingMappings).values({
          outletId,
          externalItemName: itemName,
          menuItemId,
          confidence: "1.00"
        });
      }
    }

    // 5. Aggregate rows by businessDate
    const byDate = new Map<
      string,
      { revenue: number; orders: number; hourlyGroups: Map<number, PosCsvRow[]> }
    >();

    for (const row of rows) {
      const day = byDate.get(row.businessDate) ?? {
        revenue: 0,
        orders: 0,
        hourlyGroups: new Map<number, PosCsvRow[]>()
      };
      day.revenue += row.lineRevenue;
      day.orders += row.quantity;
      const hourRows = day.hourlyGroups.get(row.orderHour) ?? [];
      hourRows.push(row);
      day.hourlyGroups.set(row.orderHour, hourRows);
      byDate.set(row.businessDate, day);
    }

    // 6. Upsert salesDays + salesOrders + salesOrderItems
    for (const [date, agg] of byDate.entries()) {
      const covers = Math.ceil(agg.orders * 1.15);

      const existingDay = await db
        .select({ id: salesDays.id })
        .from(salesDays)
        .where(and(eq(salesDays.outletId, outletId), eq(salesDays.businessDate, date)))
        .limit(1);

      let salesDayId: number;
      if (existingDay.length > 0) {
        salesDayId = existingDay[0].id;
        await db
          .update(salesDays)
          .set({ grossRevenue: agg.revenue.toFixed(2), totalOrders: agg.orders, covers })
          .where(eq(salesDays.id, salesDayId));
      } else {
        const [newDay] = await db
          .insert(salesDays)
          .values({
            outletId,
            businessDate: date,
            grossRevenue: agg.revenue.toFixed(2),
            totalOrders: agg.orders,
            covers
          })
          .returning({ id: salesDays.id });
        salesDayId = newDay.id;
      }

      // One synthetic salesOrder per (date, hour) group
      for (const [hour, hourRows] of agg.hourlyGroups.entries()) {
        const posOrderId = `csv-${date}-${hour}`;
        const orderRevenue = hourRows.reduce((sum, r) => sum + r.lineRevenue, 0);

        const existingOrder = await db
          .select({ id: salesOrders.id })
          .from(salesOrders)
          .where(and(eq(salesOrders.salesDayId, salesDayId), eq(salesOrders.posOrderId, posOrderId)))
          .limit(1);

        let salesOrderId: number;
        if (existingOrder.length > 0) {
          salesOrderId = existingOrder[0].id;
        } else {
          const [newOrder] = await db
            .insert(salesOrders)
            .values({
              salesDayId,
              posOrderId,
              orderHour: hour,
              revenue: orderRevenue.toFixed(2),
              covers: 1
            })
            .returning({ id: salesOrders.id });
          salesOrderId = newOrder.id;
        }

        // One salesOrderItem per CSV row in this hour
        for (const row of hourRows) {
          const menuItemId = menuItemIdMap.get(row.sku);
          if (!menuItemId) continue;

          const existingItem = await db
            .select({ id: salesOrderItems.id })
            .from(salesOrderItems)
            .where(and(eq(salesOrderItems.salesOrderId, salesOrderId), eq(salesOrderItems.menuItemId, menuItemId)))
            .limit(1);

          if (existingItem.length === 0) {
            await db.insert(salesOrderItems).values({
              salesOrderId,
              menuItemId,
              quantity: row.quantity,
              lineRevenue: row.lineRevenue.toFixed(2)
            });
          }
        }
      }
    }

    // 7. Create ingredients + recipes from ingredient mappings
    for (const mapping of mappings) {
      const menuItemId = menuItemIdMap.get(mapping.sku);
      if (!menuItemId) continue;

      const ingredientNames = mapping.ingredientText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      for (const ingName of ingredientNames) {
        const existingIng = await db
          .select({ id: ingredients.id })
          .from(ingredients)
          .where(and(eq(ingredients.outletId, outletId), eq(ingredients.name, ingName)))
          .limit(1);

        let ingredientId: number;
        if (existingIng.length > 0) {
          ingredientId = existingIng[0].id;
        } else {
          const [newIng] = await db
            .insert(ingredients)
            .values({ outletId, name: ingName, unit: "kg", currentStock: "0" })
            .returning({ id: ingredients.id });
          ingredientId = newIng.id;
        }

        const existingRecipe = await db
          .select({ id: recipes.id })
          .from(recipes)
          .where(
            and(
              eq(recipes.outletId, outletId),
              eq(recipes.menuItemId, menuItemId),
              eq(recipes.ingredientId, ingredientId)
            )
          )
          .limit(1);

        if (existingRecipe.length === 0) {
          await db.insert(recipes).values({
            outletId,
            menuItemId,
            ingredientId,
            quantityPerOrder: "0.10"
          });
        }
      }
    }

    return Response.json({
      success: true,
      outletId,
      daysUploaded: byDate.size,
      rowsProcessed: rows.length
    });
  } catch (error) {
    console.error("[upload-sales] error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}
