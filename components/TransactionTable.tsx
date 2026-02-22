"use client";

interface Transaction {
  id: string;
  purchase_value: number;
  device_type: string;
  browser: string;
  fraud_probability: number;
  risk_level: "High" | "Medium" | "Low";
  timestamp: string;
}

const riskStyles = {
  High:   { color: "var(--red)",    bg: "var(--red-glow)",    border: "rgba(244,63,94,0.3)"  },
  Medium: { color: "var(--yellow)", bg: "var(--yellow-glow)", border: "rgba(245,158,11,0.3)" },
  Low:    { color: "var(--green)",  bg: "var(--green-glow)",  border: "rgba(16,185,129,0.3)" },
};

const deviceIcon: Record<string, string> = {
  mobile: "📱", desktop: "🖥️", tablet: "⬛",
};

export default function TransactionTable({ data }: { data: Transaction[] }) {
  return (
    <div className="glow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Transaction", "Amount", "Device", "Score", "Risk", "Time"].map((h) => (
              <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((tx, i) => {
            const rs = riskStyles[tx.risk_level];
            const pct = Math.round(tx.fraud_probability * 100);
            return (
              <tr
                key={tx.id}
                className="transition-colors"
                style={{
                  borderBottom: i < data.length - 1 ? "1px solid var(--border)" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs font-semibold" style={{ color: "var(--cyan)" }}>
                    {tx.id}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--fg)" }}>
                  ${tx.purchase_value.toFixed(2)}
                </td>
                <td className="px-5 py-3.5" style={{ color: "var(--muted2)" }}>
                  <span className="flex items-center gap-1.5">
                    <span>{deviceIcon[tx.device_type] ?? "?"}</span>
                    <span className="capitalize text-xs">{tx.device_type}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full max-w-16" style={{ background: "var(--border-strong)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: rs.color }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: rs.color }}>{pct}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ color: rs.color, background: rs.bg, borderColor: rs.border }}
                  >
                    {tx.risk_level}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "var(--muted)" }}>
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
