import type { CalendarSignal } from "@forkcast/domain";

const indiaHolidayMap: Record<string, string> = {
  "2026-03-11": "Ekadashi",
  "2026-03-14": "Holi Weekend",
  "2026-04-14": "Tamil New Year",
  "2026-08-15": "Independence Day"
};

const regionalFestivalMap: Record<string, string> = {
  "2026-03-11": "Temple Rush",
  "2026-03-14": "Holi Parties"
};

const examPressureByMonth: Record<number, CalendarSignal["examPressure"]> = {
  2: "medium",
  3: "high",
  10: "medium"
};

export function getIndiaCalendarSignal(targetDate: string, city: string): CalendarSignal {
  const date = new Date(targetDate);
  const month = date.getUTCMonth() + 1;
  const signal: CalendarSignal = {
    date: targetDate,
    holidayName: indiaHolidayMap[targetDate],
    festivalName: regionalFestivalMap[targetDate],
    fastingType: targetDate === "2026-03-11" ? "Ekadashi" : undefined,
    examPressure: examPressureByMonth[month] ?? "low"
  };

  if (city.toLowerCase().includes("bengaluru")) {
    signal.localEventTitle = "College Fest Circuit";
    signal.localEventImpact = month === 3 ? 2 : 1;
  }

  return signal;
}
