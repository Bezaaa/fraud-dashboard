interface StatsCardProps {
  title: string;
  value: string;
  sub: string;
  color: "indigo" | "green" | "red" | "yellow";
  icon: React.ReactNode;
}

const colorMap = {
  indigo: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", text: "#6366f1" },
  green:  { bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.25)",  text: "#22c55e" },
  red:    { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)",  text: "#ef4444" },
  yellow: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", text: "#f59e0b" },
};

export default function StatsCard({ title, value, sub, color, icon }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: "var(--muted)" }}>{title}</span>
        <div className="p-2 rounded-lg border" style={{ background: c.bg, borderColor: c.border, color: c.text }}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{sub}</p>
      </div>
    </div>
  );
}
