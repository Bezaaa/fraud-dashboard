"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Overview" },
  { href: "/analyze", label: "Analyze" },
  { href: "/insights", label: "Insights" },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ borderBottom: "1px solid var(--border)", background: "rgba(6,6,15,0.7)" }}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--cyan))" }}
          >
            <ShieldCheck size={16} color="white" />
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: "var(--fg)" }}>
            Fraud<span className="gradient-text">Lens</span>
          </span>
        </Link>

        {/* Nav links */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: active ? "white" : "var(--muted)",
                  background: active
                    ? "linear-gradient(135deg, var(--primary), var(--cyan))"
                    : "transparent",
                  boxShadow: active ? "0 2px 12px var(--primary-glow)" : "none",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
            style={{
              color: "var(--green)",
              background: "var(--green-glow)",
              border: "1px solid var(--green)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--green)" }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "var(--green)" }} />
            </span>
            Live
          </span>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
