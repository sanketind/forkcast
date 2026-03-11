import type { WeatherSignal } from "@forkcast/domain";

type OwmForecastEntry = {
  dt: number;
  dt_txt: string;
  main: { temp: number; temp_max: number; temp_min: number };
  weather: { main: string; description: string }[];
  rain?: { "3h"?: number };
  pop: number; // probability of precipitation 0–1
};

type OwmForecastResponse = {
  list: OwmForecastEntry[];
  cod: string;
  message?: string;
};

const CITY_ALIASES: Record<string, string> = {
  bengaluru: "Bengaluru,IN",
  bangalore: "Bengaluru,IN",
  mumbai: "Mumbai,IN",
  bombay: "Mumbai,IN",
  delhi: "New Delhi,IN",
  "new delhi": "New Delhi,IN",
  hyderabad: "Hyderabad,IN",
  chennai: "Chennai,IN",
  madras: "Chennai,IN",
  kolkata: "Kolkata,IN",
  calcutta: "Kolkata,IN",
  pune: "Pune,IN",
  ahmedabad: "Ahmedabad,IN",
  jaipur: "Jaipur,IN",
  surat: "Surat,IN",
  lucknow: "Lucknow,IN",
  kochi: "Kochi,IN",
  cochin: "Kochi,IN",
  chandigarh: "Chandigarh,IN",
  bhopal: "Bhopal,IN",
  indore: "Indore,IN",
  nagpur: "Nagpur,IN",
  patna: "Patna,IN",
  guwahati: "Guwahati,IN"
};

function resolveCity(city: string): string {
  const key = city.toLowerCase().trim();
  return CITY_ALIASES[key] ?? `${city},IN`;
}

/**
 * Seasonal heuristic fallback when no API key is set or the API call fails.
 * Better than a single hardcoded value — uses city + month-based estimates.
 */
function heuristicWeather(city: string, targetDate: string): WeatherSignal {
  const month = new Date(targetDate).getUTCMonth() + 1;
  const key = city.toLowerCase();

  const isMonsoonCoastal = ["mumbai", "kochi", "cochin", "goa", "mangaluru"].some((c) =>
    key.includes(c)
  );
  const isNorthIndian = ["delhi", "lucknow", "jaipur", "chandigarh", "patna", "agra"].some((c) =>
    key.includes(c)
  );

  let maxTempC: number;
  let rainfallMm: number;

  if (isNorthIndian) {
    maxTempC = [17, 20, 28, 35, 40, 40, 37, 34, 33, 30, 23, 17][month - 1];
    rainfallMm = [5, 5, 8, 5, 8, 55, 190, 200, 120, 15, 5, 5][month - 1];
  } else if (isMonsoonCoastal) {
    maxTempC = [31, 32, 33, 33, 32, 30, 29, 29, 30, 31, 31, 31][month - 1];
    rainfallMm = [5, 2, 3, 10, 55, 580, 620, 340, 280, 100, 25, 10][month - 1];
  } else {
    // Default: Deccan plateau (Bengaluru / Hyderabad / Pune)
    maxTempC = [26, 28, 31, 33, 33, 29, 27, 27, 27, 27, 25, 24][month - 1];
    rainfallMm = [5, 8, 12, 40, 110, 85, 110, 130, 195, 170, 55, 15][month - 1];
  }

  const dailyRainfall = Math.round(rainfallMm / 30);
  return {
    date: targetDate,
    condition: dailyRainfall > 8 ? "rain" : dailyRainfall > 3 ? "cloudy" : "clear",
    maxTempC,
    rainfallMm: dailyRainfall
  };
}

/**
 * Fetch real weather for a target date via OpenWeatherMap free-tier forecast API.
 * Falls back to seasonal heuristic when OPENWEATHERMAP_API_KEY is absent or on error.
 */
export async function getWeatherSignal(city: string, targetDate: string): Promise<WeatherSignal> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return heuristicWeather(city, targetDate);
  }

  try {
    const q = encodeURIComponent(resolveCity(city));
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=${apiKey}&units=metric&cnt=40`;

    const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);

    if (!res.ok) {
      console.warn(`[weather] OWM ${res.status} for "${city}", using heuristic`);
      return heuristicWeather(city, targetDate);
    }

    const data = (await res.json()) as OwmForecastResponse;

    // Filter entries that fall on the target date (OWM returns UTC dt_txt like "2026-03-11 15:00:00")
    const targetPrefix = targetDate; // "YYYY-MM-DD"
    const dayEntries = data.list.filter((e) => e.dt_txt.startsWith(targetPrefix));

    if (dayEntries.length === 0) {
      // Target date out of 5-day window — use heuristic
      return heuristicWeather(city, targetDate);
    }

    const maxTempC = Math.max(...dayEntries.map((e) => e.main.temp_max));
    const totalRainMm = dayEntries.reduce((sum, e) => sum + (e.rain?.["3h"] ?? 0), 0);
    const hasRain = dayEntries.some(
      (e) => e.weather[0]?.main === "Rain" || e.weather[0]?.main === "Drizzle"
    );
    const hasClouds = dayEntries.some((e) => e.weather[0]?.main === "Clouds");

    const condition: WeatherSignal["condition"] = hasRain
      ? "rain"
      : hasClouds
        ? "cloudy"
        : "clear";

    return {
      date: targetDate,
      condition,
      maxTempC: Math.round(maxTempC * 10) / 10,
      rainfallMm: Math.round(totalRainMm * 10) / 10
    };
  } catch (err) {
    console.warn(`[weather] OWM fetch failed for "${city}":`, err);
    return heuristicWeather(city, targetDate);
  }
}
