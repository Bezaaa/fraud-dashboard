"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { ShapValue } from "@/lib/fraudModel";

interface ShapChartProps {
  values: ShapValue[];
}

export default function ShapChart({ values }: ShapChartProps) {
  const data = values.slice(0, 8).map((v) => ({
    name: v.feature,
    impact: v.impact,
    value: v.value,
  }));

  return (
    <div>
      <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
        Positive bars push the score toward <span style={{ color: "#ef4444" }}>fraud</span>.
        Negative bars push toward <span style={{ color: "#22c55e" }}>legitimate</span>.
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 24, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            domain={[-1, 1]}
            tickFormatter={(v) => v.toFixed(1)}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fill: "var(--fg)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(val: any, _name: any, props: any) => [
              `Impact: ${(val ?? 0) > 0 ? "+" : ""}${(val ?? 0).toFixed(2)} | Value: ${props.payload.value}`,
              "Feature",
            ]}
          />
          <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.impact >= 0 ? "var(--red)" : "var(--green)"} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
