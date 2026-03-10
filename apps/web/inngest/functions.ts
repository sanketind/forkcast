import { demoForecastInput } from "@forkcast/domain";
import { buildFeatureSummary, buildForecastSignals } from "@forkcast/integrations";

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
