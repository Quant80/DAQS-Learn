"use client";
import { useState, useEffect } from "react";

const JUPYTERLITE_URL = "https://jupyter.org/try-jupyter/lab/";
const JUPYTERHUB_URL = process.env.NEXT_PUBLIC_JUPYTERHUB_URL ?? "";
const NOTEBOOK_URL = JUPYTERLITE_URL;
const IS_JUPYTERHUB = !!JUPYTERHUB_URL;

const COURSE_NOTEBOOKS = [
  {
    label: "Python Fundamentals — Complete Course",
    desc: "Variables → Functions → Lists → 10 Practice Qs → Assignment with auto-grader",
    download: "/notebooks/python-fundamentals.ipynb",
    level: "Beginner → Intermediate",
    icon: "🐍",
    color: "sky",
  },
];

const STARTER_NOTEBOOKS = [
  {
    track: "Python",
    icon: "🐍",
    color: "sky",
    notebooks: [
      { label: "Python Basics", desc: "Variables, loops, functions", url: NOTEBOOK_URL },
      { label: "List & Dict operations", desc: "Core data structures", url: NOTEBOOK_URL },
      { label: "File I/O", desc: "Read and write files", url: NOTEBOOK_URL },
    ],
  },
  {
    track: "Data Science",
    icon: "📊",
    color: "violet",
    notebooks: [
      { label: "NumPy essentials", desc: "Arrays and vectorised ops", url: NOTEBOOK_URL },
      { label: "Pandas DataFrames", desc: "Load, clean, filter data", url: NOTEBOOK_URL },
      { label: "Matplotlib plots", desc: "Line, bar, scatter charts", url: NOTEBOOK_URL },
    ],
  },
  {
    track: "Machine Learning",
    icon: "🤖",
    color: "amber",
    notebooks: [
      { label: "Linear Regression", desc: "From scratch with numpy", url: NOTEBOOK_URL },
      { label: "Scikit-learn basics", desc: "Train, test, evaluate", url: NOTEBOOK_URL },
      { label: "Decision Trees", desc: "Classification walkthrough", url: NOTEBOOK_URL },
    ],
  },
  {
    track: "Mathematics",
    icon: "🔢",
    color: "indigo",
    notebooks: [
      { label: "Statistics with SciPy", desc: "Distributions & tests", url: NOTEBOOK_URL },
      { label: "Linear Algebra", desc: "Matrices with numpy", url: NOTEBOOK_URL },
      { label: "Calculus & gradients", desc: "Derivatives numerically", url: NOTEBOOK_URL },
    ],
  },
];

