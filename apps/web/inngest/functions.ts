import { buildSupplyAlerts, demoForecastInput, demoRecipes } from "@forkcast/domain";
import {
  buildFeatureSummary,
  buildForecastSignals,
  fetchMandiPrices,
  fetchSupplyNewsSignals,
  TRACKED_COMMODITIES
} from "@forkcast/integrations";
import { eq } from "drizzle-orm";
import { getDb, outlets, supplyAlerts } from "@forkcast/db";

import { inngest } from "./client";

export const refreshDailySignals = inngest.createFunction(
  { id: "refresh-daily-signals" },
  { cron: "0 18 * * *" },
  async () => {
    const input = await buildForecastSignals(demoForecastInput, "Bengaluru");

    return {
      status: "ready",
      features: buildFeatureSummary(input)
    };
  }
);

export const refreshSupplySignals = inngest.createFunction(
  { id: "refresh-supply-signals" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    // 1. Fetch global supply news signals
    const newsSignals = await step.run("fetch-news-signals", () =>
      fetchSupplyNewsSignals(TRACKED_COMMODITIES, "India")
    );

    // 2. Fetch mandi price signals for key commodities (requires AGMARKNET_API_KEY)
    const mandiSignals = await step.run("fetch-mandi-prices", async () => {
      const results = await Promise.all([
        fetchMandiPrices("Onion", "Karnataka"),
        fetchMandiPrices("Tomato", "Karnataka"),
        fetchMandiPrices("Chicken", "Karnataka")
      ]);
      return results.filter(Boolean) as NonNullable<(typeof results)[number]>[];
    });

    const allSignals = [...newsSignals, ...mandiSignals];

    if (allSignals.length === 0) {
      return { status: "no-signals", signalsFound: 0 };
    }

    // 3. Persist critical + high signals to DB for all active outlets
    await step.run("persist-supply-alerts", async () => {
      const db = getDb();
      const activeOutlets = await db.select({ id: outlets.id, city: outlets.city }).from(outlets);

      for (const outlet of activeOutlets) {
        const alerts = buildSupplyAlerts(allSignals, demoRecipes, outlet.city);

        for (const alert of alerts) {
          if (alert.severity === "low") continue;

          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + alert.daysUntilImpact + 2);

          await db.insert(supplyAlerts).values({
            outletId: outlet.id,
            commodity: alert.commodity,
            signalType: allSignals.find((s) => s.commodity === alert.commodity)?.signalType ?? "price_spike",
            severity: alert.severity,
            headline: alert.headline,
            recommendation: alert.recommendation,
            estimatedCostImpact: alert.estimatedCostImpact,
            affectedIngredients: alert.affectedIngredients,
            daysUntilImpact: alert.daysUntilImpact,
            confidence: "0.60",
            region: allSignals.find((s) => s.commodity === alert.commodity)?.region ?? ["all India"],
            expiresAt
          });
        }
      }
    });

    // 4. Check for critical alerts — in Week 3 this will trigger WhatsApp notifications
    const criticalAlerts = allSignals.filter((s) => s.severity === "critical");
    const hasCritical = criticalAlerts.length > 0;

    return {
      status: "done",
      signalsFound: allSignals.length,
      criticalAlerts: criticalAlerts.map((s) => s.commodity),
      whatsappTriggered: hasCritical
    };
  }
);
