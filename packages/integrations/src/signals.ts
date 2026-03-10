import type { ForecastInput } from "@forkcast/domain";

import { getIndiaCalendarSignal } from "./calendar";
import { getWeatherSignal } from "./weather";

export async function buildForecastSignals(
  input: ForecastInput,
  city: string
): Promise<ForecastInput> {
  const calendar = getIndiaCalendarSignal(input.targetDate, city);
  const weather = await getWeatherSignal(city, input.targetDate);

  return {
    ...input,
    calendar,
    weather
  };
}

export function buildFeatureSummary(input: ForecastInput) {
  return {
    date: input.targetDate,
    dayOfWeek: new Date(input.targetDate).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
    holiday: input.calendar.holidayName ?? null,
    festival: input.calendar.festivalName ?? null,
    fastingType: input.calendar.fastingType ?? null,
    examPressure: input.calendar.examPressure ?? "low",
    localEvent: input.calendar.localEventTitle ?? null,
    rainfallMm: input.weather.rainfallMm,
    maxTempC: input.weather.maxTempC
  };
}
