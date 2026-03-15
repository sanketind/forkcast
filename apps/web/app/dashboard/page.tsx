import { buildRecommendationBundle, buildSupplyAlerts, demoForecastInput } from "@forkcast/domain";
import {
  fetchMandiPrices,
  fetchSupplyNewsSignals,
  getIndiaCalendarSignal,
  getWeatherSignal,
  TRACKED_COMMODITIES
} from "@forkcast/integrations";
import { DashboardClient } from "@/components/dashboard-client";
import { getOutletProfile } from "@/lib/demo-state";
import { ForkcastIcon } from "@/components/logo";
import { getRecipesForOutlet, getSalesDaysForOutlet } from "@/lib/sales-db";
import { computeForecastAccuracy } from "@/lib/accuracy";

export default async function DashboardPage() {
  const outlet = await getOutletProfile();
  const targetDate = demoForecastInput.targetDate;

  const [calendar, weather] = await Promise.all([
    Promise.resolve(getIndiaCalendarSignal(targetDate, outlet.city)),
    getWeatherSignal(outlet.city, targetDate)
  ]);

  let salesHistory = demoForecastInput.salesHistory;
  let recipes = demoForecastInput.recipes;
  let isDemo = true;

  if (outlet.outletId) {
    try {
      const [realDays, realRecipes] = await Promise.all([
        getSalesDaysForOutlet(outlet.outletId),
        getRecipesForOutlet(outlet.outletId)
      ]);

      if (realDays.length >= 3) {
        salesHistory = realDays;
        isDemo = false;
      }
      if (realRecipes.length > 0) {
        recipes = realRecipes;
      }
    } catch (err) {
      console.error("[dashboard] DB query failed, falling back to demo data:", err);
    }
  }

  // Supply intelligence — fetch news + mandi price signals in parallel
  const [newsSignals, mandiOnion, mandiChicken] = await Promise.all([
    fetchSupplyNewsSignals(TRACKED_COMMODITIES, outlet.city).catch(() => []),
    fetchMandiPrices("Onion", outlet.state).catch(() => null),
    fetchMandiPrices("Chicken", outlet.state).catch(() => null)
  ]);

  const allSupplySignals = [
    ...newsSignals,
    ...[mandiOnion, mandiChicken].filter(Boolean) as typeof newsSignals
  ];
  const supplyAlerts = buildSupplyAlerts(allSupplySignals, recipes, outlet.city);

  const demandBundle = buildRecommendationBundle({ salesHistory, calendar, weather, recipes, targetDate });
  const bundle = { ...demandBundle, supplyAlerts };

  // Walk-forward accuracy validation (runs in parallel, silently skips on failure)
  const accuracyPoints = await computeForecastAccuracy(salesHistory, outlet.city, recipes).catch(() => []);

  return (
    <div className="grid gap-6">
      {isDemo && (
        <div className="demo-notice">
          <ForkcastIcon size={14} color="var(--amber)" />
          <span>
            Demo mode — showing sample data.{" "}
            <a href="/onboarding">Upload your POS data</a> to see real forecasts.
          </span>
        </div>
      )}
      <DashboardClient
        bundle={bundle}
        outletName={outlet.outletName}
        isDemo={isDemo}
        salesHistory={salesHistory}
        targetDate={targetDate}
        accuracyPoints={accuracyPoints}
      />
    </div>
  );
}
