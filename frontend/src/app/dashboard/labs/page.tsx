"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { labTracks, colorMap } from "@/data/labs";
import type { LabExercise, LabTrack } from "@/data/labs";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Pyodide engine ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide: (cfg: { indexURL: string }) => Promise<any>;
    _pyodideInstance: unknown;
  }
}

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodidePromise: Promise<any> | null = null;

function getPyodide() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    if (!document.querySelector('script[data-pyodide]')) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = `${PYODIDE_CDN}pyodide.js`;
        s.setAttribute("data-pyodide", "1");
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Pyodide script"));
        document.head.appendChild(s);
      });
    }
    const py = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    // Pre-load packages used across exercises
    await py.loadPackage(["numpy", "sqlite3"]);
    return py;
  })();
  return pyodidePromise;
}

const LABS_API = process.env.NEXT_PUBLIC_LABS_API_URL;
const IS_VPS = !!LABS_API;

async function runPython(code: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  if (LABS_API) {
    try {
      const res = await fetch(`${LABS_API}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "python", code }),
      });
      const data = await res.json();
      return { stdout: data.output ?? "", stderr: data.error ?? "", exitCode: data.exitCode ?? 0 };
    } catch {
      // fall through to Pyodide
    }
  }
  const py = await getPyodide();
  let stdout = "";
  let stderr = "";

  py.setStdout({ batched: (s: string) => { stdout += s + "\n"; } });
  py.setStderr({ batched: (s: string) => { stderr += s + "\n"; } });

  try {
    await py.runPythonAsync(code);
    return { stdout: stdout.trimEnd(), stderr: "", exitCode: 0 };
  } catch (e) {
    const msg = String(e).replace(/^PythonError:\s*/, "");
    return { stdout: stdout.trimEnd(), stderr: msg, exitCode: 1 };
  }
}

// ── Pyodide status hook ────────────────────────────────────────────────────────
function usePyodideStatus() {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus("loading");
    getPyodide()
      .then(() => setStatus("ready"))
      .catch(() => setStatus("error"));
  }, []);

  return status;
}

// ── Exercise pane ──────────────────────────────────────────────────────────────
function ExercisePane({ exercise, pyStatus, onBack }: {
  exercise: LabExercise;
  pyStatus: "idle" | "loading" | "ready" | "error";
  onBack: () => void;
}) {
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [outputType, setOutputType] = useState<"idle" | "success" | "error">("idle");

  async function run() {
    if (pyStatus !== "ready") return;
    setRunning(true);
    setOutput("");
    setOutputType("idle");
    try {
      const result = await runPython(code);
      if (result.exitCode === 0) {
        setOutput(result.stdout || "(program ran with no output)");
        setOutputType("success");
      } else {
        setOutput(result.stderr || "(unknown error)");
        setOutputType("error");
      }
    } catch (e) {
      setOutput(e instanceof Error ? e.message : "Unexpected error");
      setOutputType("error");
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setCode(exercise.starterCode);
    setOutput("");
    setOutputType("idle");
    setShowSolution(false);
  }

  const canRun = pyStatus === "ready" && !running;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Top bar */}
      <div className="h-11 bg-[#0d0d14] border-b border-white/8 flex items-center px-4 gap-3 shrink-0">
        <button onClick={onBack} className="text-white/40 hover:text-white text-xs transition-colors">
          ← Labs
        </button>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-white/70 text-sm font-semibold truncate">{exercise.title}</span>

        {/* Pyodide status chip */}
        <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border ${
          pyStatus === "ready"   ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
          pyStatus === "loading" ? "bg-amber-500/10 border-amber-500/25 text-amber-400" :
          pyStatus === "error"   ? "bg-red-500/10 border-red-500/25 text-red-400" :
                                   "bg-white/5 border-white/10 text-white/30"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            pyStatus === "ready" ? "bg-emerald-400" :
            pyStatus === "loading" ? "bg-amber-400 animate-pulse" :
            pyStatus === "error" ? "bg-red-400" : "bg-white/20"
          }`} />
          {pyStatus === "ready" ? "Python ready" :
           pyStatus === "loading" ? "Loading Python…" :
           pyStatus === "error" ? "Load failed" : ""}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowHints((h) => !h)}
            className="text-xs text-amber-400/70 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded-lg px-2.5 py-1 transition-colors">
            💡 {showHints ? "Hide hints" : "Hints"}
          </button>
          <button onClick={() => setShowSolution((s) => !s)}
            className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-2.5 py-1 transition-colors">
            {showSolution ? "Hide solution" : "Show solution"}
          </button>
          <button onClick={reset}
            className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-2.5 py-1 transition-colors">
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left: instructions */}
        <div className="w-72 shrink-0 border-r border-white/8 flex flex-col bg-[#0a0a10]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Exercise</div>
              <h2 className="text-white font-bold text-base leading-snug">{exercise.title}</h2>
            </div>

            <p className="text-white/55 text-sm leading-relaxed">{exercise.description}</p>

            {showHints && (
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 space-y-2">
                <div className="text-amber-400 text-xs font-bold">Hints</div>
                {exercise.hints.map((h, i) => (
                  <div key={i} className="text-amber-300/70 text-xs flex gap-2">
                    <span className="shrink-0 opacity-50">{i + 1}.</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {showSolution && (
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-3">
                <div className="text-emerald-400 text-xs font-bold mb-2">Solution</div>
                <pre className="text-emerald-300/80 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
                  {exercise.solutionCode}
                </pre>
              </div>
            )}

            {exercise.expectedOutput && (
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                <div className="text-white/40 text-xs font-bold mb-1">Expected output</div>
                <pre className="text-white/60 text-[11px] font-mono">{exercise.expectedOutput}</pre>
              </div>
            )}
          </div>

          {/* Run button */}
          <div className="p-3 border-t border-white/8 space-y-2">
            {pyStatus === "loading" && (
              <div className="text-center text-[10px] text-amber-400/70 animate-pulse">
                Downloading Python runtime (~10 MB)…
              </div>
            )}
            <button
              onClick={run}
              disabled={!canRun}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {running ? (
                <><span className="animate-spin">⏳</span> Running…</>
              ) : pyStatus === "loading" ? (
                <>⏳ Loading Python…</>
              ) : (
                <><span>▶</span> Run code</>
              )}
            </button>
          </div>
        </div>

        {/* Right: editor + output */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              language="python"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                lineNumbers: "on",
                renderLineHighlight: "all",
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                wordWrap: "on",
                tabSize: 4,
              }}
            />
          </div>

          {/* Output panel */}
          <div className="h-44 border-t border-white/8 bg-[#080810] shrink-0 flex flex-col">
            <div className="flex items-center px-4 h-8 border-b border-white/6 gap-2 shrink-0">
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Output</span>
              {outputType !== "idle" && (
                <span className={`text-[10px] font-bold ml-auto ${outputType === "success" ? "text-emerald-400" : "text-red-400"}`}>
                  {outputType === "success" ? "✓ Completed" : "✗ Error"}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {running ? (
                <div className="text-white/30 text-xs animate-pulse">Executing…</div>
              ) : output ? (
                <pre className={`text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                  outputType === "error" ? "text-red-400" : "text-emerald-300"
                }`}>
                  {output}
                </pre>
              ) : (
                <div className="text-white/20 text-xs">Press ▶ Run to see output</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Track & Exercise browser ───────────────────────────────────────────────────
export default function LabsPage() {
  const [activeTrack, setActiveTrack] = useState<LabTrack>(labTracks[0]);
  const [activeExercise, setActiveExercise] = useState<LabExercise | null>(null);
  const pyStatus = usePyodideStatus();

  if (activeExercise) {
    return <ExercisePane exercise={activeExercise} pyStatus={pyStatus} onBack={() => setActiveExercise(null)} />;
  }

  const colors = colorMap[activeTrack.color] ?? colorMap["sky"];

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Track sidebar */}
      <div className="w-52 shrink-0 border-r border-white/8 bg-[#09090f] flex flex-col">
        <div className="p-3 border-b border-white/8">
          <div className="text-[10px] text-white/30 uppercase tracking-wider">Tracks</div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {labTracks.map((track) => {
            const c = colorMap[track.color] ?? colorMap["sky"];
            const isActive = track.id === activeTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrack(track)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors rounded-lg mx-1 ${
                  isActive ? `${c.bg} ${c.border} border` : "hover:bg-white/[0.03]"
                }`}
                style={{ width: "calc(100% - 8px)" }}
              >
                <span className="text-lg">{track.icon}</span>
                <div className="min-w-0">
                  <div className={`text-sm font-semibold ${isActive ? c.text : "text-white/60"}`}>
                    {track.label}
                  </div>
                  <div className="text-[10px] text-white/25">{track.exercises.length} exercises</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-white/8 space-y-1">
          <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${
            pyStatus === "ready" ? "text-emerald-400" :
            pyStatus === "loading" ? "text-amber-400" : "text-white/30"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              pyStatus === "ready" ? "bg-emerald-400" :
              pyStatus === "loading" ? "bg-amber-400 animate-pulse" : "bg-white/20"
            }`} />
            {pyStatus === "ready" ? "Python ready" :
             pyStatus === "loading" ? "Loading Python…" : "Python engine"}
          </div>
          <div className="text-[10px] text-white/20">{IS_VPS ? "DAQS VPS + Pyodide fallback" : "Pyodide · runs in browser"}</div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{activeTrack.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-white">{activeTrack.label} Labs</h1>
            <p className="text-white/40 text-sm">{activeTrack.exercises.length} exercises · {IS_VPS ? "Python on DAQS VPS" : "Python in browser"}</p>
          </div>
          {pyStatus === "loading" && (
            <div className="ml-auto flex items-center gap-2 text-xs text-amber-400/70 bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Loading Python runtime…
            </div>
          )}
        </div>

        <div className="space-y-3">
          {activeTrack.exercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className={`w-full text-left bg-white/[0.02] hover:bg-white/[0.05] border ${colors.border} rounded-2xl p-5 transition-all group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center text-sm font-bold shrink-0 ${colors.text}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm group-hover:text-sky-300 transition-colors">{ex.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.pill}`}>
                      PYTHON
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{ex.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-white/25 text-xs">{ex.hints.length} hints available</span>
                    {ex.expectedOutput && <span className="text-white/25 text-xs">· expected output provided</span>}
                  </div>
                </div>
                <span className="text-white/20 group-hover:text-white/60 text-sm transition-colors shrink-0">→</span>
              </div>
            </button>
          ))}
        </div>

        {IS_VPS ? (
          <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-2xl p-5 flex gap-4 items-start">
            <span className="text-2xl shrink-0">🐳</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-emerald-300 font-semibold text-sm">Docker Labs — Live on DAQS VPS</div>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">
                Code runs on the DAQS Oracle Cloud VPS (ARM · Ubuntu 22.04). Execution is fast, isolated, and server-side — no browser download needed.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/6 rounded-2xl p-5 flex gap-4 items-start">
            <span className="text-2xl shrink-0">🐳</span>
            <div>
              <div className="text-white/60 font-semibold text-sm">Docker Labs coming soon</div>
              <p className="text-white/25 text-xs mt-1 leading-relaxed">
                Full containerised environments will launch when a VPS is provisioned — isolated Linux shells with Docker, GPU access, and persistent storage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
