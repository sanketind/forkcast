import { NextResponse } from "next/server";

import { demoForecastInput } from "@forkcast/domain";
import { buildFeatureSummary, buildForecastSignals } from "@forkcast/integrations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "Bengaluru";

  const input = await buildForecastSignals(demoForecastInput, city);

  return NextResponse.json({
    calendar: input.calendar,
    weather: input.weather,
    featureSummary: buildFeatureSummary(input)
  });
}
