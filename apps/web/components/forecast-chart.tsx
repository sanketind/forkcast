"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { DailyForecast, SalesDay } from "@forkcast/domain";

type ChartPoint = {
  label: string;
  actual?: number;
  forecast?: number;
  bandHigh?: number;
  bandLow?: number;
  isToday: boolean;
};

type Props = {
  salesHistory: SalesDay[];
  forecast: DailyForecast;
  targetDate: string;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

function formatRevenue(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

function buildChartData(salesHistory: SalesDay[], forecast: DailyForecast, targetDate: string): ChartPoint[] {
  const points: ChartPoint[] = salesHistory.map((day) => ({
    label: formatDate(day.date),
    actual: day.revenue,
    isToday: false
  }));

  points.push({
    label: formatDate(targetDate),
    forecast: forecast.predictedRevenue,
    bandHigh: forecast.confidenceHigh,
    bandLow: forecast.confidenceLow,
    isToday: true
  });

  return points;
}

type TooltipPayload = {
  name: string;
  value: number;
  color: string;
};

function CustomTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const actual = payload.find((p) => p.name === "actual");
  const forecast = payload.find((p) => p.name === "forecast");
  const bandHigh = payload.find((p) => p.name === "bandHigh");
  const bandLow = payload.find((p) => p.name === "bandLow");

  return (
    <div
      style={{
        background: "rgba(10, 24, 44, 0.96)",
        border: "1px solid rgba(155, 190, 255, 0.2)",
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "0.82rem",
        minWidth: "160px"
      }}
    >
      <p style={{ color: "#9cb0ce", marginBottom: "8px", fontWeight: 600 }}>{label}</p>
      {actual && (
        <p style={{ color: "#edf4ff", margin: "3px 0" }}>
          Actual: <strong>{formatRevenue(actual.value)}</strong>
        </p>
      )}
      {forecast && (
        <p style={{ color: "#4ad9a7", margin: "3px 0" }}>
          Forecast: <strong>{formatRevenue(forecast.value)}</strong>
        </p>
      )}
      {bandHigh && bandLow && (
        <p style={{ color: "#9cb0ce", margin: "3px 0", fontSize: "0.78rem" }}>
          Range: {formatRevenue(bandLow.value)} – {formatRevenue(bandHigh.value)}
        </p>
      )}
    </div>
  );
}

export function ForecastChart({ salesHistory, forecast, targetDate }: Props) {
  const data = buildChartData(salesHistory, forecast, targetDate);
  const tomorrowLabel = formatDate(targetDate);

  const allValues = data.flatMap((d) =>
    [d.actual, d.bandLow].filter((v): v is number => v !== undefined)
  );
  const minY = Math.floor((Math.min(...allValues) * 0.9) / 1000) * 1000;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(155,190,255,0.35)" />
            <stop offset="95%" stopColor="rgba(155,190,255,0.02)" />
          </linearGradient>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(74,217,167,0.4)" />
            <stop offset="95%" stopColor="rgba(74,217,167,0.03)" />
          </linearGradient>
          <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(74,217,167,0.15)" />
            <stop offset="100%" stopColor="rgba(74,217,167,0.05)" />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(155,190,255,0.07)"
          vertical={false}
        />

        <XAxis
          dataKey="label"
          tick={{ fill: "#9cb0ce", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />

        <YAxis
          tickFormatter={formatRevenue}
          tick={{ fill: "#9cb0ce", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[minY, "auto"]}
          width={52}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(155,190,255,0.15)", strokeWidth: 1 }} />

        {/* Confidence band: bandHigh fills down, then bandLow masks up */}
        <Area
          dataKey="bandHigh"
          fill="url(#bandGrad)"
          stroke="none"
          isAnimationActive={false}
        />
        <Area
          dataKey="bandLow"
          fill="#07111f"
          stroke="none"
          isAnimationActive={false}
        />

        {/* Historical actuals */}
        <Area
          dataKey="actual"
          fill="url(#actualGrad)"
          stroke="rgba(155,190,255,0.5)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#9cb0ce", stroke: "none" }}
          isAnimationActive={true}
          animationDuration={600}
        />

        {/* Tomorrow forecast */}
        <Area
          dataKey="forecast"
          fill="url(#forecastGrad)"
          stroke="#4ad9a7"
          strokeWidth={2.5}
          strokeDasharray="5 3"
          dot={{ fill: "#4ad9a7", r: 5, stroke: "#07111f", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#4ad9a7" }}
          isAnimationActive={true}
          animationDuration={800}
        />

        {/* "Tomorrow" divider */}
        <ReferenceLine
          x={tomorrowLabel}
          stroke="rgba(74,217,167,0.3)"
          strokeDasharray="4 3"
          label={{
            value: "tomorrow →",
            fill: "rgba(74,217,167,0.7)",
            fontSize: 10,
            position: "insideTopLeft"
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
