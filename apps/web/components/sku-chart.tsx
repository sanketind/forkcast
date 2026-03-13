"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type Props = {
  skuForecast: Record<string, number>;
};

type TooltipPayload = { value: number };

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
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "10px 14px",
        fontSize: "var(--text-sm)",
        boxShadow: "var(--shadow-md)"
      }}
    >
      <p style={{ color: "var(--text-secondary)", margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
      <p style={{ color: "var(--text)", margin: 0 }}>
        <strong>{payload[0].value}</strong> orders expected
      </p>
    </div>
  );
}

export function SkuChart({ skuForecast }: Props) {
  const entries = Object.entries(skuForecast)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxOrders = Math.max(...entries.map(([, v]) => v));

  const data = entries.map(([name, orders]) => ({
    name: name.length > 22 ? name.slice(0, 20) + "…" : name,
    orders,
    isTop: orders === maxOrders
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 12, bottom: 0, left: 4 }}
        barCategoryGap="28%"
      >
        <XAxis
          type="number"
          tick={{ fill: "#717171", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#222222", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={140}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Bar dataKey="orders" radius={[0, 5, 5, 0]} isAnimationActive={true} animationDuration={600}>
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={entry.isTop ? "#00A699" : "rgba(107,115,255,0.25)"}
              stroke={entry.isTop ? "rgba(0,166,153,0.4)" : "none"}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
