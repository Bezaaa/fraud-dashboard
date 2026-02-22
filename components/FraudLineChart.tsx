"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface DataPoint { hour: string; fraud: number; legitimate: number; }

export default function FraudLineChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ left: -8, right: 8, top: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--red)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--red)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--green)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--green)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="hour" tick={{ fill: "var(--muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border)" }} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "var(--card)", border: "1px solid var(--border-strong)",
            borderRadius: 12, fontSize: 12, color: "var(--fg)",
          }}
          labelStyle={{ color: "var(--fg)", marginBottom: 4 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12, color: "var(--muted2)" }} />
        <Area type="monotone" dataKey="fraud" stroke="var(--red)" strokeWidth={2}
          fill="url(#fraudGrad)" name="Fraud" dot={false} />
        <Area type="monotone" dataKey="legitimate" stroke="var(--green)" strokeWidth={2}
          fill="url(#legitGrad)" name="Legitimate" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
