"use client";
import Link from "next/link";

const TOOLS = [
  {
    href: "/dashboard/graphing/desmos",
    icon: "📐",
    name: "Desmos",
    tagline: "Graphing Calculator",
    desc: "Plot functions, inequalities, and points instantly, with sliders, tables, and regressions.",
  },
  {
    href: "/dashboard/graphing/geogebra",
    icon: "📏",
    name: "GeoGebra",
    tagline: "Geometry & Construction",
    desc: "Compass-and-straightedge constructions, transformations, and dynamic worksheets.",
  },
];

export default function GraphingHubPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📐</span> Graphing Calculators
        </h1>
        <p className="text-white/45 text-sm mt-1">
          Choose a tool to plot, construct, and explore mathematics interactively
        </p>
      </div>

      {/* ── Tool picker ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-white/[0.03] border border-white/8 hover:border-sky-500/40 hover:bg-white/[0.05] rounded-2xl p-6 flex flex-col gap-3 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-3xl">
              {tool.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{tool.name}</h2>
              <p className="text-sky-300/80 text-xs font-medium mt-0.5">{tool.tagline}</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{tool.desc}</p>
            <span className="text-sky-400 text-sm font-semibold mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Open {tool.name} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
