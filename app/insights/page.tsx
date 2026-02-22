"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BrainCircuit } from "lucide-react";

const models = [
  { name: "XGBoost",       auc: 0.96, f1: 0.89, precision: 0.91, recall: 0.87 },
  { name: "Random Forest", auc: 0.94, f1: 0.86, precision: 0.88, recall: 0.84 },
  { name: "Log. Reg.",     auc: 0.88, f1: 0.79, precision: 0.82, recall: 0.76 },
];

const featureImportance = [
  { feature: "Account Age",    importance: 0.31 },
  { feature: "Purchase Value", importance: 0.24 },
  { feature: "Hour of Day",    importance: 0.15 },
  { feature: "Device Type",    importance: 0.10 },
  { feature: "Traffic Source", importance: 0.08 },
  { feature: "Browser",        importance: 0.06 },
  { feature: "Day of Week",    importance: 0.04 },
  { feature: "User Age",       importance: 0.02 },
];

const cm = { tp: 876, fp: 24, fn: 13, tn: 87 };

const metricColors = {
  AUC: "var(--primary)",
  F1: "var(--green)",
  Precision: "var(--cyan)",
  Recall: "var(--yellow)",
};

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", border: "1px solid var(--border)" }}>
        <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--primary)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "var(--primary-glow)", color: "var(--primary)", border: "1px solid var(--primary)40" }}>
            <BrainCircuit size={11} /> Model Diagnostics
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--fg)" }}>
            Model <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--muted2)" }}>
            Performance benchmarks and feature analysis from the fraud detection ML pipeline.
          </p>
        </div>
      </div>

      {/* Model comparison */}
      <div className="glow-card p-6">
        <h2 className="font-semibold mb-6" style={{ color: "var(--fg)" }}>Model Comparison</h2>
        <div className="grid grid-cols-3 gap-4">
          {models.map((m, mi) => (
            <div key={m.name} className="rounded-xl p-5 space-y-4 relative overflow-hidden"
              style={{ background: mi === 0 ? "var(--primary-glow)" : "var(--surface)",
                border: `1px solid ${mi === 0 ? "var(--primary)40" : "var(--border)"}` }}>
              {mi === 0 && (
                <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "var(--primary)", color: "white" }}>Best</span>
              )}
              <p className="font-bold text-sm" style={{ color: "var(--fg)" }}>{m.name}</p>
              {(["AUC", "F1", "Precision", "Recall"] as const).map((k) => {
                const val = { AUC: m.auc, F1: m.f1, Precision: m.precision, Recall: m.recall }[k];
                const col = metricColors[k];
                return (
                  <div key={k}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "var(--muted)" }}>{k}</span>
                      <span className="font-mono font-bold" style={{ color: col }}>{val.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--border-strong)" }}>
                      <div className="h-full rounded-full" style={{ width: `${val * 100}%`, background: col }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Feature importance */}
        <div className="glow-card p-6">
          <h2 className="font-semibold mb-1" style={{ color: "var(--fg)" }}>Feature Importance</h2>
          <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>Global SHAP values — XGBoost</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={featureImportance} layout="vertical" margin={{ left: 8, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 10 }}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis type="category" dataKey="feature" width={98}
                tick={{ fill: "var(--fg)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border-strong)",
                borderRadius: 10, fontSize: 12, color: "var(--fg)" }}
                formatter={(v: number | undefined) => [`${((v ?? 0) * 100).toFixed(1)}%`, "Importance"]} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {featureImportance.map((_, i) => (
                  <Cell key={i} fill="var(--primary)" fillOpacity={1 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion matrix */}
        <div className="glow-card p-6">
          <h2 className="font-semibold mb-1" style={{ color: "var(--fg)" }}>Confusion Matrix</h2>
          <p className="text-xs mb-6" style={{ color: "var(--muted)" }}>XGBoost · n = 1,000 samples</p>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2 text-xs mb-1" style={{ color: "var(--muted)" }}>
              <div className="w-20" />
              <div className="w-28 text-center font-semibold">Pred: Legit</div>
              <div className="w-28 text-center font-semibold">Pred: Fraud</div>
            </div>
            {[
              { label: "Actual:\nLegit", vals: [cm.tn, cm.fp], cols: ["var(--green)", "var(--red)"] },
              { label: "Actual:\nFraud", vals: [cm.fn, cm.tp], cols: ["var(--red)", "var(--green)"] },
            ].map((row, ri) => (
              <div key={ri} className="flex gap-2 items-center">
                <div className="w-20 text-right pr-2 text-xs leading-tight whitespace-pre" style={{ color: "var(--muted)" }}>
                  {row.label}
                </div>
                {row.vals.map((val, ci) => (
                  <div key={ci} className="w-28 h-20 rounded-xl flex flex-col items-center justify-center"
                    style={{ background: `${row.cols[ci]}15`, border: `1px solid ${row.cols[ci]}35`, color: row.cols[ci] }}>
                    <span className="text-2xl font-extrabold font-mono">{val}</span>
                    <span className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--muted)" }}>
                      {(val / 1000 * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-5 text-xs" style={{ color: "var(--muted)" }}>
            <span>Accuracy: <strong style={{ color: "var(--green)" }}>{((cm.tp + cm.tn) / 10).toFixed(1)}%</strong></span>
            <span>FPR: <strong style={{ color: "var(--red)" }}>{(cm.fp / (cm.fp + cm.tn) * 100).toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
