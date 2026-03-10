import type { WeatherSignal } from "@forkcast/domain";

export async function getWeatherSignal(city: string, targetDate: string): Promise<WeatherSignal> {
  const month = new Date(targetDate).getUTCMonth() + 1;
  const isMonsoonCity = ["mumbai", "bengaluru", "kochi"].some((name) =>
    city.toLowerCase().includes(name)
  );

  const rainfallMm = isMonsoonCity && month >= 6 && month <= 9 ? 18 : month === 3 ? 14 : 3;
  const maxTempC = city.toLowerCase().includes("delhi") ? 35 : 29;

  return {
    date: targetDate,
    condition: rainfallMm > 10 ? "rain" : "clear",
    maxTempC,
    rainfallMm
  };
}
