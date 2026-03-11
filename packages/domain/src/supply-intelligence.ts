import type { MenuRecipe, SupplyAlert, SupplySignal, SupplySeverity } from "./types";

// Maps commodity names to ingredient keywords present in recipes.
// An empty array means the commodity affects ALL items (e.g. cooking fuel).
const COMMODITY_INGREDIENT_KEYWORDS: Record<string, string[]> = {
  LPG: [],
  PNG: [],
  Chicken: ["chicken", "murgh", "poultry", "broiler"],
  Onion: ["onion", "pyaaz"],
  "Cooking Oil": ["oil", "ghee", "butter", "dalda"],
  Tomato: ["tomato", "tamatar"],
  Paneer: ["paneer", "cottage cheese", "chenna"],
  Rice: ["rice", "biryani", "pulao", "fried rice", "basmati"],
  Wheat: ["wheat", "flour", "atta", "roti", "naan", "paratha", "bread", "wrap"]
};

const SEVERITY_RANK: Record<SupplySeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

function matchesIngredient(ingredientName: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true; // fuel/utility — affects everything
  const lower = ingredientName.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function findAffectedIngredients(commodity: string, recipes: MenuRecipe[]): string[] {
  const keywords = COMMODITY_INGREDIENT_KEYWORDS[commodity] ?? [commodity.toLowerCase()];
  const affected = new Set<string>();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      if (matchesIngredient(ingredient.name, keywords)) {
        affected.add(ingredient.name);
      }
    }
  }

  // Fallback: if no recipes mapped, still surface the commodity itself
  if (affected.size === 0 && keywords.length === 0) {
    affected.add(commodity);
  }

  return [...affected];
}

function buildRecommendation(signal: SupplySignal, affectedIngredients: string[]): string {
  const { commodity, signalType, daysUntilImpact, severity } = signal;
  const urgency =
    daysUntilImpact <= 1
      ? "today — this is urgent"
      : daysUntilImpact <= 2
        ? "today"
        : daysUntilImpact <= 4
          ? "in the next 2 days"
          : `within ${daysUntilImpact} days`;

  if (commodity === "LPG" || commodity === "PNG") {
    const dealer = commodity === "PNG" ? "your piped-gas provider" : "your Indane/HP/Bharat dealer";
    if (signalType === "shortage_warning" || severity === "critical") {
      return `Call ${dealer} ${urgency} and stock 2–3 extra cylinders. Do not wait — shortage is imminent.`;
    }
    return `${commodity} prices are rising. Lock in your next order ${urgency} at current rates.`;
  }

  if (signalType === "shortage_warning") {
    const items = affectedIngredients.slice(0, 2).join(", ");
    return `Stock extra ${commodity}${items ? ` (used in ${items})` : ""} ${urgency}. Shortage likely in local markets.`;
  }

  if (signalType === "import_disruption") {
    return `Import disruption may restrict ${commodity} availability. Secure your supplier contract ${urgency}. Consider a substitute.`;
  }

  if (signalType === "price_drop") {
    return `${commodity} prices are falling — good time to stock up and build a buffer. Buy ${urgency}.`;
  }

  // price_spike (default)
  const items = affectedIngredients.slice(0, 2).join(" and ");
  return `Buy ${commodity}${items ? ` (for ${items})` : ""} ${urgency} before prices rise further. Consider 1.5–2× your normal order.`;
}

function estimateCostImpact(signal: SupplySignal, affectedIngredients: string[]): string {
  if (affectedIngredients.length === 0) return "Affects all cooking operations.";

  const pctMap: Record<SupplySeverity, string> = {
    critical: "30–50%",
    high: "20–30%",
    medium: "10–20%",
    low: "5–10%"
  };

  const pct = pctMap[signal.severity];

  if (signal.commodity === "LPG" || signal.commodity === "PNG") {
    return `Fuel costs could increase ${pct}. Daily operations at risk if supply runs out.`;
  }

  const items = affectedIngredients.slice(0, 2).join(", ");
  return `${items ? `Cost of ${items}` : `${signal.commodity} cost`} may rise ${pct} this week.`;
}

function isRegionRelevant(signal: SupplySignal, city: string): boolean {
  if (signal.region.includes("all India")) return true;
  const lowerCity = city.toLowerCase();
  return signal.region.some((r) => r.toLowerCase().includes(lowerCity) || lowerCity.includes(r.toLowerCase()));
}

export function buildSupplyAlerts(
  signals: SupplySignal[],
  recipes: MenuRecipe[],
  city: string
): SupplyAlert[] {
  const alerts: SupplyAlert[] = [];

  for (const signal of signals) {
    if (!isRegionRelevant(signal, city)) continue;
    if (signal.severity === "low" && signal.signalType === "price_spike") continue; // too noisy

    const affectedIngredients = findAffectedIngredients(signal.commodity, recipes);
    const recommendation = buildRecommendation(signal, affectedIngredients);
    const estimatedCostImpact = estimateCostImpact(signal, affectedIngredients);

    alerts.push({
      commodity: signal.commodity,
      affectedIngredients,
      severity: signal.severity,
      daysUntilImpact: signal.daysUntilImpact,
      recommendation,
      estimatedCostImpact,
      headline: signal.headline
    });
  }

  // Sort: critical first, then by days until impact (most urgent first)
  return alerts
    .sort(
      (a, b) =>
        SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
        a.daysUntilImpact - b.daysUntilImpact
    )
    .slice(0, 4); // Cap at 4 alerts to avoid alarm fatigue
}
