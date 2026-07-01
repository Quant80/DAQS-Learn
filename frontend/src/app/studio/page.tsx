"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useStudio, TEMPLATES } from "@/store/studio";
import type { StudioFile } from "@/store/studio";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Pyodide ────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide: (cfg: { indexURL: string }) => Promise<any>;
  }
}
const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyPromise: Promise<any> | null = null;
function getPy() {
  if (pyPromise) return pyPromise;
  pyPromise = (async () => {
    if (!document.querySelector('script[data-pyodide]')) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = `${PYODIDE_CDN}pyodide.js`;
        s.setAttribute("data-pyodide", "1");
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Pyodide failed to load"));
        document.head.appendChild(s);
      });
    }
    const py = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    await py.loadPackage(["numpy", "sqlite3"]);
    return py;
  })();
  return pyPromise;
}

const LABS_API = process.env.NEXT_PUBLIC_LABS_API_URL;

async function execPython(code: string) {
  if (LABS_API) {
    try {
      const res = await fetch(`${LABS_API}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "python", code }),
      });
      const data = await res.json();
      return { out: data.output ?? "", err: data.error ?? "", ok: data.exitCode === 0 };
    } catch { /* fall through */ }
  }
  const py = await getPy();
  let stdout = "", stderr = "";
  py.setStdout({ batched: (s: string) => { stdout += s + "\n"; } });
  py.setStderr({ batched: (s: string) => { stderr += s + "\n"; } });
  try {
    await py.runPythonAsync(code);
    return { out: stdout.trimEnd(), err: "", ok: true };
  } catch (e) {
    return { out: stdout.trimEnd(), err: String(e).replace(/^PythonError:\s*/, ""), ok: false };
  }
}

function execJS(code: string) {
  const logs: string[] = [];
  const fakeConsole = {
    log:   (...a: unknown[]) => logs.push(a.map(String).join(" ")),
    error: (...a: unknown[]) => logs.push("Error: " + a.map(String).join(" ")),
    warn:  (...a: unknown[]) => logs.push("Warn: "  + a.map(String).join(" ")),
  };
  try {
    // eslint-disable-next-line no-new-func
    new Function("console", code)(fakeConsole);
    return { out: logs.join("\n"), err: "", ok: true };
  } catch (e) {
    return { out: logs.join("\n"), err: String(e), ok: false };
  }
}

const LANG_ICON: Record<string, string> = {
  python: "🐍", javascript: "🟨", typescript: "🔷",
  html: "🌐", css: "🎨", markdown: "📝", json: "📋",
};
function FileIcon({ lang }: { lang: string }) {
  return <span className="text-xs">{LANG_ICON[lang] ?? "📄"}</span>;
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { createProject } = useStudio();
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111118] border border-white/12 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-white font-bold text-base">New project</h2>
        <div className="space-y-2">
          {Object.entries(TEMPLATES).map(([key, tmpl]) => (
            <button
              key={key}
              onClick={() => { createProject(key as keyof typeof TEMPLATES); onClose(); }}
              className="w-full text-left bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 rounded-xl p-4 transition-colors"
            >
              <div className="text-white font-semibold text-sm">{tmpl.name}</div>
              <div className="text-white/35 text-xs mt-0.5">{tmpl.files.length} files</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full text-white/30 text-xs hover:text-white/60 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function QuickStudioFullscreen() {
  const {
    projects, activeProjectId, openFileIds, activeFileId,
    createProject, deleteProject, renameProject, setActiveProject,
    createFile, deleteFile, renameFile, updateFileContent,
    openFile, closeFile, setActiveFile, getActiveProject, getActiveFile,
  } = useStudio();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [showNewProject, setShowNewProject] = useState(false);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renamingProject, setRenamingProject] = useState(false);
  const [projectRenameValue, setProjectRenameValue] = useState("");
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState<"idle" | "ok" | "err">("idle");
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [addingFile, setAddingFile] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const project    = mounted ? getActiveProject() : null;
  const activeFile = mounted ? getActiveFile() : null;
  const openFiles  = project?.files.filter((f) => openFileIds.includes(f.id)) ?? [];

  useEffect(() => {
    setPyStatus("loading");
    getPy().then(() => setPyStatus("ready")).catch(() => setPyStatus("error"));
  }, []);

  useEffect(() => {
    if (renamingFile && renameInputRef.current) renameInputRef.current.focus();
  }, [renamingFile]);

  const run = useCallback(async () => {
    if (!activeFile || running) return;
    setRunning(true);
    setOutput("");
    setOutputType("idle");
    setShowPreview(false);

    if (activeFile.language === "html") {
      let html = activeFile.content;
      if (project) {
        const cssFile = project.files.find((f) => f.language === "css");
        const jsFile  = project.files.find((f) => f.language === "javascript");
        if (cssFile) html = html.replace(/<link[^>]*stylesheet[^>]*>/gi, `<style>${cssFile.content}</style>`);
        if (jsFile)  html = html.replace(/<script[^>]*src[^>]*><\/script>/gi, `<script>${jsFile.content}</script>`);
      }
      setPreviewHtml(html); setShowPreview(true); setRunning(false); return;
    }

    if (activeFile.language === "python") {
      const r = await execPython(activeFile.content);
      setOutput((r.out + (r.err ? "\n" + r.err : "")).trim() || "(no output)");
      setOutputType(r.ok ? "ok" : "err");
    } else if (activeFile.language === "javascript" || activeFile.language === "typescript") {
      const r = execJS(activeFile.content);
      setOutput((r.out + (r.err ? "\n" + r.err : "")).trim() || "(no output)");
      setOutputType(r.ok ? "ok" : "err");
    } else {
      setOutput(`Cannot run .${activeFile.name.split(".").pop()} files directly.`);
      setOutputType("err");
    }
    setRunning(false);
  }, [activeFile, project, running]);

  function startRenameFile(file: StudioFile) { setRenamingFile(file.id); setRenameValue(file.name); }
  function commitRenameFile() {
    if (renamingFile && project && renameValue.trim()) renameFile(project.id, renamingFile, renameValue.trim());
    setRenamingFile(null);
  }
  function addFile() {
    if (!project || !newFileName.trim()) return;
    const name = newFileName.trim().includes(".") ? newFileName.trim() : newFileName.trim() + ".py";
    createFile(project.id, name);
    setNewFileName(""); setAddingFile(false);
  }

  const canRun = activeFile && (activeFile.language !== "python" || pyStatus === "ready");

  if (!mounted) return null;

  // ── Welcome screen ──
  if (projects.length === 0 || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a10] p-8 text-center space-y-6">
        {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
        <div className="w-16 h-16 rounded-2xl bg-blue-600/15 border border-blue-600/25 flex items-center justify-center text-3xl">⚡</div>
        <div>
          <h1 className="text-2xl font-bold text-white">Quick Studio</h1>
          <p className="text-white/40 text-sm mt-2 max-w-sm leading-relaxed">
            A lightweight in-browser IDE. Write Python, JavaScript, TypeScript, and HTML — no server required.
          </p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/20"
        >
          + New Project
        </button>
        <Link href="/dashboard/studio" className="text-white/25 text-xs hover:text-white/50 transition-colors">
          ← Back to Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a10]">
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}

      {/* ── Slim top bar ── */}
      <div className="h-10 bg-[#0d0d18] border-b border-white/8 flex items-center px-3 gap-2 shrink-0">
        {/* Logo mark */}
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-600/30 to-blue-400/20 border border-blue-500/20 flex items-center justify-center text-[10px]">⚡</div>
        <span className="text-white/60 text-xs font-semibold">Quick Studio</span>

        {/* Project picker */}
        <div className="w-px h-4 bg-white/10 mx-1" />
        <select
          value={activeProjectId ?? ""}
          onChange={(e) => setActiveProject(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg text-white text-xs px-2 py-1 focus:outline-none max-w-[140px]"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#111118]">{p.name}</option>
          ))}
        </select>
        <button
          onClick={() => setShowNewProject(true)}
          className="text-white/35 hover:text-white text-xs border border-white/10 rounded-lg px-2 py-1 transition-colors"
        >
          + New
        </button>

        {/* Run */}
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={run}
          disabled={!canRun || running}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
        >
          {running ? "⏳ Running…" : "▶ Run"}
        </button>

        {activeFile?.language === "html" && (
          <button
            onClick={() => setShowPreview((p) => !p)}
            className="text-xs text-sky-400 border border-sky-500/30 rounded-lg px-2.5 py-1 hover:border-sky-500/60 transition-colors"
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>
        )}

        {/* Python status + Collapse */}
        <div className="ml-auto flex items-center gap-2">
          <div className={`hidden sm:flex items-center gap-1.5 text-[10px] font-semibold ${
            pyStatus === "ready"   ? "text-emerald-400" :
            pyStatus === "loading" ? "text-amber-400"   : "text-white/25"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              pyStatus === "ready"   ? "bg-emerald-400" :
              pyStatus === "loading" ? "bg-amber-400 animate-pulse" : "bg-white/15"
            }`} />
            {pyStatus === "ready" ? "Python ready" : pyStatus === "loading" ? "Loading…" : ""}
          </div>
          <Link
            href="/dashboard/studio"
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/25 hover:border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 rounded-lg px-3 py-1.5 transition-all"
            title="Return to dashboard"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4.5 1H1v3.5M7.5 1H11v3.5M11 7.5V11H7.5M1 7.5V11h3.5" />
            </svg>
            Collapse
          </Link>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── File tree ── */}
        <div className="w-48 shrink-0 border-r border-white/8 flex flex-col bg-[#09090f]">
          <div className="px-3 py-2 border-b border-white/6">
            {renamingProject ? (
              <input
                autoFocus
                value={projectRenameValue}
                onChange={(e) => setProjectRenameValue(e.target.value)}
                onBlur={() => { if (project && projectRenameValue.trim()) renameProject(project.id, projectRenameValue.trim()); setRenamingProject(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") { if (project && projectRenameValue.trim()) renameProject(project.id, projectRenameValue.trim()); setRenamingProject(false); } if (e.key === "Escape") setRenamingProject(false); }}
                className="w-full bg-white/10 border border-blue-500/40 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none"
              />
            ) : (
              <div
                className="text-white/70 text-xs font-semibold truncate cursor-pointer hover:text-white transition-colors"
                onDoubleClick={() => { setRenamingProject(true); setProjectRenameValue(project.name); }}
                title="Double-click to rename"
              >
                {project.name}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {project.files.map((file) => (
              <div
                key={file.id}
                onClick={() => openFile(file.id)}
                className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer group transition-colors ${
                  activeFileId === file.id ? "bg-white/8 text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                }`}
              >
                <FileIcon lang={file.language} />
                {renamingFile === file.id ? (
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRenameFile}
                    onKeyDown={(e) => { if (e.key === "Enter") commitRenameFile(); if (e.key === "Escape") setRenamingFile(null); }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-white/10 border border-blue-500/40 rounded px-1 text-white text-xs focus:outline-none min-w-0"
                  />
                ) : (
                  <span className="text-xs truncate flex-1" onDoubleClick={(e) => { e.stopPropagation(); startRenameFile(file); }}>
                    {file.name}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); if (project.files.length > 1) deleteFile(project.id, file.id); }}
                  className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-xs transition-all shrink-0"
                >×</button>
              </div>
            ))}

            {addingFile ? (
              <div className="px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs">📄</span>
                <input
                  autoFocus
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={() => { addFile(); setAddingFile(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") addFile(); if (e.key === "Escape") { setAddingFile(false); setNewFileName(""); } }}
                  placeholder="filename.py"
                  className="flex-1 bg-white/10 border border-blue-500/40 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none min-w-0 placeholder-white/25"
                />
              </div>
            ) : (
              <button
                onClick={() => setAddingFile(true)}
                className="w-full text-left px-3 py-1.5 text-white/25 hover:text-white/60 text-xs transition-colors flex items-center gap-2"
              >
                <span>+</span> New file
              </button>
            )}
          </div>

          <div className="p-2 border-t border-white/6">
            <button
              onClick={() => { if (confirm(`Delete "${project.name}"?`)) deleteProject(project.id); }}
              className="w-full text-xs text-white/20 hover:text-red-400 transition-colors py-1"
            >
              Delete project
            </button>
          </div>
        </div>

        {/* ── Editor + output ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {openFiles.length > 0 && (
            <div className="h-8 bg-[#0c0c14] border-b border-white/8 flex items-end overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
              {openFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`flex items-center gap-1.5 px-3 h-full border-r border-white/8 cursor-pointer text-xs shrink-0 transition-colors ${
                    activeFileId === file.id
                      ? "bg-[#0a0a10] text-white border-t-2 border-t-blue-500"
                      : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                  }`}
                >
                  <FileIcon lang={file.language} />
                  <span>{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); closeFile(file.id); }} className="text-white/30 hover:text-white/70 ml-1 leading-none">×</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex-1 min-h-0 flex flex-col">
            {showPreview && activeFile?.language === "html" ? (
              <div className="flex-1 min-h-0">
                <iframe srcDoc={previewHtml} className="w-full h-full border-0" sandbox="allow-scripts" title="Preview" />
              </div>
            ) : activeFile ? (
              <div className="flex-1 min-h-0">
                <MonacoEditor
                  key={activeFile.id}
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  onChange={(v) => project && updateFileContent(project.id, activeFile.id, v ?? "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    lineNumbers: "on",
                    renderLineHighlight: "all",
                    bracketPairColorization: { enabled: true },
                    automaticLayout: true,
                    wordWrap: "off",
                    tabSize: 4,
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/20 text-sm">
                Select a file to edit
              </div>
            )}
          </div>

          {/* Output terminal */}
          {!showPreview && (
            <div className="h-44 border-t border-white/8 bg-[#06060d] shrink-0 flex flex-col">
              <div className="h-7 border-b border-white/6 flex items-center px-3 gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500/50" />
                <span className="w-2 h-2 rounded-full bg-amber-500/50" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                <span className="text-[10px] text-white/30 uppercase tracking-wider ml-1">Terminal</span>
                {outputType !== "idle" && (
                  <span className={`text-[10px] font-bold ml-auto ${outputType === "ok" ? "text-emerald-400" : "text-red-400"}`}>
                    {outputType === "ok" ? "✓ OK" : "✗ Error"}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {running ? (
                  <span className="text-white/30 text-xs animate-pulse">Running…</span>
                ) : output ? (
                  <pre className={`text-xs font-mono leading-relaxed whitespace-pre-wrap ${outputType === "err" ? "text-red-400" : "text-emerald-300"}`}>
                    {output}
                  </pre>
                ) : (
                  <span className="text-white/20 text-xs">Press ▶ Run to execute the active file</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
