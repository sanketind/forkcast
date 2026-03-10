import { buildRecommendationBundle, demoForecastInput } from "@forkcast/domain";
import { getIndiaCalendarSignal, getWeatherSignal } from "@forkcast/integrations";
import { DashboardClient } from "@/components/dashboard-client";
import { getOutletProfile } from "@/lib/demo-state";

export default async function DashboardPage() {
  const outlet = await getOutletProfile();
  const calendar = getIndiaCalendarSignal(demoForecastInput.targetDate, outlet.city);
  const weather = await getWeatherSignal(outlet.city, demoForecastInput.targetDate);

  const bundle = buildRecommendationBundle({
    ...demoForecastInput,
    calendar,
    weather
  });

  return (
    <div className="grid gap-6">
      <DashboardClient bundle={bundle} outletName={outlet.outletName} />
    </div>
  );
}
