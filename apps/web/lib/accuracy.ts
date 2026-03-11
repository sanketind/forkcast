import { forecastTomorrow } from "@forkcast/domain";
import type { MenuRecipe, SalesDay } from "@forkcast/domain";
import { getIndiaCalendarSignal, getWeatherSignal } from "@forkcast/integrations";

export type AccuracyPoint = {
  date: string;
  dayLabel: string;
  predicted: number;
  actual: number;
  accuracyPct: number;
};

/**
 * Walk-forward validation: for each day in salesHistory (starting from index 2),
 * compute what the model would have predicted using the preceding days,
 * then compare to the actual revenue. Returns the last 7 accuracy points.
 */
export async function computeForecastAccuracy(
  salesHistory: SalesDay[],
  city: string,
  recipes: MenuRecipe[] = []
): Promise<AccuracyPoint[]> {
  if (salesHistory.length < 3) return [];

  const points: AccuracyPoint[] = [];

  for (let i = 2; i < salesHistory.length; i++) {
    const targetDay = salesHistory[i];
    if (!targetDay.revenue) continue;

    const priorDays = salesHistory.slice(Math.max(0, i - 7), i);

    const calendar = getIndiaCalendarSignal(targetDay.date, city);
    const weather = await getWeatherSignal(city, targetDay.date);

    const result = forecastTomorrow({
      salesHistory: priorDays,
      calendar,
      weather,
      recipes,
      targetDate: targetDay.date
    });

    const error = Math.abs(result.predictedRevenue - targetDay.revenue);
    const accuracyPct = targetDay.revenue > 0
      ? Math.max(0, Math.round((1 - error / targetDay.revenue) * 100))
      : 0;

    const d = new Date(targetDay.date + "T00:00:00Z");
    const dayLabel = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC"
    });

    points.push({
      date: targetDay.date,
      dayLabel,
      predicted: result.predictedRevenue,
      actual: targetDay.revenue,
      accuracyPct
    });
  }

  return points.slice(-7);
}
