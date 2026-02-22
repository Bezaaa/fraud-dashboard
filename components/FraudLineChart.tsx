"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface DataPoint {
  hour: string;
  fraud: number;
  legitimate: number;
}

interface Props {
  data: DataPoint[];
}

export default function FraudLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ left: -10, right: 10, top: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="hour" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "white" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} dot={false} name="Fraud" />
        <Line type="monotone" dataKey="legitimate" stroke="#22c55e" strokeWidth={2} dot={false} name="Legitimate" />
      </LineChart>
    </ResponsiveContainer>
  );
}
