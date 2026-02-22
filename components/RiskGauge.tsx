"use client";
import { motion } from "framer-motion";

interface RiskGaugeProps {
  probability: number; // 0 to 1
  riskLevel: "High" | "Medium" | "Low";
}

export default function RiskGauge({ probability, riskLevel }: RiskGaugeProps) {
  const pct = Math.round(probability * 100);
  const color =
    riskLevel === "High" ? "#ef4444" : riskLevel === "Medium" ? "#f59e0b" : "#22c55e";

  // SVG arc parameters
  const r = 70;
  const cx = 100;
  const cy = 90;
  const startAngle = -180;
  const endAngle = 0;
  const totalArc = endAngle - startAngle; // 180 degrees

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number) => {
    const s = toRad(start);
    const e = toRad(end);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const fillEnd = startAngle + totalArc * probability;
  const circumference = Math.PI * r; // half circle

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background track */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="var(--border)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.path
          d={arcPath(startAngle, fillEnd)}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: probability }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        {/* Center label */}
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="28" fontWeight="700" fill="white">
          {pct}%
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize="11" fill="var(--muted)">
          fraud probability
        </text>
      </svg>

      <span
        className="text-sm font-bold px-4 py-1.5 rounded-full border"
        style={{
          color,
          borderColor: color,
          background: `${color}15`,
        }}
      >
        {riskLevel} Risk
      </span>
    </div>
  );
}
