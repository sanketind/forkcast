import type {
  ActionCard,
  DailyForecast,
  ForecastInput,
  RecommendationBundle,
  ShoppingLine,
  StaffingRecommendation
} from "./types";

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildDemandMultiplier(input: ForecastInput) {
  let multiplier = 1;
  const reasons: string[] = [];

  const target = new Date(input.targetDate).getUTCDay();
  if (target === 5 || target === 6) {
    multiplier += 0.12;
    reasons.push("Weekend demand usually lifts lunch and dinner covers.");
  }

  if (input.weather.condition === "rain") {
    multiplier += 0.08;
    reasons.push("Rain usually shifts more delivery and comfort-food demand.");
  }

  if (input.weather.maxTempC >= 33) {
    multiplier -= 0.04;
    reasons.push("High heat tends to soften dine-in lunch demand.");
  }

  if (input.calendar.localEventImpact) {
    multiplier += input.calendar.localEventImpact * 0.03;
    reasons.push(`Local event pressure adds nearby footfall for ${input.calendar.localEventTitle}.`);
  }

  if (input.calendar.examPressure === "high") {
    multiplier -= 0.08;
    reasons.push("Heavy exam schedules reduce dine-in traffic from students.");
  }

  if (input.calendar.examPressure === "medium") {
    multiplier -= 0.03;
    reasons.push("Medium exam pressure trims discretionary lunch visits.");
  }

  if (input.calendar.fastingType) {
    multiplier -= 0.06;
    reasons.push(`${input.calendar.fastingType} is likely to reduce non-veg demand tomorrow.`);
  }

  return { multiplier: clamp(multiplier, 0.75, 1.45), reasons };
}

function buildSkuForecast(baseOrders: number, input: ForecastInput) {
  const latestMix = input.salesHistory[input.salesHistory.length - 1]?.skuMix ?? {};
  const totalMix = Object.values(latestMix).reduce((sum, count) => sum + count, 0) || 1;

  return Object.fromEntries(
    Object.entries(latestMix).map(([name, count]) => [
      name,
      Math.max(1, Math.round((count / totalMix) * baseOrders))
    ])
  );
}

function buildHourlyPattern(input: ForecastInput, predictedOrders: number) {
  const hourlyAverages = Array.from({ length: 10 }, (_, index) =>
    average(input.salesHistory.map((day) => day.hourlyOrders[index] ?? 0))
  );
  const total = hourlyAverages.reduce((sum, value) => sum + value, 0) || 1;

  return hourlyAverages.map((value) => Math.max(1, Math.round((value / total) * predictedOrders)));
}

export function forecastTomorrow(input: ForecastInput): DailyForecast {
  const baseRevenue = average(input.salesHistory.map((day) => day.revenue));
  const baseOrders = average(input.salesHistory.map((day) => day.orders));
  const { multiplier, reasons } = buildDemandMultiplier(input);

  const predictedRevenue = Math.round(baseRevenue * multiplier);
  const predictedOrders = Math.round(baseOrders * multiplier);
  const confidenceBand = Math.round(predictedRevenue * 0.12);

  return {
    targetDate: input.targetDate,
    predictedRevenue,
    predictedOrders,
    confidenceLow: predictedRevenue - confidenceBand,
    confidenceHigh: predictedRevenue + confidenceBand,
    skuForecast: buildSkuForecast(predictedOrders, input),
    hourlyOrders: buildHourlyPattern(input, predictedOrders),
    reasons
  };
}

