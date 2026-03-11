export type SalesDay = {
  date: string;
  revenue: number;
  orders: number;
  covers: number;
  hourlyOrders: number[];
  skuMix: Record<string, number>;
};

export type RecipeIngredient = {
  name: string;
  unit: string;
  quantityPerOrder: number;
  currentStock: number;
};

export type MenuRecipe = {
  sku: string;
  itemName: string;
  prepMinutes: number;
  ingredients: RecipeIngredient[];
};

export type CalendarSignal = {
  date: string;
  holidayName?: string;
  festivalName?: string;
  fastingType?: string;
  examPressure?: "low" | "medium" | "high";
  localEventTitle?: string;
  localEventImpact?: number;
};

export type WeatherSignal = {
  date: string;
  condition: "clear" | "cloudy" | "rain" | "storm";
  maxTempC: number;
  rainfallMm: number;
};

export type ForecastInput = {
  salesHistory: SalesDay[];
  calendar: CalendarSignal;
  weather: WeatherSignal;
  recipes: MenuRecipe[];
  targetDate: string;
};

export type DailyForecast = {
  targetDate: string;
  predictedRevenue: number;
  predictedOrders: number;
  confidenceLow: number;
  confidenceHigh: number;
  skuForecast: Record<string, number>;
  hourlyOrders: number[];
  reasons: string[];
};

export type ShoppingLine = {
  ingredient: string;
  quantityToBuy: number;
  unit: string;
  projectedUsage: number;
  rationale: string;
};

export type StaffingRecommendation = {
  shiftStartHour: number;
  shiftEndHour: number;
  cooksNeeded: number;
  serviceStaffNeeded: number;
  rationale: string;
};

export type ActionCard = {
  title: string;
  category: "inventory" | "staffing" | "promotion" | "supply";
  priority: number;
  expectedImpact: string;
  explanation: string;
  urgencyDays?: number;
};

export type RecommendationBundle = {
  forecast: DailyForecast;
  shoppingList: ShoppingLine[];
  staffing: StaffingRecommendation;
  actionCards: ActionCard[];
  supplyAlerts: SupplyAlert[];
};

// ── Supply Intelligence ────────────────────────────────────────────────────────

export type SupplySignalType =
  | "price_spike"
  | "shortage_warning"
  | "import_disruption"
  | "price_drop";

export type SupplySeverity = "low" | "medium" | "high" | "critical";

export type SupplySignal = {
  commodity: string;
  signalType: SupplySignalType;
  severity: SupplySeverity;
  region: string[];
  headline: string;
  daysUntilImpact: number;
  confidence: number;
  source: "newsapi" | "agmarknet" | "manual";
};

export type SupplyAlert = {
  commodity: string;
  affectedIngredients: string[];
  severity: SupplySeverity;
  daysUntilImpact: number;
  recommendation: string;
  estimatedCostImpact: string;
  headline: string;
};
