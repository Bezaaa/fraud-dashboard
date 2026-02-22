"use client";
import { useState } from "react";
import { TransactionInput, PredictionResult } from "@/lib/fraudModel";
import { Loader2 } from "lucide-react";

interface Props {
  onResult: (result: PredictionResult) => void;
}

const defaultValues: TransactionInput = {
  purchase_value: 299,
  age: 28,
  time_since_signup: 12,
  hour_of_day: 2,
  day_of_week: 6,
  device_type: "mobile",
  source: "Ads",
  browser: "Chrome",
  sex: "M",
};

const field = (
  label: string,
  id: keyof TransactionInput,
  el: React.ReactNode
) => (
  <div key={id} className="flex flex-col gap-1.5">
    <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
      {label}
    </label>
    {el}
  </div>
);

const inputCls =
  "w-full px-3 py-2 rounded-lg border text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors";
const inputStyle = { background: "var(--bg, #07070f)", borderColor: "var(--border)", color: "white" };

export default function TransactionForm({ onResult }: Props) {
  const [form, setForm] = useState<TransactionInput>(defaultValues);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof TransactionInput, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    onResult(data);
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field(
          "Purchase Value ($)",
          "purchase_value",
          <input
            type="number"
            className={inputCls}
            style={inputStyle}
            value={form.purchase_value}
            min={1}
            onChange={(e) => set("purchase_value", parseFloat(e.target.value))}
          />
        )}
        {field(
          "User Age",
          "age",
          <input
            type="number"
            className={inputCls}
            style={inputStyle}
            value={form.age}
            min={18}
            max={99}
            onChange={(e) => set("age", parseInt(e.target.value))}
          />
        )}
        {field(
          "Account Age (hours)",
          "time_since_signup",
          <input
            type="number"
            className={inputCls}
            style={inputStyle}
            value={form.time_since_signup}
            min={0}
            onChange={(e) => set("time_since_signup", parseFloat(e.target.value))}
          />
        )}
        {field(
          "Hour of Day (0–23)",
          "hour_of_day",
          <input
            type="number"
            className={inputCls}
            style={inputStyle}
            value={form.hour_of_day}
            min={0}
            max={23}
            onChange={(e) => set("hour_of_day", parseInt(e.target.value))}
          />
        )}
        {field(
          "Device Type",
          "device_type",
          <select
            className={inputCls}
            style={inputStyle}
            value={form.device_type}
            onChange={(e) => set("device_type", e.target.value)}
          >
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
          </select>
        )}
        {field(
          "Traffic Source",
          "source",
          <select
            className={inputCls}
            style={inputStyle}
            value={form.source}
            onChange={(e) => set("source", e.target.value)}
          >
            <option value="SEO">SEO</option>
            <option value="Ads">Ads</option>
            <option value="Direct">Direct</option>
          </select>
        )}
        {field(
          "Browser",
          "browser",
          <select
            className={inputCls}
            style={inputStyle}
            value={form.browser}
            onChange={(e) => set("browser", e.target.value)}
          >
            {["Chrome", "Firefox", "Safari", "IE", "Opera"].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        )}
        {field(
          "Sex",
          "sex",
          <select
            className={inputCls}
            style={inputStyle}
            value={form.sex}
            onChange={(e) => set("sex", e.target.value)}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
        style={{ background: "var(--primary)", color: "white" }}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : "Analyze Transaction"}
      </button>
    </form>
  );
}
