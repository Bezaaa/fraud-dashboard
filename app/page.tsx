"use client";
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import TransactionTable from "@/components/TransactionTable";
import FraudLineChart from "@/components/FraudLineChart";
import { generateMockHistory } from "@/lib/fraudModel";

const history = generateMockHistory(14);
const fraudCount = history.filter((t) => t.is_fraud).length;
const fraudRate = ((fraudCount / history.length) * 100).toFixed(1);
const avgScore = ((history.reduce((s, t) => s + t.fraud_probability, 0) / history.length) * 100).toFixed(1);

const chartData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${String(i * 2).padStart(2, "0")}:00`,
  fraud: Math.floor(Math.random() * 8 + 1),
  legitimate: Math.floor(Math.random() * 30 + 10),
}));

export default function OverviewPage() {
  return (
    <div className="space-y-10">
      {/* Hero header */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", border: "1px solid var(--border)" }}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ background: "var(--cyan)" }}
        />
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "var(--primary-glow)", color: "var(--primary)", border: "1px solid var(--primary)40" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
            AI-Powered Analysis
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--fg)" }}>
            Transaction <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--muted2)" }}>
            Real-time fraud monitoring across all transactions. ML risk scoring with SHAP explainability.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Transactions" value={String(history.length)}
          sub="current session" accent="purple" icon={<Activity size={16} />} index={0} />
        <StatsCard title="Fraud Detected" value={String(fraudCount)}
          sub={`${fraudRate}% fraud rate`} accent="red" icon={<AlertTriangle size={16} />} index={1} />
        <StatsCard title="Legitimate" value={String(history.length - fraudCount)}
          sub="cleared transactions" accent="green" icon={<CheckCircle size={16} />} index={2} />
        <StatsCard title="Avg Risk Score" value={`${avgScore}%`}
          sub="across all transactions" accent="yellow" icon={<TrendingUp size={16} />} index={3} />
      </div>

      {/* Chart */}
      <div className="glow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold" style={{ color: "var(--fg)" }}>Fraud vs Legitimate</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>24-hour rolling window</p>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "var(--cyan-glow)", color: "var(--cyan)", border: "1px solid var(--cyan)40" }}
          >
            Live
          </span>
        </div>
        <FraudLineChart data={chartData} />
      </div>

      {/* Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: "var(--fg)" }}>Recent Transactions</h2>
          <span className="text-xs" style={{ color: "var(--muted)" }}>{history.length} records</span>
        </div>
        <TransactionTable data={history} />
      </div>
    </div>
  );
}
