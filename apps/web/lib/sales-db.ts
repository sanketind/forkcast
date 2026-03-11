import { desc, eq, inArray } from "drizzle-orm";

import type { MenuRecipe, SalesDay } from "@forkcast/domain";
import { getDb, ingredients, menuItems, recipes, salesDays, salesOrderItems, salesOrders } from "@forkcast/db";

export async function getSalesDaysForOutlet(outletId: number, limit = 30): Promise<SalesDay[]> {
  const db = getDb();

  const days = await db
    .select()
    .from(salesDays)
    .where(eq(salesDays.outletId, outletId))
    .orderBy(desc(salesDays.businessDate))
    .limit(limit);

  if (days.length === 0) return [];

  const dayIds = days.map((d) => d.id);

  const orders = await db
    .select()
    .from(salesOrders)
    .where(inArray(salesOrders.salesDayId, dayIds));

  const orderIds = orders.map((o) => o.id);

  const items =
    orderIds.length > 0
      ? await db
          .select({
            salesOrderId: salesOrderItems.salesOrderId,
            quantity: salesOrderItems.quantity,
            menuItemName: menuItems.name
          })
          .from(salesOrderItems)
          .innerJoin(menuItems, eq(salesOrderItems.menuItemId, menuItems.id))
          .where(inArray(salesOrderItems.salesOrderId, orderIds))
      : [];

  // Build lookup maps for efficient assembly
  const ordersByDayId = new Map<number, (typeof orders)[number][]>();
  for (const order of orders) {
    const list = ordersByDayId.get(order.salesDayId) ?? [];
    list.push(order);
    ordersByDayId.set(order.salesDayId, list);
  }

  const itemsByOrderId = new Map<number, (typeof items)[number][]>();
  for (const item of items) {
    const list = itemsByOrderId.get(item.salesOrderId) ?? [];
    list.push(item);
    itemsByOrderId.set(item.salesOrderId, list);
  }

  return days.map((day) => {
    const dayOrders = ordersByDayId.get(day.id) ?? [];

    // Hourly order volume (slots 0–9 = hours 11am–8pm)
    const hourlyOrders = Array(10).fill(0) as number[];
    for (const order of dayOrders) {
      const orderItems = itemsByOrderId.get(order.id) ?? [];
      const totalQty = orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const slot = order.orderHour - 11;
      if (slot >= 0 && slot < 10) hourlyOrders[slot] += totalQty;
    }

    // SKU mix: itemName → total units sold
    const skuMix: Record<string, number> = {};
    for (const order of dayOrders) {
      for (const item of itemsByOrderId.get(order.id) ?? []) {
        skuMix[item.menuItemName] = (skuMix[item.menuItemName] ?? 0) + item.quantity;
      }
    }

    const dateStr =
      typeof day.businessDate === "string"
        ? day.businessDate
        : (day.businessDate as Date).toISOString().slice(0, 10);

    return {
      date: dateStr,
      revenue: Number(day.grossRevenue),
      orders: day.totalOrders,
      covers: day.covers,
      hourlyOrders,
      skuMix
    } satisfies SalesDay;
  });
}

export async function getRecipesForOutlet(outletId: number): Promise<MenuRecipe[]> {
  const db = getDb();

  const rows = await db
    .select({
      sku: menuItems.sku,
      itemName: menuItems.name,
      ingredientName: ingredients.name,
      unit: ingredients.unit,
      currentStock: ingredients.currentStock,
      quantityPerOrder: recipes.quantityPerOrder
    })
    .from(recipes)
    .innerJoin(menuItems, eq(recipes.menuItemId, menuItems.id))
    .innerJoin(ingredients, eq(recipes.ingredientId, ingredients.id))
    .where(eq(recipes.outletId, outletId));

  const grouped = new Map<string, MenuRecipe>();

  for (const row of rows) {
    const existing = grouped.get(row.sku) ?? {
      sku: row.sku,
      itemName: row.itemName,
      prepMinutes: 12,
      ingredients: []
    };
    existing.ingredients.push({
      name: row.ingredientName,
      unit: row.unit,
      quantityPerOrder: Number(row.quantityPerOrder),
      currentStock: Number(row.currentStock)
    });
    grouped.set(row.sku, existing);
  }

  return [...grouped.values()];
}