export function buildShoppingList(input: ForecastInput, forecast: DailyForecast): ShoppingLine[] {
  const skuEntries = Object.entries(forecast.skuForecast);
  const aggregated = new Map<string, ShoppingLine>();

  for (const recipe of input.recipes) {
    const matchingOrders =
      skuEntries.find(([itemName]) => itemName === recipe.itemName)?.[1] ?? Math.round(forecast.predictedOrders * 0.2);

    for (const ingredient of recipe.ingredients) {
      const projectedUsage = Number((matchingOrders * ingredient.quantityPerOrder).toFixed(2));
      const quantityToBuy = Math.max(0, Number((projectedUsage - ingredient.currentStock).toFixed(2)));

      const existing = aggregated.get(ingredient.name);
      if (existing) {
        existing.projectedUsage = Number((existing.projectedUsage + projectedUsage).toFixed(2));
        existing.quantityToBuy = Number((existing.quantityToBuy + quantityToBuy).toFixed(2));
        existing.rationale = `Combined recipe demand uses ${existing.projectedUsage}${ingredient.unit} across top SKUs.`;
      } else {
        aggregated.set(ingredient.name, {
          ingredient: ingredient.name,
          quantityToBuy,
          unit: ingredient.unit,
          projectedUsage,
          rationale: quantityToBuy > 0
            ? `Projected ${matchingOrders} orders will consume ${projectedUsage}${ingredient.unit}, above current stock.`
            : "Current stock is enough for tomorrow's projected demand."
        });
      }
    }
  }

  return [...aggregated.values()]
    .filter((line) => line.quantityToBuy > 0)
    .sort((left, right) => right.quantityToBuy - left.quantityToBuy);
}

export function buildStaffing(forecast: DailyForecast): StaffingRecommendation {
  const peakOrders = Math.max(...forecast.hourlyOrders);
  const peakIndex = forecast.hourlyOrders.findIndex((value) => value === peakOrders);
  const shiftStartHour = 11 + Math.max(0, peakIndex - 2);
  const shiftEndHour = shiftStartHour + 3;
  const cooksNeeded = clamp(Math.ceil(peakOrders / 8), 2, 6);
  const serviceStaffNeeded = clamp(Math.ceil(peakOrders / 10), 2, 5);

  return {
    shiftStartHour,
    shiftEndHour,
    cooksNeeded,
    serviceStaffNeeded,
    rationale: `Peak demand is expected around ${shiftStartHour + 2}:00 with about ${peakOrders} orders/hour.`
  };
}

export function buildActionCards(
  input: ForecastInput,
  forecast: DailyForecast,
  shoppingList: ShoppingLine[],
  staffing: StaffingRecommendation
): ActionCard[] {
  const cards: ActionCard[] = [];

  if (shoppingList[0]) {
    cards.push({
      title: `Order ${Math.ceil(shoppingList[0].quantityToBuy)} ${shoppingList[0].unit} ${shoppingList[0].ingredient}`,
      category: "inventory",
      priority: 1,
      expectedImpact: "Avoid stockouts during lunch and dinner peaks.",
      explanation: shoppingList[0].rationale
    });
  }

  cards.push({
    title: `Schedule ${staffing.cooksNeeded} cooks from ${staffing.shiftStartHour}:00-${staffing.shiftEndHour}:00`,
    category: "staffing",
    priority: 2,
    expectedImpact: "Protect service speed during the highest order window.",
    explanation: staffing.rationale
  });

  if (input.weather.condition === "rain" || input.calendar.localEventImpact) {
    cards.push({
      title: "Run a lunch combo promo on high-margin bowls",
      category: "promotion",
      priority: 3,
      expectedImpact: `Capture part of the projected ${forecast.predictedOrders} orders with a simple upsell.`,
      explanation: "Rain and local-event traffic make quick lunch bundles easier to convert."
    });
  }

  return cards.slice(0, 2);
}

export function buildRecommendationBundle(input: ForecastInput): RecommendationBundle {
  const forecast = forecastTomorrow(input);
  const shoppingList = buildShoppingList(input, forecast);
  const staffing = buildStaffing(forecast);
  const actionCards = buildActionCards(input, forecast, shoppingList, staffing);

  return {
    forecast,
    shoppingList,
    staffing,
    actionCards
  };
}
