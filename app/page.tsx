"use client";
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import TransactionTable from "@/components/TransactionTable";
import FraudLineChart from "@/components/FraudLineChart";
import { generateMockHistory } from "@/lib/fraudModel";

// Generate consistent mock data server-side
const history = generateMockHistory(14);
const fraudCount = history.filter((t) => t.is_fraud).length;
const fraudRate = ((fraudCount / history.length) * 100).toFixed(1);
const avgScore = (history.reduce((s, t) => s + t.fraud_probability, 0) / history.length * 100).toFixed(1);

// Build hourly chart data
const chartData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${String(i * 2).padStart(2, "0")}:00`,
  fraud: Math.floor(Math.random() * 8 + 1),
  legitimate: Math.floor(Math.random() * 30 + 10),
}));

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Transaction Overview</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Real-time fraud monitoring — last 14 transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Transactions"
          value={String(history.length)}
          sub="last session"
          color="indigo"
          icon={<Activity size={16} />}
        />
        <StatsCard
          title="Fraud Detected"
          value={String(fraudCount)}
          sub={`${fraudRate}% fraud rate`}
          color="red"
          icon={<AlertTriangle size={16} />}
        />
        <StatsCard
          title="Legitimate"
          value={String(history.length - fraudCount)}
          sub="cleared transactions"
          color="green"
          icon={<CheckCircle size={16} />}
        />
        <StatsCard
          title="Avg Risk Score"
          value={`${avgScore}%`}
          sub="across all transactions"
          color="yellow"
          icon={<TrendingUp size={16} />}
        />
      </div>

      {/* Chart */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <h2 className="text-sm font-semibold text-white mb-4">
          Fraud vs Legitimate — 24h Window
        </h2>
        <FraudLineChart data={chartData} />
      </div>

      {/* Table */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Recent Transactions</h2>
        <TransactionTable data={history} />
      </div>
    </div>
  );
}
