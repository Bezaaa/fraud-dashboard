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

interface Props {
  data: Transaction[];
}

const riskColor = {
  High:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)" },
  Low:    { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)" },
};

export default function TransactionTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
            {["ID", "Amount", "Device", "Browser", "Risk", "Score", "Time"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((tx, i) => {
            const rc = riskColor[tx.risk_level];
            return (
              <tr
                key={tx.id}
                style={{
                  borderBottom: i < data.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--primary)" }}>{tx.id}</td>
                <td className="px-4 py-3 text-white font-medium">${tx.purchase_value.toFixed(2)}</td>
                <td className="px-4 py-3 capitalize" style={{ color: "var(--foreground)" }}>{tx.device_type}</td>
                <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>{tx.browser}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2.5 py-1 rounded-full border font-medium"
                    style={{ color: rc.color, background: rc.bg, borderColor: rc.border }}>
                    {tx.risk_level}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm" style={{ color: rc.color }}>
                  {Math.round(tx.fraud_probability * 100)}%
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
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
