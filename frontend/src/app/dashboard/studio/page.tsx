"use client";
import { useState, useEffect } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL ?? "http://localhost:8080";

type Status = "checking" | "online" | "offline";

const SHORTCUTS = [
  { keys: "Ctrl + P",           desc: "Quick open file" },
  { keys: "Ctrl + Shift + P",   desc: "Command palette" },
  { keys: "Ctrl + `",           desc: "Toggle terminal" },
  { keys: "Ctrl + B",           desc: "Toggle sidebar" },
  { keys: "Ctrl + /",           desc: "Comment / uncomment" },
  { keys: "Alt + ↑ / ↓",        desc: "Move line up / down" },
  { keys: "Ctrl + D",           desc: "Select next occurrence" },
  { keys: "Ctrl + Shift + K",   desc: "Delete line" },
];

const FEATURES = [
  "Full IntelliSense & code completion",
  "Integrated terminal (bash)",
  "Git source-control panel",
  "Extension marketplace support",
  "Python, JS & TypeScript debugger",
  "Multi-cursor & multi-file editing",
  "Syntax highlighting for 50+ languages",
  "Remote workspace via volume mount",
];

export default function StudioPage() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    fetch(STUDIO_URL, { mode: "no-cors" })
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>💻</span> DAQS Studio
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Browser-based VS Code — powered by code-server
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status */}
          <div className={`flex items-center gap-1.5 text-xs font-medium ${
            status === "online"  ? "text-emerald-400" :
            status === "offline" ? "text-red-400"     : "text-white/40"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === "online"  ? "bg-emerald-400" :
              status === "offline" ? "bg-red-400"     : "bg-white/30 animate-pulse"
            }`} />
            {status === "online" ? "Online" : status === "offline" ? "Offline" : "Checking…"}
          </div>

          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noreferrer"
            aria-disabled={status === "offline"}
            className={`flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all ${
              status === "offline"
                ? "bg-white/5 border border-white/10 text-white/25 pointer-events-none"
                : "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20"
            }`}
          >
            Open Studio ↗
          </a>
        </div>
      </div>

      {/* ── Hero launch card ── */}
      <div className="bg-gradient-to-br from-sky-500/10 to-indigo-500/5 border border-sky-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-4xl">
          💻
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Full VS Code in Your Browser</h2>
          <p className="text-white/50 text-sm max-w-lg leading-relaxed">
            DAQS Studio gives you a complete VS Code environment — with extensions, an integrated
            terminal, Git, and debugging — accessible from any browser, no install required.
          </p>
        </div>

        {status === "offline" ? (
          <div className="w-full max-w-md space-y-3 text-left">
            <div className="bg-[#0a1628] border border-white/10 rounded-xl px-5 py-4">
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Start the service</p>
              <code className="text-emerald-300 text-xs font-mono">docker compose up studio</code>
            </div>
            <p className="text-white/30 text-xs text-center">
              Default password: <code className="text-white/50 font-mono">daqs2024</code>
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20 text-sm"
            >
              Launch DAQS Studio ↗
            </a>
            <p className="text-white/25 text-xs">
              Password: <code className="text-white/40 font-mono">daqs2024</code>
            </p>
          </div>
        )}
      </div>

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Keyboard shortcuts */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">⌨️ Keyboard Shortcuts</h2>
          <div className="space-y-2.5">
            {SHORTCUTS.map((s) => (
              <div key={s.keys} className="flex items-center justify-between gap-4">
                <span className="text-white/55 text-xs">{s.desc}</span>
                <kbd className="shrink-0 text-[10px] font-mono bg-white/8 border border-white/12 rounded px-2 py-0.5 text-white/55 whitespace-nowrap">
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">✨ What's Included</h2>
          <ul className="space-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Note about iframes ── */}
      <p className="text-white/20 text-xs text-center">
        Studio opens in a new tab — code-server's security policy prevents embedding in iframes.
      </p>
    </div>
  );
}
