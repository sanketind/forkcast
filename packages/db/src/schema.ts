import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

export const recommendationStatus = pgEnum("recommendation_status", [
  "draft",
  "accepted",
  "dismissed"
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  primaryRegion: varchar("primary_region", { length: 120 }).notNull().default("India"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const outlets = pgTable("outlets", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  ownerUserId: integer("owner_user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  state: varchar("state", { length: 120 }).notNull(),
  cuisine: varchar("cuisine", { length: 120 }).notNull(),
  seats: integer("seats").notNull().default(40),
  whatsappNumber: varchar("whatsapp_number", { length: 30 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  sku: varchar("sku", { length: 80 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isTopSku: boolean("is_top_sku").notNull().default(false)
}, (table) => ({
  outletSkuUnique: uniqueIndex("menu_items_outlet_sku_idx").on(table.outletId, table.sku)
}));

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  unit: varchar("unit", { length: 24 }).notNull(),
  currentStock: numeric("current_stock", { precision: 10, scale: 2 }).notNull().default("0")
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItems.id).notNull(),
  ingredientId: integer("ingredient_id").references(() => ingredients.id).notNull(),
  quantityPerOrder: numeric("quantity_per_order", { precision: 10, scale: 2 }).notNull()
});

export const salesDays = pgTable("sales_days", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  businessDate: date("business_date").notNull(),
  grossRevenue: numeric("gross_revenue", { precision: 12, scale: 2 }).notNull(),
  totalOrders: integer("total_orders").notNull(),
  covers: integer("covers").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
  outletBusinessDateUnique: uniqueIndex("sales_days_outlet_date_idx").on(table.outletId, table.businessDate)
}));

export const salesOrders = pgTable("sales_orders", {
  id: serial("id").primaryKey(),
  salesDayId: integer("sales_day_id").references(() => salesDays.id).notNull(),
  posOrderId: varchar("pos_order_id", { length: 120 }).notNull(),
  orderHour: integer("order_hour").notNull(),
  revenue: numeric("revenue", { precision: 10, scale: 2 }).notNull(),
  covers: integer("covers").notNull().default(1)
});

export const salesOrderItems = pgTable("sales_order_items", {
  id: serial("id").primaryKey(),
  salesOrderId: integer("sales_order_id").references(() => salesOrders.id).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItems.id).notNull(),
  quantity: integer("quantity").notNull(),
  lineRevenue: numeric("line_revenue", { precision: 10, scale: 2 }).notNull()
});

export const weatherDaily = pgTable("weather_daily", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  signalDate: date("signal_date").notNull(),
  condition: varchar("condition", { length: 40 }).notNull(),
  maxTempC: numeric("max_temp_c", { precision: 5, scale: 2 }).notNull(),
  rainfallMm: numeric("rainfall_mm", { precision: 8, scale: 2 }).notNull()
});

export const localEvents = pgTable("local_events", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  eventDate: date("event_date").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  eventType: varchar("event_type", { length: 80 }).notNull(),
  impactScore: integer("impact_score").notNull().default(1),
  notes: text("notes")
});

export const holidayFlags = pgTable("holiday_flags", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  signalDate: date("signal_date").notNull(),
  holidayName: varchar("holiday_name", { length: 160 }).notNull(),
  region: varchar("region", { length: 120 }).notNull(),
  isFestival: boolean("is_festival").notNull().default(false)
});

export const fastingFlags = pgTable("fasting_flags", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  signalDate: date("signal_date").notNull(),
  fastingType: varchar("fasting_type", { length: 120 }).notNull(),
  audience: varchar("audience", { length: 120 }).notNull(),
  expectedDemandShift: numeric("expected_demand_shift", { precision: 5, scale: 2 }).notNull()
});

export const onboardingMappings = pgTable("onboarding_mappings", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  externalItemName: varchar("external_item_name", { length: 160 }).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItems.id).notNull(),
  confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull().default("1.00")
});

export const dailyForecasts = pgTable("daily_forecasts", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  forecastDate: date("forecast_date").notNull(),
  predictedRevenue: numeric("predicted_revenue", { precision: 12, scale: 2 }).notNull(),
  predictedOrders: integer("predicted_orders").notNull(),
  confidenceLow: numeric("confidence_low", { precision: 12, scale: 2 }).notNull(),
  confidenceHigh: numeric("confidence_high", { precision: 12, scale: 2 }).notNull(),
  reasoning: jsonb("reasoning").$type<string[]>().notNull().default([])
});

export const staffingRecommendations = pgTable("staffing_recommendations", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  forecastDate: date("forecast_date").notNull(),
  shiftStartHour: integer("shift_start_hour").notNull(),
  shiftEndHour: integer("shift_end_hour").notNull(),
  cooksNeeded: integer("cooks_needed").notNull(),
  serviceStaffNeeded: integer("service_staff_needed").notNull(),
  rationale: text("rationale").notNull(),
  status: recommendationStatus("status").notNull().default("draft")
});

export const shoppingRecommendations = pgTable("shopping_recommendations", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  forecastDate: date("forecast_date").notNull(),
  ingredientId: integer("ingredient_id").references(() => ingredients.id).notNull(),
  quantityToBuy: numeric("quantity_to_buy", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 24 }).notNull(),
  rationale: text("rationale").notNull(),
  status: recommendationStatus("status").notNull().default("draft")
});

export const actionCards = pgTable("action_cards", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id).notNull(),
  forecastDate: date("forecast_date").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  priority: integer("priority").notNull().default(1),
  category: varchar("category", { length: 60 }).notNull(),
  explanation: text("explanation").notNull(),
  expectedImpact: varchar("expected_impact", { length: 160 }).notNull(),
  status: recommendationStatus("status").notNull().default("draft")
});

export const supplyAlertStatus = pgEnum("supply_alert_status", ["new", "snoozed", "dismissed"]);

export const supplyAlerts = pgTable("supply_alerts", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id),
  commodity: varchar("commodity", { length: 80 }).notNull(),
  signalType: varchar("signal_type", { length: 60 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  headline: text("headline").notNull(),
  recommendation: text("recommendation").notNull(),
  estimatedCostImpact: text("estimated_cost_impact").notNull(),
  affectedIngredients: jsonb("affected_ingredients").$type<string[]>().notNull().default([]),
  daysUntilImpact: integer("days_until_impact").notNull().default(7),
  confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull().default("0.60"),
  status: supplyAlertStatus("status").notNull().default("new"),
  region: jsonb("region").$type<string[]>().notNull().default([]),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export type DbSchema = {
  users: typeof users;
  tenants: typeof tenants;
  outlets: typeof outlets;
  menuItems: typeof menuItems;
  ingredients: typeof ingredients;
  recipes: typeof recipes;
  salesDays: typeof salesDays;
  salesOrders: typeof salesOrders;
  salesOrderItems: typeof salesOrderItems;
  weatherDaily: typeof weatherDaily;
  localEvents: typeof localEvents;
  holidayFlags: typeof holidayFlags;
  fastingFlags: typeof fastingFlags;
  onboardingMappings: typeof onboardingMappings;
  dailyForecasts: typeof dailyForecasts;
  staffingRecommendations: typeof staffingRecommendations;
  shoppingRecommendations: typeof shoppingRecommendations;
  actionCards: typeof actionCards;
  supplyAlerts: typeof supplyAlerts;
};
