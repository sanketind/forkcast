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
  category: "inventory" | "staffing" | "promotion";
  priority: number;
  expectedImpact: string;
  explanation: string;
};

export type RecommendationBundle = {
  forecast: DailyForecast;
  shoppingList: ShoppingLine[];
  staffing: StaffingRecommendation;
  actionCards: ActionCard[];
};
