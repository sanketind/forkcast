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
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        fontSize: "var(--text-sm)",
        minWidth: "160px",
        boxShadow: "var(--shadow-md)"
      }}
    >
      <p style={{ color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 600 }}>{label}</p>
      {actual && (
        <p style={{ color: "var(--text)", margin: "3px 0" }}>
          Actual: <strong>{formatRevenue(actual.value)}</strong>
        </p>
      )}
      {forecast && (
        <p style={{ color: "var(--teal)", margin: "3px 0" }}>
          Forecast: <strong>{formatRevenue(forecast.value)}</strong>
        </p>
      )}
      {bandHigh && bandLow && (
        <p style={{ color: "var(--text-tertiary)", margin: "3px 0", fontSize: "var(--text-xs)" }}>
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
          {/* Historical actuals gradient — indigo (#6B73FF) */}
          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(107,115,255,0.18)" />
            <stop offset="95%" stopColor="rgba(107,115,255,0.01)" />
          </linearGradient>
          {/* Forecast gradient — teal (#00A699) */}
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(0,166,153,0.18)" />
            <stop offset="95%" stopColor="rgba(0,166,153,0.01)" />
          </linearGradient>
          {/* Confidence band gradient — subtle teal */}
          <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,166,153,0.08)" />
            <stop offset="100%" stopColor="rgba(0,166,153,0.01)" />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="2 4"
          stroke="rgba(0,0,0,0.06)"
          vertical={false}
        />

        <XAxis
          dataKey="label"
          tick={{ fill: "#717171", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />

        <YAxis
          tickFormatter={formatRevenue}
          tick={{ fill: "#717171", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[minY, "auto"]}
          width={52}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,0,0,0.08)", strokeWidth: 1 }} />

        {/* Confidence band — bandHigh fills down, bandLow fills with white to erase below */}
        <Area dataKey="bandHigh" fill="url(#bandGrad)" stroke="none" isAnimationActive={false} />
        <Area dataKey="bandLow" fill="#FFFFFF" stroke="none" isAnimationActive={false} />

        {/* Historical actuals — indigo */}
        <Area
          dataKey="actual"
          fill="url(#actualGrad)"
          stroke="#6B73FF"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#6B73FF", stroke: "none" }}
          isAnimationActive={true}
          animationDuration={600}
        />

        {/* Tomorrow forecast — teal */}
        <Area
          dataKey="forecast"
          fill="url(#forecastGrad)"
          stroke="#00A699"
          strokeWidth={2.5}
          strokeDasharray="5 3"
          dot={{ fill: "#00A699", r: 5, stroke: "#FFFFFF", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#00A699" }}
          isAnimationActive={true}
          animationDuration={800}
        />

        {/* "Tomorrow" divider */}
        <ReferenceLine
          x={tomorrowLabel}
          stroke="rgba(0,166,153,0.35)"
          strokeDasharray="4 3"
          label={{
            value: "tomorrow →",
            fill: "rgba(0,166,153,0.7)",
            fontSize: 10,
            position: "insideTopLeft"
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
