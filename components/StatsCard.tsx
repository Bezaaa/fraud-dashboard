"use client";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  sub: string;
  accent: "purple" | "cyan" | "red" | "green" | "yellow";
  icon: React.ReactNode;
  index?: number;
}

const accentMap = {
  purple: { color: "var(--primary)", glow: "var(--primary-glow)" },
  cyan:   { color: "var(--cyan)",    glow: "var(--cyan-glow)"    },
  red:    { color: "var(--red)",     glow: "var(--red-glow)"     },
  green:  { color: "var(--green)",   glow: "var(--green-glow)"   },
  yellow: { color: "var(--yellow)",  glow: "var(--yellow-glow)"  },
};

export default function StatsCard({ title, value, sub, accent, icon, index = 0 }: StatsCardProps) {
  const { color, glow } = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glow-card p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>{title}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: glow, color, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>{value}</p>
        <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--muted)" }}>{sub}</p>
      </div>
      {/* Bottom accent bar */}
      <div className="h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </motion.div>
  );
}
