"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Static model metrics — from the 10 Academy training results
const metrics = [
  { name: "XGBoost",      auc: 0.96, f1: 0.89, precision: 0.91, recall: 0.87 },
  { name: "Random Forest",auc: 0.94, f1: 0.86, precision: 0.88, recall: 0.84 },
  { name: "Log. Reg.",    auc: 0.88, f1: 0.79, precision: 0.82, recall: 0.76 },
];

const featureImportance = [
  { feature: "Account Age",     importance: 0.31 },
  { feature: "Purchase Value",  importance: 0.24 },
  { feature: "Hour of Day",     importance: 0.15 },
  { feature: "Device Type",     importance: 0.10 },
  { feature: "Traffic Source",  importance: 0.08 },
  { feature: "Browser",         importance: 0.06 },
  { feature: "Day of Week",     importance: 0.04 },
  { feature: "User Age",        importance: 0.02 },
];

// Confusion matrix for best model (XGBoost, normalised per 1000 samples)
const cm = { tp: 876, fp: 24, fn: 13, tn: 87 };

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Model Insights</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Performance metrics and feature analysis from the fraud detection ML pipeline.
        </p>
      </div>

      {/* Model Comparison */}
      <div className="rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h2 className="text-sm font-semibold text-white mb-5">Model Comparison</h2>
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div key={m.name} className="rounded-lg border p-4 space-y-3"
              style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs font-bold text-white">{m.name}</p>
              {[
                { label: "AUC-ROC", val: m.auc, color: "#6366f1" },
                { label: "F1 Score", val: m.f1, color: "#22c55e" },
                { label: "Precision", val: m.precision, color: "#f59e0b" },
                { label: "Recall", val: m.recall, color: "#ef4444" },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--muted)" }}>{label}</span>
                    <span style={{ color }} className="font-mono font-medium">{val.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${val * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div className="rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-sm font-semibold text-white mb-4">Global Feature Importance (SHAP)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={featureImportance} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis type="category" dataKey="feature" width={100} tick={{ fill: "var(--foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number | undefined) => [`${((v ?? 0) * 100).toFixed(1)}%`, "Importance"]} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {featureImportance.map((_, i) => (
                  <Cell key={i} fill="#6366f1" fillOpacity={1 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion Matrix */}
        <div className="rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-sm font-semibold text-white mb-4">Confusion Matrix (XGBoost, n=1000)</h2>
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <div className="w-24" />
              <div className="w-24 text-center">Predicted: Legit</div>
              <div className="w-24 text-center">Predicted: Fraud</div>
            </div>
            {[
              { label: "Actual: Legit", vals: [cm.tn, cm.fp], colors: ["#22c55e", "#ef4444"] },
              { label: "Actual: Fraud", vals: [cm.fn, cm.tp], colors: ["#ef4444", "#22c55e"] },
            ].map((row) => (
              <div key={row.label} className="flex gap-2 items-center text-xs">
                <div className="w-24 text-right pr-2" style={{ color: "var(--muted)" }}>{row.label}</div>
                {row.vals.map((val, i) => (
                  <div key={i} className="w-24 h-20 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-lg"
                    style={{ background: `${row.colors[i]}18`, border: `1px solid ${row.colors[i]}40`, color: row.colors[i] }}>
                    {val}
                    <span className="text-[10px] font-normal mt-0.5" style={{ color: "var(--muted)" }}>
                      {(val / 1000 * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-xs mt-4 text-center" style={{ color: "var(--muted)" }}>
            Accuracy: {((cm.tp + cm.tn) / 1000 * 100).toFixed(1)}% &nbsp;|&nbsp;
            False Positive Rate: {(cm.fp / (cm.fp + cm.tn) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
