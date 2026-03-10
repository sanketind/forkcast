import type { ForecastInput, MenuRecipe, SalesDay } from "./types";

const today = new Date("2026-03-10T00:00:00.000Z");

function dateOffset(days: number) {
  const copy = new Date(today);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy.toISOString().slice(0, 10);
}

export const demoSalesHistory: SalesDay[] = [
  {
    date: dateOffset(-7),
    revenue: 28200,
    orders: 121,
    covers: 146,
    hourlyOrders: [2, 3, 6, 11, 18, 22, 17, 14, 16, 12],
    skuMix: {
      "Chicken Biryani": 34,
      "Butter Chicken Bowl": 27,
      "Paneer Tikka Wrap": 22,
      "Masala Lemonade": 38
    }
  },
  {
    date: dateOffset(-6),
    revenue: 24850,
    orders: 108,
    covers: 132,
    hourlyOrders: [1, 2, 4, 10, 16, 18, 15, 12, 17, 13],
    skuMix: {
      "Chicken Biryani": 28,
      "Butter Chicken Bowl": 23,
      "Paneer Tikka Wrap": 20,
      "Masala Lemonade": 34
    }
  },
  {
    date: dateOffset(-5),
    revenue: 25980,
    orders: 113,
    covers: 140,
    hourlyOrders: [1, 3, 5, 9, 15, 21, 16, 13, 18, 12],
    skuMix: {
      "Chicken Biryani": 31,
      "Butter Chicken Bowl": 24,
      "Paneer Tikka Wrap": 19,
      "Masala Lemonade": 35
    }
  },
  {
    date: dateOffset(-4),
    revenue: 27120,
    orders: 118,
    covers: 142,
    hourlyOrders: [2, 2, 5, 10, 16, 22, 18, 14, 17, 12],
    skuMix: {
      "Chicken Biryani": 33,
      "Butter Chicken Bowl": 26,
      "Paneer Tikka Wrap": 21,
      "Masala Lemonade": 34
    }
  },
  {
    date: dateOffset(-3),
    revenue: 29310,
    orders: 126,
    covers: 152,
    hourlyOrders: [2, 4, 6, 12, 18, 23, 20, 16, 17, 12],
    skuMix: {
      "Chicken Biryani": 36,
      "Butter Chicken Bowl": 28,
      "Paneer Tikka Wrap": 22,
      "Masala Lemonade": 39
    }
  },
  {
    date: dateOffset(-2),
    revenue: 30150,
    orders: 129,
    covers: 156,
    hourlyOrders: [2, 5, 7, 12, 19, 24, 20, 15, 16, 9],
    skuMix: {
      "Chicken Biryani": 38,
      "Butter Chicken Bowl": 29,
      "Paneer Tikka Wrap": 20,
      "Masala Lemonade": 41
    }
  },
  {
    date: dateOffset(-1),
    revenue: 26500,
    orders: 115,
    covers: 137,
    hourlyOrders: [1, 3, 5, 10, 16, 20, 18, 14, 16, 12],
    skuMix: {
      "Chicken Biryani": 30,
      "Butter Chicken Bowl": 25,
      "Paneer Tikka Wrap": 21,
      "Masala Lemonade": 36
    }
  }
];

export const demoRecipes: MenuRecipe[] = [
  {
    sku: "CB-001",
    itemName: "Chicken Biryani",
    prepMinutes: 14,
    ingredients: [
      { name: "Chicken", unit: "kg", quantityPerOrder: 0.18, currentStock: 7 },
      { name: "Basmati Rice", unit: "kg", quantityPerOrder: 0.14, currentStock: 8 },
      { name: "Curd Marinade", unit: "kg", quantityPerOrder: 0.04, currentStock: 2.3 }
    ]
  },
  {
    sku: "BC-002",
    itemName: "Butter Chicken Bowl",
    prepMinutes: 12,
    ingredients: [
      { name: "Chicken", unit: "kg", quantityPerOrder: 0.16, currentStock: 7 },
      { name: "Butter Masala", unit: "kg", quantityPerOrder: 0.05, currentStock: 3 },
      { name: "Rice", unit: "kg", quantityPerOrder: 0.12, currentStock: 6 }
    ]
  },
  {
    sku: "PW-003",
    itemName: "Paneer Tikka Wrap",
    prepMinutes: 10,
    ingredients: [
      { name: "Paneer", unit: "kg", quantityPerOrder: 0.11, currentStock: 4.2 },
      { name: "Wrap Sheets", unit: "pcs", quantityPerOrder: 1, currentStock: 30 },
      { name: "Mint Chutney", unit: "kg", quantityPerOrder: 0.03, currentStock: 1.4 }
    ]
  }
];

export const demoForecastInput: ForecastInput = {
  salesHistory: demoSalesHistory,
  calendar: {
    date: dateOffset(1),
    fastingType: "Ekadashi",
    examPressure: "medium",
    localEventTitle: "College Fest",
    localEventImpact: 2
  },
  weather: {
    date: dateOffset(1),
    condition: "rain",
    maxTempC: 29,
    rainfallMm: 14
  },
  recipes: demoRecipes,
  targetDate: dateOffset(1)
};
