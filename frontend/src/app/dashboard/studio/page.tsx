"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useStudio, TEMPLATES } from "@/store/studio";
import type { StudioFile } from "@/store/studio";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Pyodide (shared singleton — already warm if Labs was visited) ──────────────
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
const CODESERVER_URL = process.env.NEXT_PUBLIC_CODESERVER_URL;

async function execPython(code: string) {
  // Prefer Docker Labs API on VPS; fall back to Pyodide in browser
  if (LABS_API) {
    try {
      const res = await fetch(`${LABS_API}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "python", code }),
      });
      const data = await res.json();
      return { out: data.output ?? "", err: data.error ?? "", ok: data.exitCode === 0 };
    } catch {
      // fall through to Pyodide
    }
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

// ── Language icons ─────────────────────────────────────────────────────────────
const LANG_ICON: Record<string, string> = {
  python: "🐍", javascript: "🟨", typescript: "🔷",
  html: "🌐", css: "🎨", markdown: "📝", json: "📋",
};

// ── File icon ──────────────────────────────────────────────────────────────────
function FileIcon({ lang }: { lang: string }) {
  return <span className="text-xs">{LANG_ICON[lang] ?? "📄"}</span>;
}

// ── New project modal ──────────────────────────────────────────────────────────
function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { createProject } = useStudio();
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111118] border border-white/12 rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
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

// ── Main Studio ────────────────────────────────────────────────────────────────
export default function StudioPage() {
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

  const project = mounted ? getActiveProject() : null;
  const activeFile = mounted ? getActiveFile() : null;
  const openFiles = project?.files.filter((f) => openFileIds.includes(f.id)) ?? [];

  // Warm up Pyodide in background
  useEffect(() => {
    if (!mounted) return;
    setPyStatus("loading");
    getPy().then(() => setPyStatus("ready")).catch(() => setPyStatus("error"));
  }, [mounted]);

  useEffect(() => {
    if (renamingFile && renameInputRef.current) renameInputRef.current.focus();
  }, [renamingFile]);

  async function run() {
    if (!activeFile) return;
    setRunning(true);
    setOutput("");
    setOutputType("idle");
    setShowPreview(false);

    if (activeFile.language === "html") {
      // Build a composite HTML with linked CSS/JS inlined
      let html = activeFile.content;
      if (project) {
        const cssFile = project.files.find((f) => f.language === "css");
        const jsFile  = project.files.find((f) => f.language === "javascript");
        if (cssFile) html = html.replace(/<link[^>]*stylesheet[^>]*>/gi, `<style>${cssFile.content}</style>`);
        if (jsFile)  html = html.replace(/<script[^>]*src[^>]*><\/script>/gi, `<script>${jsFile.content}</script>`);
      }
      setPreviewHtml(html);
      setShowPreview(true);
      setRunning(false);
      return;
    }

    if (activeFile.language === "python") {
      const result = await execPython(activeFile.content);
      setOutput((result.out + (result.err ? "\n" + result.err : "")).trim() || "(no output)");
      setOutputType(result.ok ? "ok" : "err");
    } else if (activeFile.language === "javascript" || activeFile.language === "typescript") {
      const result = execJS(activeFile.content);
      setOutput((result.out + (result.err ? "\n" + result.err : "")).trim() || "(no output)");
      setOutputType(result.ok ? "ok" : "err");
    } else {
      setOutput(`Cannot run .${activeFile.name.split(".").pop()} files directly.`);
      setOutputType("err");
    }
    setRunning(false);
  }

  function startRenameFile(file: StudioFile) {
    setRenamingFile(file.id);
    setRenameValue(file.name);
  }

  function commitRenameFile() {
    if (renamingFile && project && renameValue.trim()) {
      renameFile(project.id, renamingFile, renameValue.trim());
    }
    setRenamingFile(null);
  }

  function addFile() {
    if (!project || !newFileName.trim()) return;
    const name = newFileName.trim().includes(".") ? newFileName.trim() : newFileName.trim() + ".py";
    createFile(project.id, name);
    setNewFileName("");
    setAddingFile(false);
  }

  const canRun = activeFile && (activeFile.language !== "python" || pyStatus === "ready");

  if (!mounted) return null;

  // ── No projects: welcome screen ──────────────────────────────────────────────
  if (projects.length === 0 || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] p-8 text-center space-y-6">
        {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
        <div className="text-6xl">💻</div>
        <div>
          <h1 className="text-2xl font-bold text-white">DAQS Studio</h1>
          <p className="text-white/45 text-sm mt-2">A lightweight code editor that runs in your browser.<br />Full OpenVSCode coming when VPS is provisioned.</p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors"
        >
          + New project
        </button>
        <p className="text-white/25 text-xs">Python · JavaScript · HTML/CSS · Markdown</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#0a0a10]">
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}

      {/* ── Top toolbar ── */}
      <div className="h-10 bg-[#0d0d16] border-b border-white/8 flex items-center px-3 gap-2 shrink-0">
        {/* Project picker */}
        <select
          value={activeProjectId ?? ""}
          onChange={(e) => setActiveProject(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg text-white text-xs px-2 py-1 focus:outline-none max-w-[140px]"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#111118]">{p.name}</option>
          ))}
        </select>

        <button onClick={() => setShowNewProject(true)}
          className="text-white/40 hover:text-white text-xs border border-white/10 rounded-lg px-2 py-1 transition-colors">
          + New
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Run button */}
        <button
          onClick={run}
          disabled={!canRun || running}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
        >
          {running ? "⏳ Running…" : "▶ Run"}
        </button>

        {activeFile?.language === "html" && (
          <button
            onClick={() => setShowPreview((p) => !p)}
            className="text-xs text-sky-400 border border-sky-500/30 rounded-lg px-2.5 py-1 transition-colors hover:border-sky-500/60"
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>
        )}

        {/* code-server VPS button */}
        {CODESERVER_URL && (
          <a
            href={CODESERVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 border border-sky-500/30 rounded-lg px-2.5 py-1 hover:border-sky-500/60 transition-colors flex items-center gap-1"
          >
            🖥️ Full IDE ↗
          </a>
        )}

        {/* Pyodide status */}
        <div className={`ml-auto flex items-center gap-1.5 text-[10px] font-semibold ${
          pyStatus === "ready" ? "text-emerald-400" :
          pyStatus === "loading" ? "text-amber-400" : "text-white/25"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            pyStatus === "ready" ? "bg-emerald-400" :
            pyStatus === "loading" ? "bg-amber-400 animate-pulse" : "bg-white/15"
          }`} />
          {pyStatus === "ready" ? "Python ready" : pyStatus === "loading" ? "Loading Python…" : ""}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── File tree ── */}
        <div className="w-48 shrink-0 border-r border-white/8 flex flex-col bg-[#09090f]">
          {/* Project name */}
          <div className="px-3 py-2 border-b border-white/6">
            {renamingProject ? (
              <input
                autoFocus
                value={projectRenameValue}
                onChange={(e) => setProjectRenameValue(e.target.value)}
                onBlur={() => { if (project && projectRenameValue.trim()) renameProject(project.id, projectRenameValue.trim()); setRenamingProject(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") { if (project && projectRenameValue.trim()) renameProject(project.id, projectRenameValue.trim()); setRenamingProject(false); } if (e.key === "Escape") setRenamingProject(false); }}
                className="w-full bg-white/10 border border-sky-500/40 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none"
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

          {/* Files */}
          <div className="flex-1 overflow-y-auto py-1">
            {project.files.map((file) => (
              <div key={file.id}
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
                    className="flex-1 bg-white/10 border border-sky-500/40 rounded px-1 text-white text-xs focus:outline-none min-w-0"
                  />
                ) : (
                  <span className="text-xs truncate flex-1" onDoubleClick={(e) => { e.stopPropagation(); startRenameFile(file); }}>
                    {file.name}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); if (project.files.length > 1) deleteFile(project.id, file.id); }}
                  className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-xs transition-all shrink-0"
                  title="Delete file"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add file */}
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
                  className="flex-1 bg-white/10 border border-sky-500/40 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none min-w-0 placeholder-white/25"
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

          {/* Delete project */}
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
          {/* Tab bar */}
          {openFiles.length > 0 && (
            <div className="h-8 bg-[#0c0c14] border-b border-white/8 flex items-end overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
              {openFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`flex items-center gap-1.5 px-3 h-full border-r border-white/8 cursor-pointer text-xs shrink-0 transition-colors ${
                    activeFileId === file.id
                      ? "bg-[#0a0a10] text-white border-t-2 border-t-sky-500"
                      : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                  }`}
                >
                  <FileIcon lang={file.language} />
                  <span>{file.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); closeFile(file.id); }}
                    className="text-white/30 hover:text-white/70 ml-1 leading-none"
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* Editor or preview */}
          <div className="flex-1 min-h-0 flex flex-col">
            {showPreview && activeFile?.language === "html" ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 min-h-0">
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    title="Preview"
                  />
                </div>
              </div>
            ) : activeFile ? (
              <div className="flex-1 min-h-0">
                <MonacoEditor
                  key={activeFile.id}
                  height="100%"
                  language={activeFile.language === "typescript" ? "typescript" : activeFile.language}
                  value={activeFile.content}
                  onChange={(v) => project && updateFileContent(project.id, activeFile.id, v ?? "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 10 },
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
            <div className="h-40 border-t border-white/8 bg-[#07070e] shrink-0 flex flex-col">
              <div className="h-7 border-b border-white/6 flex items-center px-3 gap-2 shrink-0">
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Terminal</span>
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
