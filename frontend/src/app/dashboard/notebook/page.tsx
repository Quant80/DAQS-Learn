"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const JUPYTERLITE_URL  = "https://jupyterlite.github.io/demo/lab/index.html";
const JUPYTERLAB_URL   = process.env.NEXT_PUBLIC_NOTEBOOK_URL ?? "";
const JUPYTERLAB_TOKEN = process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";

type Tab = "lab" | "lite";

// ── Starter notebook topics ──────────────────────────────────────────────────
const STARTER_NOTEBOOKS = [
  {
    track: "Python", icon: "🐍", color: "sky",
    notebooks: [
      { label: "Python Basics",          desc: "Variables, loops, functions" },
      { label: "Lists & Dict operations", desc: "Core data structures"        },
      { label: "File I/O",               desc: "Read and write files"         },
    ],
  },
  {
    track: "Data Science", icon: "📊", color: "violet",
    notebooks: [
      { label: "NumPy essentials",  desc: "Arrays and vectorised ops"   },
      { label: "Pandas DataFrames", desc: "Load, clean, filter data"    },
      { label: "Matplotlib plots",  desc: "Line, bar, scatter charts"   },
    ],
  },
  {
    track: "Machine Learning", icon: "🤖", color: "amber",
    notebooks: [
      { label: "Linear Regression",  desc: "From scratch with numpy"    },
      { label: "Scikit-learn basics", desc: "Train, test, evaluate"     },
      { label: "Decision Trees",      desc: "Classification walkthrough" },
    ],
  },
  {
    track: "Mathematics", icon: "🔢", color: "indigo",
    notebooks: [
      { label: "Statistics with SciPy", desc: "Distributions & tests"  },
      { label: "Linear Algebra",        desc: "Matrices with numpy"     },
      { label: "Calculus & gradients",  desc: "Derivatives numerically" },
    ],
  },
];