const colorMap: Record<string, { pill: string; dot: string }> = {
  sky:    { pill: "bg-sky-500/15 text-sky-400 border-sky-500/25",    dot: "bg-sky-400" },
  violet: { pill: "bg-violet-500/15 text-violet-400 border-violet-500/25", dot: "bg-violet-400" },
  amber:  { pill: "bg-amber-500/15 text-amber-400 border-amber-500/25",  dot: "bg-amber-400" },
  indigo: { pill: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25", dot: "bg-indigo-400" },
};

export default function NotebookPage() {
  const [launched, setLaunched] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(NOTEBOOK_URL);
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
        // Auto-copy so student can paste directly into a notebook cell
        navigator.clipboard.writeText(code).catch(() => {});
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 4000);
        // Auto-open JupyterLite — student just needs to Ctrl+V in a new cell
        setIframeUrl(NOTEBOOK_URL);
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

  function launch(url: string = NOTEBOOK_URL) {
    setIframeUrl(url);
    setLoading(true);
    setLaunched(true);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {!launched ? (
        /* ── Launch screen ── */
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-4xl space-y-8">
          {/* Back to tutor link */}
          <a
            href="/dashboard/tutor"
            className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 border border-sky-500/20 hover:border-sky-500/40 rounded-xl px-3 py-1.5 transition-all w-fit"
          >
            ← Back to AI Tutor
            <span className="text-white/30 text-[10px]">(your conversation is saved)</span>
          </a>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white">Notebook</h1>
              <p className="text-white/45 text-sm mt-1">Interactive Python environment — powered by JupyterLite</p>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-semibold">Interim · Browser-based</span>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex gap-4">
            <div className="text-3xl shrink-0">🧮</div>
            <div className="space-y-1.5">
              <div className="text-white font-semibold">Python runs in your browser</div>
              <p className="text-white/45 text-sm leading-relaxed">
                This notebook environment uses <strong className="text-white">JupyterLite + Pyodide</strong> — full Python with NumPy, Pandas, Matplotlib, and Scikit-learn, all running via WebAssembly. No server, no install.
              </p>
              <p className="text-white/30 text-xs">
                First load takes ~20–30s to download the Python runtime. Notebooks are not saved between sessions — download your work before closing.
              </p>
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
                    <div className="text-white/40 text-xs">Auto-copied to clipboard — open a new cell below and press Ctrl+V (or Cmd+V)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={copyCode}
                    className="text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {codeCopied ? "✓ Copied!" : "Copy code"}
                  </button>
                  <button
                    onClick={() => setTutorCode(null)}
                    className="text-white/30 hover:text-white/60 text-lg leading-none transition-colors px-1"
                  >
                    ×
                  </button>
                </div>
              </div>
              <pre className="overflow-x-auto p-4 bg-[#060e1f] text-xs text-emerald-300 font-mono leading-relaxed max-h-52">
                {tutorCode}
              </pre>
              {codeCopied && (
                <div className="px-5 py-2 bg-emerald-500/10 border-t border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <span>✓</span> Code copied to clipboard! Click "Open blank notebook" below, then Ctrl+V into a new cell to run it.
                </div>
              )}
            </div>
          )}

          {/* Launch buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {IS_JUPYTERHUB && (
              <a
                href={JUPYTERHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-2xl text-base transition-all flex items-center justify-center gap-3"
              >
                <span className="text-xl">🖥️</span>
                Open JupyterHub ↗
              </a>
            )}
            <button
              onClick={() => launch()}
              className={`flex-1 ${IS_JUPYTERHUB ? "bg-white/10 hover:bg-white/15 text-white" : "bg-sky-500 hover:bg-sky-400 text-white"} font-bold py-4 rounded-2xl text-base transition-all flex items-center justify-center gap-3`}
            >
              <span className="text-xl">🚀</span>
              {IS_JUPYTERHUB ? "Open in-browser (JupyterLite)" : "Open blank notebook"}
            </button>
          </div>

          {/* Course Notebooks */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Course notebooks</h2>
            {COURSE_NOTEBOOKS.map((nb) => (
              <div key={nb.label} className="bg-sky-500/[0.04] border border-sky-500/20 rounded-2xl p-5 flex items-start gap-4">
                <div className="text-3xl shrink-0">{nb.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm leading-snug">{nb.label}</div>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{nb.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/25">{nb.level}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={nb.download}
                    download
                    className="text-xs bg-sky-500 hover:bg-sky-400 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    ⬇ Download
                  </a>
                  {IS_JUPYTERHUB && (
                    <a
                      href={JUPYTERHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 border border-sky-500/30 hover:border-sky-500/60 px-3 py-1.5 rounded-xl transition-colors text-center"
                    >
                      Open Hub ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Starter notebooks by track */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Starter notebooks by track</h2>
            {STARTER_NOTEBOOKS.map((track) => {
              const colors = colorMap[track.color];
              return (
                <div key={track.track} className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/6 flex items-center gap-2">
                    <span className="text-lg">{track.icon}</span>
                    <span className="text-white font-semibold text-sm">{track.track}</span>
                    <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ml-auto ${colors.pill}`}>
                      {track.notebooks.length} notebooks
                    </span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {track.notebooks.map((nb) => (
                      <button
                        key={nb.label}
                        onClick={() => launch(nb.url)}
                        className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors group"
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium group-hover:text-sky-300 transition-colors">{nb.label}</div>
                          <div className="text-white/35 text-xs">{nb.desc}</div>
                        </div>
                        <span className="text-white/20 group-hover:text-white/50 text-xs shrink-0 transition-colors">Open →</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* JupyterHub notice */}
          {IS_JUPYTERHUB && (
            <div className="bg-sky-500/[0.05] border border-sky-500/20 rounded-2xl p-5 flex gap-4 items-start">
              <span className="text-2xl shrink-0">🖥️</span>
              <div>
                <div className="text-sky-300 font-semibold text-sm">JupyterHub is live on DAQS VPS</div>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">
                  Full persistent notebooks with NumPy, Pandas, Matplotlib, and Scikit-learn. Your files are saved between sessions. Click <strong className="text-white/60">Open JupyterHub ↗</strong> above to launch in a full tab.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── Notebook iframe ── */
        <div className="flex-1 flex flex-col">
          {/* Tutor code banner in iframe view */}
          {tutorCode && (
            <div className="bg-sky-500/[0.07] border-b border-sky-500/25 px-4 py-2.5 flex items-center gap-3 shrink-0 flex-wrap">
              <span className="text-sky-300 text-xs font-bold flex items-center gap-1.5">🤖 AI Tutor Code ready</span>
              <span className="text-white/40 text-xs flex-1 min-w-0">Open a new cell in the notebook → press Ctrl+V (or Cmd+V) to paste</span>
              <button
                onClick={copyCode}
                className="text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white px-3 py-1 rounded-lg transition-colors shrink-0"
              >
                {codeCopied ? "✓ Copied!" : "📋 Copy code"}
              </button>
              <button onClick={() => setTutorCode(null)} className="text-white/30 hover:text-white/60 text-base shrink-0">×</button>
            </div>
          )}

          {/* Toolbar */}
          <div className="h-10 bg-[#0d0d14] border-b border-white/8 flex items-center px-4 gap-3 shrink-0">
            <button
              onClick={() => setLaunched(false)}
              className="text-white/40 hover:text-white text-xs transition-colors flex items-center gap-1.5"
            >
              ← Notebook home
            </button>
            <div className="w-px h-4 bg-white/10" />
            <a
              href="/dashboard/tutor"
              className="text-sky-400 hover:text-sky-300 text-xs transition-colors flex items-center gap-1"
            >
              ← Back to AI Tutor
            </a>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-white/30 text-xs">{IS_JUPYTERHUB ? "JupyterHub" : "JupyterLite"}</span>
            {loading && (
              <>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-amber-400 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Loading Python runtime…
                </span>
              </>
            )}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-white/20 text-[10px]">{IS_JUPYTERHUB ? "DAQS VPS" : "Interim · browser-based"}</span>
              <a
                href={iframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 border border-sky-500/25 rounded-lg px-2.5 py-1 transition-colors"
              >
                Open full screen ↗
              </a>
            </div>
          </div>

          {/* iframe */}
          <iframe
            key={iframeUrl}
            src={iframeUrl}
            className="flex-1 w-full border-0"
            onLoad={() => setLoading(false)}
            allow="cross-origin-isolated"
            sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups"
          />
        </div>
      )}
    </div>
  );
}
