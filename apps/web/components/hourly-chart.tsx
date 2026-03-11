"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  hourlyOrders: number[];
};

const SLOT_LABELS = ["11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm"];

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
        background: "rgba(10, 24, 44, 0.96)",
        border: "1px solid rgba(155, 190, 255, 0.2)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "0.82rem"
      }}
    >
      <p style={{ color: "#9cb0ce", margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
      <p style={{ color: "#edf4ff", margin: 0 }}>
        <strong>{payload[0].value}</strong> orders
      </p>
    </div>
  );
}

export function HourlyChart({ hourlyOrders }: Props) {
  const orders = hourlyOrders.slice(0, 10);
  const peakIdx = orders.indexOf(Math.max(...orders));

  const data = orders.map((count, i) => ({
    hour: SLOT_LABELS[i] ?? `${11 + i}`,
    orders: count,
    isPeak: i === peakIdx
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barCategoryGap="35%">
        <XAxis
          dataKey="hour"
          tick={{ fill: "#9cb0ce", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#9cb0ce", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(155,190,255,0.05)" }} />
        <Bar dataKey="orders" radius={[5, 5, 0, 0]} isAnimationActive={true} animationDuration={600}>
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={entry.isPeak ? "#4ad9a7" : "rgba(155,190,255,0.22)"}
              stroke={entry.isPeak ? "rgba(74,217,167,0.5)" : "none"}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
