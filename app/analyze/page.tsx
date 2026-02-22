"use client";
import { useState } from "react";
import { PredictionResult } from "@/lib/fraudModel";
import TransactionForm from "@/components/TransactionForm";
import RiskGauge from "@/components/RiskGauge";
import ShapChart from "@/components/ShapChart";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function AnalyzePage() {
  const [result, setResult] = useState<PredictionResult | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analyze Transaction</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Enter transaction details to get an instant fraud probability score with AI explanations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-sm font-semibold text-white mb-5">Transaction Details</h2>
          <TransactionForm onResult={setResult} />
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Verdict */}
              <div
                className="rounded-xl border p-5 flex items-center gap-4"
                style={{
                  background: "var(--card)",
                  borderColor: result.is_fraud ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)",
                }}
              >
                {result.is_fraud ? (
                  <ShieldAlert size={32} color="#ef4444" />
                ) : (
                  <ShieldCheck size={32} color="#22c55e" />
                )}
                <div>
                  <p className="text-lg font-bold text-white">
                    {result.is_fraud ? "Fraud Detected" : "Transaction Legitimate"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Model confidence: {Math.round(result.fraud_probability * 100)}%
                  </p>
                </div>
              </div>

              {/* Gauge */}
              <div
                className="rounded-xl border p-5 flex justify-center"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <RiskGauge
                  probability={result.fraud_probability}
                  riskLevel={result.risk_level}
                />
              </div>

              {/* SHAP */}
              <div
                className="rounded-xl border p-5"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <h3 className="text-sm font-semibold text-white mb-3">
                  Why this score? (Feature Impact)
                </h3>
                <ShapChart values={result.shap_values} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed flex flex-col items-center justify-center p-12 text-center"
              style={{ borderColor: "var(--border)" }}
            >
              <ShieldAlert size={40} style={{ color: "var(--muted)" }} className="mb-3" />
              <p className="text-sm font-medium text-white">No analysis yet</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Fill in the form and click Analyze Transaction
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
