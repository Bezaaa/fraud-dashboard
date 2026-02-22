"use client";
import { useState } from "react";
import { PredictionResult } from "@/lib/fraudModel";
import TransactionForm from "@/components/TransactionForm";
import RiskGauge from "@/components/RiskGauge";
import ShapChart from "@/components/ShapChart";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";

export default function AnalyzePage() {
  const [result, setResult] = useState<PredictionResult | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", border: "1px solid var(--border)" }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--cyan)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "var(--cyan-glow)", color: "var(--cyan)", border: "1px solid var(--cyan)40" }}>
            <Sparkles size={11} /> ML-Powered
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--fg)" }}>
            Analyze <span className="gradient-text">Transaction</span>
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--muted2)" }}>
            Enter transaction details to get an instant fraud probability score with AI-powered feature explanations.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <div className="glow-card p-6">
          <h2 className="font-semibold mb-5" style={{ color: "var(--fg)" }}>Transaction Details</h2>
          <TransactionForm onResult={setResult} />
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="result" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="space-y-4">

              {/* Verdict banner */}
              <div
                className="rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
                style={{
                  background: result.is_fraud ? "var(--red-glow)" : "var(--green-glow)",
                  border: `1px solid ${result.is_fraud ? "rgba(244,63,94,0.4)" : "rgba(16,185,129,0.4)"}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: result.is_fraud ? "rgba(244,63,94,0.2)" : "rgba(16,185,129,0.2)",
                    border: `1px solid ${result.is_fraud ? "var(--red)" : "var(--green)"}40`,
                  }}
                >
                  {result.is_fraud
                    ? <ShieldAlert size={22} color="var(--red)" />
                    : <ShieldCheck size={22} color="var(--green)" />}
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: "var(--fg)" }}>
                    {result.is_fraud ? "Fraud Detected" : "Transaction Clear"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted2)" }}>
                    Model confidence: {Math.round(result.fraud_probability * 100)}%
                  </p>
                </div>
              </div>

              {/* Gauge */}
              <div className="glow-card p-6 flex justify-center">
                <RiskGauge probability={result.fraud_probability} riskLevel={result.risk_level} />
              </div>

              {/* SHAP */}
              <div className="glow-card p-6">
                <div className="mb-4">
                  <h3 className="font-semibold" style={{ color: "var(--fg)" }}>Feature Impact (SHAP)</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    Why did the model return this score?
                  </p>
                </div>
                <ShapChart values={result.shap_values} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glow-card flex flex-col items-center justify-center p-16 text-center min-h-64">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "var(--primary-glow)", border: "1px solid var(--primary)30" }}>
                <ShieldAlert size={26} style={{ color: "var(--primary)" }} />
              </div>
              <p className="font-semibold mb-1.5" style={{ color: "var(--fg)" }}>Ready to analyze</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Fill in the form and click Analyze Transaction
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
