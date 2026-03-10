import { NextResponse } from "next/server";

import { buildRecommendationBundle, demoForecastInput } from "@forkcast/domain";
import { getIndiaCalendarSignal, getWeatherSignal } from "@forkcast/integrations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "Bengaluru";
  const targetDate = searchParams.get("date") ?? demoForecastInput.targetDate;

  const calendar = getIndiaCalendarSignal(targetDate, city);
  const weather = await getWeatherSignal(city, targetDate);
  const bundle = buildRecommendationBundle({
    ...demoForecastInput,
    targetDate,
    calendar,
    weather
  });

  return NextResponse.json(bundle);
}
