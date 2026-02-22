"use client";
import { motion } from "framer-motion";

interface RiskGaugeProps {
  probability: number;
  riskLevel: "High" | "Medium" | "Low";
}

export default function RiskGauge({ probability, riskLevel }: RiskGaugeProps) {
  const pct = Math.round(probability * 100);

  const color =
    riskLevel === "High"
      ? "var(--red)"
      : riskLevel === "Medium"
      ? "var(--yellow)"
      : "var(--green)";

  const glow =
    riskLevel === "High"
      ? "var(--red-glow)"
      : riskLevel === "Medium"
      ? "var(--yellow-glow)"
      : "var(--green-glow)";

  // SVG arc
  const r = 68;
  const cx = 100;
  const cy = 92;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcPt = (deg: number) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  });

  const start = arcPt(-180);
  const end = arcPt(0);
  const filled = arcPt(-180 + 180 * probability);
  const largeArc = probability > 0.5 ? 1 : 0;

  const trackPath = `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`;
  const fillPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${filled.x} ${filled.y}`;

  // Tick marks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="200" height="118" viewBox="0 0 200 118">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path d={trackPath} fill="none" stroke="var(--border-strong)" strokeWidth="12" strokeLinecap="round" />

        {/* Coloured fill */}
        {probability > 0 && (
          <motion.path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: probability }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          />
        )}

        {/* Tick labels */}
        {ticks.map((t) => {
          const angle = -180 + 180 * (t / 100);
          const pt = arcPt(angle);
          const labelPt = {
            x: cx + (r + 16) * Math.cos(toRad(angle)),
            y: cy + (r + 16) * Math.sin(toRad(angle)),
          };
          return (
            <text key={t} x={labelPt.x} y={labelPt.y} textAnchor="middle"
              dominantBaseline="middle" fontSize="8" fill="var(--muted)">
              {t}
            </text>
          );
        })}

        {/* Center */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="30" fontWeight="800" fill={color}>
          {pct}%
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fill="var(--muted)">
          fraud probability
        </text>
      </svg>

      {/* Badge */}
      <div
        className="flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-bold"
        style={{ color, background: glow, border: `1px solid ${color}40` }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
        {riskLevel} Risk
      </div>
    </div>
  );
}