const colorMap: Record<string, { pill: string; dot: string }> = {
  sky:    { pill: "bg-sky-500/15 text-sky-400 border-sky-500/25",         dot: "bg-sky-400"    },
  violet: { pill: "bg-violet-500/15 text-violet-400 border-violet-500/25", dot: "bg-violet-400" },
  amber:  { pill: "bg-amber-500/15 text-amber-400 border-amber-500/25",   dot: "bg-amber-400"  },
  indigo: { pill: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25", dot: "bg-indigo-400" },
};

// ── JupyterLab tab pane ──────────────────────────────────────────────────────
function JupyterLabPane({ labStatus }: { labStatus: "checking" | "online" | "offline" }) {
  const labUrl = JUPYTERLAB_TOKEN
    ? `${JUPYTERLAB_URL}?token=${JUPYTERLAB_TOKEN}`
    : JUPYTERLAB_URL;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {/* Hero card */}
        <div className="bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/25 to-indigo-500/15 border border-sky-500/30 flex items-center justify-center text-4xl shadow-lg shadow-sky-500/10">
            🖥️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">JupyterLab on DAQS Server</h2>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed mx-auto">
              Full persistent notebook environment running on the DAQS Oracle Cloud server.
              Files are saved between sessions. Supports NumPy, Pandas, Matplotlib, Scikit-learn and more.
            </p>
          </div>

          {labStatus === "offline" || !JUPYTERLAB_URL ? (
            <div className="w-full max-w-md space-y-3 text-left">
              <div className="bg-black/30 border border-white/10 rounded-xl px-5 py-4">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Server URL</p>
                <code className="text-white/50 text-xs font-mono">{JUPYTERLAB_URL || "Not configured"}</code>
              </div>
              <p className="text-white/30 text-xs text-center">
                {JUPYTERLAB_URL ? "Server is currently offline — check docker compose on the OCI server." : "Set NEXT_PUBLIC_NOTEBOOK_URL to enable."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <a
                href={labUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-sky-500/25 text-sm"
              >
                Launch JupyterLab ↗
              </a>
              {JUPYTERLAB_TOKEN && (
                <p className="text-white/25 text-xs">
                  Token: <code className="text-white/40 font-mono">{JUPYTERLAB_TOKEN}</code>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">✨ What&apos;s available</h2>
            <ul className="space-y-2.5">
              {[
                "Full JupyterLab interface",
                "Persistent file system (saved between sessions)",
                "NumPy, Pandas, Matplotlib, Seaborn",
                "Scikit-learn & SciPy",
                "IPython magic commands",
                "Upload & download notebooks",
                "Multiple kernels per session",
                "Inline plots & rich output",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-xs text-white/60">
                  <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">⌨️ Useful shortcuts</h2>
            <div className="space-y-2.5">
              {[
                { keys: "Shift + Enter", desc: "Run cell and move to next" },
                { keys: "Ctrl + Enter",  desc: "Run cell in place"         },
                { keys: "A / B",         desc: "Insert cell above / below" },
                { keys: "D D",           desc: "Delete selected cell"      },
                { keys: "M",             desc: "Change cell to Markdown"   },
                { keys: "Y",             desc: "Change cell to code"       },
                { keys: "Ctrl + S",      desc: "Save notebook"             },
                { keys: "0 0",           desc: "Restart kernel"            },
              ].map((s) => (
                <div key={s.keys} className="flex items-center justify-between gap-4">
                  <span className="text-white/55 text-xs">{s.desc}</span>
                  <kbd className="shrink-0 text-[10px] font-mono bg-white/8 border border-white/12 rounded px-2 py-0.5 text-white/55 whitespace-nowrap">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs text-center">
          JupyterLab opens in a new tab — cross-origin policy prevents embedding.
        </p>
      </div>
    </div>
  );
}

// ── JupyterLite tab pane ─────────────────────────────────────────────────────
function JupyterLitePane() {
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tutorCode, setTutorCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("fromTutor") === "1") {
      const code = sessionStorage.getItem("daqs_tutor_code");
      if (code) {
        setTutorCode(code);
        sessionStorage.removeItem("daqs_tutor_code");
        navigator.clipboard.writeText(code).catch(() => {});
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 4000);
        setLoading(true);
        setLaunched(true);
      }
    }
  }, []);

  function copyCode() {
    if (!tutorCode) return;
    navigator.clipboard.writeText(tutorCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  if (launched) {
    return (
      <div className="flex-1 flex flex-col">
        {tutorCode && (
          <div className="bg-sky-500/[0.07] border-b border-sky-500/25 px-4 py-2.5 flex items-center gap-3 shrink-0 flex-wrap">
            <span className="text-sky-300 text-xs font-bold flex items-center gap-1.5">🤖 AI Tutor Code ready</span>
            <span className="text-white/40 text-xs flex-1 min-w-0">Open a new cell → Ctrl+V to paste</span>
            <button onClick={copyCode} className="text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white px-3 py-1 rounded-lg transition-colors shrink-0">
              {codeCopied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button onClick={() => setTutorCode(null)} className="text-white/30 hover:text-white/60 text-base shrink-0">×</button>
          </div>
        )}

        {/* Toolbar */}
        <div className="h-9 bg-[#0d0d14] border-b border-white/8 flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setLaunched(false)}
            className="text-white/40 hover:text-white text-xs transition-colors flex items-center gap-1.5"
          >
            ← Notebook home
          </button>
          <div className="w-px h-4 bg-white/10" />
          {loading && (
            <span className="text-amber-400 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Loading Python runtime (~20–30s)…
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/notebook"
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/25 hover:border-amber-500/50 rounded-lg px-2.5 py-1 transition-all"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" />
              </svg>
              Expand
            </Link>
          </div>
        </div>

        <iframe
          key="jlite"
          src={JUPYTERLITE_URL}
          className="flex-1 w-full border-0"
          onLoad={() => setLoading(false)}
          allow="cross-origin-isolated"
          sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups"
          title="JupyterLite"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {/* Hero card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/25 to-orange-500/15 border border-amber-500/30 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/10">
            ⚡
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">JupyterLite — In Your Browser</h2>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed mx-auto">
              Full Jupyter environment powered by <strong className="text-white">Pyodide + WebAssembly</strong> — runs entirely in your browser.
              No server, no install. NumPy, Pandas, Matplotlib and Scikit-learn all included.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => { setLoading(true); setLaunched(true); }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/25 text-sm"
            >
              🚀 Launch JupyterLite
            </button>
            <p className="text-white/25 text-xs">First load ~20–30 s · not saved between sessions</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5 flex gap-4">
          <div className="text-3xl shrink-0">🧮</div>
          <div className="space-y-1.5">
            <div className="text-white font-semibold text-sm">Python runs in your browser</div>
            <p className="text-white/45 text-sm leading-relaxed">
              JupyterLite uses <strong className="text-white">Pyodide</strong> — a full CPython distribution compiled to WebAssembly.
              First load downloads ~20 MB of runtime; subsequent visits are faster due to caching.
            </p>
            <p className="text-white/30 text-xs">Notebooks are not auto-saved — download your work (File → Download) before closing.</p>
          </div>
        </div>

        {/* AI Tutor code banner */}
        {tutorCode && (
          <div className="bg-sky-500/[0.06] border border-sky-500/30 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-sky-500/20 bg-sky-500/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🤖</span>
                <div>
                  <div className="text-sky-300 font-semibold text-sm">Code from AI Tutor</div>
                  <div className="text-white/40 text-xs">Auto-copied to clipboard — open a new cell and press Ctrl+V</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={copyCode} className="text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-lg transition-colors">
                  {codeCopied ? "✓ Copied!" : "Copy code"}
                </button>
                <button onClick={() => setTutorCode(null)} className="text-white/30 hover:text-white/60 text-lg leading-none px-1">×</button>
              </div>
            </div>
            <pre className="overflow-x-auto p-4 bg-[#060e1f] text-xs text-emerald-300 font-mono leading-relaxed max-h-52">{tutorCode}</pre>
          </div>
        )}

        {/* Starter notebooks */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Starter notebooks by track</h2>
          <div className="bg-amber-500/[0.04] border border-amber-500/15 rounded-2xl p-4 text-xs text-amber-400/70 flex items-start gap-3">
            <span className="text-base shrink-0">💡</span>
            <span>Launch JupyterLite above, then use <strong className="text-amber-300">File → New → Notebook</strong> to start any of these topics.</span>
          </div>
          {STARTER_NOTEBOOKS.map((track) => {
            const colors = colorMap[track.color];
            return (
              <div key={track.track} className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/6 flex items-center gap-2">
                  <span className="text-lg">{track.icon}</span>
                  <span className="text-white font-semibold text-sm">{track.track}</span>
                  <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ml-auto ${colors.pill}`}>
                    {track.notebooks.length} topics
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {track.notebooks.map((nb) => (
                    <div key={nb.label} className="w-full text-left px-5 py-3 flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{nb.label}</div>
                        <div className="text-white/35 text-xs">{nb.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function NotebookPage() {
  const [tab, setTab] = useState<Tab>("lite");
  const [labStatus, setLabStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    if (!JUPYTERLAB_URL) { setLabStatus("offline"); return; }
    fetch(JUPYTERLAB_URL, { mode: "no-cors" })
      .then(() => setLabStatus("online"))
      .catch(() => setLabStatus("offline"));
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#0a0a10]">

      {/* ── Unified header bar ── */}
      <div className="h-12 bg-[#0d0d18] border-b border-white/8 flex items-center px-4 gap-3 shrink-0">

        {/* Icon + title */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500/20 to-amber-500/20 border border-white/10 flex items-center justify-center text-sm">
            📓
          </div>
          <span className="text-white font-bold text-sm hidden sm:block">DAQS Notebook</span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-0.5 bg-white/5 border border-white/8 rounded-xl p-1">
          <button
            onClick={() => setTab("lab")}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              tab === "lab"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
                : "text-sky-400/50 hover:text-sky-300"
            }`}
          >
            <span>🖥️</span>
            <span>JupyterLab</span>
          </button>
          <button
            onClick={() => setTab("lite")}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              tab === "lite"
                ? "bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-md shadow-amber-500/30"
                : "text-amber-400/60 hover:text-amber-300"
            }`}
          >
            <span>⚡</span>
            <span>JupyterLite</span>
          </button>
        </div>

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-2">
          {tab === "lab" ? (
            <>
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${
                labStatus === "online"  ? "text-emerald-400" :
                labStatus === "offline" ? "text-red-400"     : "text-white/35"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  labStatus === "online"  ? "bg-emerald-400" :
                  labStatus === "offline" ? "bg-red-400"     : "bg-white/30 animate-pulse"
                }`} />
                {labStatus === "online" ? "Online" : labStatus === "offline" ? "Offline" : "Checking…"}
              </div>
              <a
                href={JUPYTERLAB_TOKEN ? `${JUPYTERLAB_URL}?token=${JUPYTERLAB_TOKEN}` : JUPYTERLAB_URL}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  !JUPYTERLAB_URL || labStatus === "offline"
                    ? "bg-white/5 border border-white/10 text-white/25 pointer-events-none"
                    : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-md shadow-sky-500/20"
                }`}
              >
                Open JupyterLab ↗
              </a>
            </>
          ) : (
            <Link
              href="/notebook"
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/25 hover:border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 rounded-xl px-3 py-2 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" />
              </svg>
              Expand
            </Link>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 min-h-0">
        {tab === "lab" ? (
          <JupyterLabPane labStatus={labStatus} />
        ) : (
          <JupyterLitePane />
        )}
      </div>
    </div>
  );
}
