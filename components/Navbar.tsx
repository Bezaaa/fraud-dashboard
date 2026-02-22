"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";

const links = [
  { href: "/", label: "Overview" },
  { href: "/analyze", label: "Analyze" },
  { href: "/insights", label: "Insights" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav
      className="border-b px-4 py-3 flex items-center justify-between"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <div className="flex items-center gap-2">
        <ShieldAlert size={20} style={{ color: "var(--primary)" }} />
        <span className="font-bold text-white font-mono text-sm tracking-wide">
          FraudLens
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full border font-mono"
          style={{ color: "var(--green)", borderColor: "var(--green)", background: "rgba(34,197,94,0.08)" }}
        >
          AI
        </span>
      </div>
      <div className="flex items-center gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              color: path === l.href ? "white" : "var(--muted)",
              background: path === l.href ? "var(--border)" : "transparent",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
