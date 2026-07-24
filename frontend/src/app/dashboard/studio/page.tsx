"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useStudio, TEMPLATES } from "@/store/studio";
import type { StudioFile } from "@/store/studio";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Env ────────────────────────────────────────────────────────────────────────
const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL ?? "http://localhost:8080";
const LABS_API   = process.env.NEXT_PUBLIC_LABS_API_URL;

// ── Pyodide (shared singleton) ─────────────────────────────────────────────────
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

// ── Constants ──────────────────────────────────────────────────────────────────
const LANG_ICON: Record<string, string> = {
  python: "/Python-Logo.png", javascript: "🟨", typescript: "🔷",
  html: "🌐", css: "🎨", markdown: "📝", json: "📋",
};

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

// ── Tab type ───────────────────────────────────────────────────────────────────
type StudioTab = "full" | "quick";

// ── Full Studio pane (code-server) ─────────────────────────────────────────────
function FullStudioPane({ status }: { status: "checking" | "online" | "offline" }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-5xl space-y-6">
        {/* Hero card */}
        <div className="bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-500/20 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/25 to-indigo-500/15 border border-sky-500/30 flex items-center justify-center text-4xl shadow-lg shadow-sky-500/10">
            💻
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Full VS Code in Your Browser</h2>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed mx-auto">
              DAQS Studio gives you a complete VS Code environment — with extensions, an integrated
              terminal, Git, and debugging — accessible from any browser, no install required.
            </p>
          </div>

          {status === "offline" ? (
            <div className="w-full max-w-md space-y-3 text-left">
              <div className="bg-black/30 border border-white/10 rounded-xl px-5 py-4">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Start the service</p>
                <code className="text-emerald-300 text-xs font-mono">docker compose up studio</code>
              </div>
              <p className="text-white/30 text-xs text-center">
                Default password: <code className="text-white/50 font-mono">daqs2024</code>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-sky-500/25 text-sm"
              >
                Launch DAQS Studio ↗
              </a>
              <p className="text-white/25 text-xs">
                Password: <code className="text-white/40 font-mono">daqs2024</code>
              </p>
            </div>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-base">⌨️</span> Keyboard Shortcuts
            </h2>
            <div className="space-y-3">
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

          <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-base">✨</span> What&apos;s Included
            </h2>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-xs text-white/60">
                  <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-white/20 text-xs text-center">
          Studio opens in a new tab — code-server's security policy prevents embedding in iframes.
        </p>
      </div>
    </div>
  );
}

// ── File icon ──────────────────────────────────────────────────────────────────
function FileIcon({ lang }: { lang: string }) {
  const icon = LANG_ICON[lang] ?? "📄";
  if (icon.startsWith("/")) return <img src={icon} alt="" className="w-3 h-3 object-contain" />;
  return <span className="text-xs">{icon}</span>;
}

// ── File tree (folders derived from "/"-separated file/folder paths) ──────────
type TreeNode =
  | { type: "folder"; path: string; name: string; children: TreeNode[] }
  | { type: "file"; path: string; name: string; file: StudioFile };

function buildFileTree(files: StudioFile[], folders: string[]): TreeNode[] {
  type FolderAcc = { folders: Map<string, FolderAcc>; files: StudioFile[] };
  const root: FolderAcc = { folders: new Map(), files: [] };

  function folderAt(path: string): FolderAcc {
    let node = root;
    let acc = "";
    for (const seg of path.split("/")) {
      if (!seg) continue;
      acc = acc ? `${acc}/${seg}` : seg;
      if (!node.folders.has(seg)) node.folders.set(seg, { folders: new Map(), files: [] });
      node = node.folders.get(seg)!;
    }
    return node;
  }

  for (const folder of folders) folderAt(folder);
  for (const file of files) {
    const segs = file.name.split("/");
    segs.pop();
    folderAt(segs.join("/")).files.push(file); // keep file.name as the full original path
  }

  function toNodes(acc: FolderAcc, prefix: string): TreeNode[] {
    const folderNodes: TreeNode[] = [...acc.folders.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, child]) => ({
        type: "folder" as const,
        path: prefix ? `${prefix}/${name}` : name,
        name,
        children: toNodes(child, prefix ? `${prefix}/${name}` : name),
      }));
    const fileNodes: TreeNode[] = [...acc.files]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => ({ type: "file" as const, path: f.name, name: f.name.split("/").pop()!, file: f }));
    return [...folderNodes, ...fileNodes];
  }

  return toNodes(root, "");
}

/** Every folder path an item at `path` sits inside, e.g. "a/b/c.py" → ["a", "a/b"]. */
function ancestorFolders(path: string): string[] {
  const segs = path.split("/");
  segs.pop();
  const out: string[] = [];
  let acc = "";
  for (const seg of segs) {
    acc = acc ? `${acc}/${seg}` : seg;
    out.push(acc);
  }
  return out;
}

// ── New project modal ──────────────────────────────────────────────────────────
function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { createProject } = useStudio();
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
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

// ── Quick Studio pane (Monaco + Pyodide) ───────────────────────────────────────
function QuickStudioPane({ pyStatus, running, showNewProject, setShowNewProject, registerRunFn }: {
  pyStatus: "idle" | "loading" | "ready" | "error";
  running: boolean;
  showNewProject: boolean;
  setShowNewProject: (v: boolean) => void;
  registerRunFn: (fn: () => Promise<void>) => void;
}) {
  const {
    projects, activeProjectId, openFileIds, activeFileId,
    createProject, deleteProject, renameProject, setActiveProject,
    createFile, deleteFile, renameFile, updateFileContent,
    createFolder, deleteFolder, renameFolder,
    openFile, closeFile, setActiveFile, getActiveProject, getActiveFile,
  } = useStudio();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renamingProject, setRenamingProject] = useState(false);
  const [projectRenameValue, setProjectRenameValue] = useState("");
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState<"idle" | "ok" | "err">("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [folderRenameValue, setFolderRenameValue] = useState("");
  const [adding, setAdding] = useState<{ parentPath: string; kind: "file" | "folder" } | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  const project  = mounted ? getActiveProject() : null;
  const activeFile = mounted ? getActiveFile() : null;
  const openFiles = project?.files.filter((f) => openFileIds.includes(f.id)) ?? [];
  const fileTree = project ? buildFileTree(project.files, project.folders ?? []) : [];

  useEffect(() => {
    if (renamingFile && renameInputRef.current) renameInputRef.current.focus();
  }, [renamingFile]);

  // Start every folder expanded when a project is opened, so all files are discoverable
  useEffect(() => {
    if (!project) return;
    const all = new Set<string>();
    (function collect(nodes: TreeNode[]) {
      for (const n of nodes) if (n.type === "folder") { all.add(n.path); collect(n.children); }
    })(buildFileTree(project.files, project.folders ?? []));
    setExpandedFolders(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  // Register run function with parent on every render so it's always current
  const runFn = useCallback(async () => {
    if (!activeFile) return;
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
      setPreviewHtml(html);
      setShowPreview(true);
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
  }, [activeFile, project]);

  useEffect(() => { registerRunFn(runFn); }, [runFn, registerRunFn]);

  function startRenameFile(file: StudioFile) {
    setRenamingFile(file.id);
    setRenameValue(file.name.split("/").pop()!);
  }
  function commitRenameFile() {
    if (renamingFile && project && renameValue.trim()) {
      const file = project.files.find((f) => f.id === renamingFile);
      if (file) {
        const segs = file.name.split("/");
        segs[segs.length - 1] = renameValue.trim();
        renameFile(project.id, renamingFile, segs.join("/"));
      }
    }
    setRenamingFile(null);
  }

  function toggleFolder(path: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }
  function startAdd(parentPath: string, kind: "file" | "folder") {
    setAdding({ parentPath, kind });
    setNewItemName("");
    if (parentPath) setExpandedFolders((prev) => new Set(prev).add(parentPath));
  }
  function commitAdd() {
    if (!project || !adding || !newItemName.trim()) { setAdding(null); return; }
    const leaf = newItemName.trim();
    const fullPath = adding.parentPath ? `${adding.parentPath}/${leaf}` : leaf;
    if (adding.kind === "file") {
      const name = fullPath.includes(".") ? fullPath : `${fullPath}.py`;
      createFile(project.id, name);
    } else {
      createFolder(project.id, fullPath);
    }
    setAdding(null);
    setNewItemName("");
  }
  function cancelAdd() { setAdding(null); setNewItemName(""); }

  function startRenameFolder(path: string) {
    setRenamingFolder(path);
    setFolderRenameValue(path.split("/").pop()!);
  }
  function commitRenameFolder() {
    if (renamingFolder && project && folderRenameValue.trim()) {
      const segs = renamingFolder.split("/");
      segs[segs.length - 1] = folderRenameValue.trim();
      const newPath = segs.join("/");
      if (newPath !== renamingFolder) renameFolder(project.id, renamingFolder, newPath);
    }
    setRenamingFolder(null);
  }
  function countFilesUnder(node: TreeNode): number {
    return node.type === "file" ? 1 : node.children.reduce((sum, c) => sum + countFilesUnder(c), 0);
  }
  function handleDeleteFolder(node: Extract<TreeNode, { type: "folder" }>) {
    if (!project) return;
    const total = node.children.reduce((sum, c) => sum + countFilesUnder(c), 0);
    if (total > 0 && !window.confirm(`Delete folder "${node.name}" and its ${total} file${total === 1 ? "" : "s"}?`)) return;
    deleteFolder(project.id, node.path);
  }

  function renderAddRow(depth: number, kind: "file" | "folder") {
    return (
      <div className="flex items-center gap-1.5 py-1.5" style={{ paddingLeft: 10 + depth * 14 }}>
        <span className="text-xs shrink-0">{kind === "folder" ? "📁" : "📄"}</span>
        <input
          autoFocus
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onBlur={commitAdd}
          onKeyDown={(e) => { if (e.key === "Enter") commitAdd(); if (e.key === "Escape") cancelAdd(); }}
          placeholder={kind === "folder" ? "folder name" : "filename.py"}
          className="flex-1 bg-white/10 border border-blue-500/40 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none min-w-0 placeholder-white/25"
        />
      </div>
    );
  }

  function renderNodes(nodes: TreeNode[], depth: number) {
    return nodes.map((node) => {
      if (node.type === "folder") {
        const expanded = expandedFolders.has(node.path);
        return (
          <div key={node.path}>
            <div
              onClick={() => toggleFolder(node.path)}
              style={{ paddingLeft: 10 + depth * 14 }}
              className="flex items-center gap-1.5 pr-2 py-1.5 cursor-pointer group transition-colors text-white/55 hover:bg-white/[0.04] hover:text-white/85"
            >
              <span className="text-[9px] w-2.5 shrink-0 text-white/35">{expanded ? "▾" : "▸"}</span>
              <span className="text-xs shrink-0">📁</span>
              {renamingFolder === node.path ? (
                <input
                  autoFocus
                  value={folderRenameValue}
                  onChange={(e) => setFolderRenameValue(e.target.value)}
                  onBlur={commitRenameFolder}
                  onKeyDown={(e) => { if (e.key === "Enter") commitRenameFolder(); if (e.key === "Escape") setRenamingFolder(null); }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-white/10 border border-blue-500/40 rounded px-1 text-white text-xs focus:outline-none min-w-0"
                />
              ) : (
                <span
                  className="text-xs truncate flex-1 font-medium"
                  onDoubleClick={(e) => { e.stopPropagation(); startRenameFolder(node.path); }}
                >
                  {node.name}
                </span>
              )}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => startAdd(node.path, "file")} title="New file" className="text-white/30 hover:text-white/70 text-[10px] px-0.5">📄+</button>
                <button onClick={() => startAdd(node.path, "folder")} title="New folder" className="text-white/30 hover:text-white/70 text-[10px] px-0.5">📁+</button>
                <button onClick={() => handleDeleteFolder(node)} title="Delete folder" className="text-white/30 hover:text-red-400 text-xs px-0.5">×</button>
              </div>
            </div>
            {expanded && (
              <>
                {renderNodes(node.children, depth + 1)}
                {adding?.parentPath === node.path && renderAddRow(depth + 1, adding.kind)}
              </>
            )}
          </div>
        );
      }

      const file = node.file;
      return (
        <div key={file.id}
          onClick={() => openFile(file.id)}
          style={{ paddingLeft: 10 + depth * 14 }}
          className={`flex items-center gap-2 pr-3 py-1.5 cursor-pointer group transition-colors ${
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
              {node.name}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); if (project && project.files.length > 1) deleteFile(project.id, file.id); }}
            className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-xs transition-all shrink-0"
          >×</button>
        </div>
      );
    });
  }

  if (!mounted) return null;

  // Welcome screen (no projects)
  if (projects.length === 0 || !project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-3xl">⚡</div>
        <div>
          <h2 className="text-xl font-bold text-white">Quick Studio</h2>
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
        <p className="text-white/25 text-xs">Python · JavaScript · HTML/CSS · Markdown</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0">
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}

      {/* File tree */}
      <div className="w-48 shrink-0 border-r border-white/8 flex flex-col bg-[#09090f]">
        <div className="px-3 py-2 border-b border-white/6 flex items-center gap-2">
          {renamingProject ? (
            <input
              autoFocus
              value={projectRenameValue}
              onChange={(e) => setProjectRenameValue(e.target.value)}
              onBlur={() => { if (project && projectRenameValue.trim()) renameProject(project.id, projectRenameValue.trim()); setRenamingProject(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") { if (project && projectRenameValue.trim()) renameProject(project.id, projectRenameValue.trim()); setRenamingProject(false); } if (e.key === "Escape") setRenamingProject(false); }}
              className="flex-1 bg-white/10 border border-blue-500/40 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none"
            />
          ) : (
            <div
              className="text-white/70 text-xs font-semibold truncate cursor-pointer hover:text-white transition-colors flex-1"
              onDoubleClick={() => { setRenamingProject(true); setProjectRenameValue(project.name); }}
              title="Double-click to rename"
            >
              {project.name}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {renderNodes(fileTree, 0)}
          {adding?.parentPath === "" && renderAddRow(0, adding.kind)}

          <div className="flex items-center gap-3 px-3 py-1.5 mt-1 border-t border-white/6">
            <button
              onClick={() => startAdd("", "file")}
              className="text-left text-white/25 hover:text-white/60 text-xs transition-colors flex items-center gap-1.5"
            >
              <span>+</span> File
            </button>
            <button
              onClick={() => startAdd("", "folder")}
              className="text-left text-white/25 hover:text-white/60 text-xs transition-colors flex items-center gap-1.5"
            >
              <span>+</span> Folder
            </button>
          </div>
        </div>

        <div className="p-2 space-y-1 border-t border-white/6">
          <select
            value={activeProjectId ?? ""}
            onChange={(e) => setActiveProject(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-xs px-2 py-1 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#111118]">{p.name}</option>
            ))}
          </select>
          <button
            onClick={() => { if (confirm(`Delete "${project.name}"?`)) deleteProject(project.id); }}
            className="w-full text-xs text-white/20 hover:text-red-400 transition-colors py-0.5"
          >
            Delete project
          </button>
        </div>
      </div>

      {/* Editor + output */}
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
                <span title={file.name}>{file.name.split("/").pop()}</span>
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
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function StudioPage() {
  const [tab, setTab] = useState<StudioTab>("full");
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [running, setRunning] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const childRunRef = useRef<() => Promise<void>>(undefined);
  const { getActiveFile } = useStudio();

  useEffect(() => {
    fetch(STUDIO_URL, { mode: "no-cors" })
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  useEffect(() => {
    if (tab === "quick" && pyStatus === "idle") {
      setPyStatus("loading");
      getPy().then(() => setPyStatus("ready")).catch(() => setPyStatus("error"));
    }
  }, [tab, pyStatus]);

  async function handleRun() {
    if (running || !childRunRef.current) return;
    setRunning(true);
    try { await childRunRef.current(); } finally { setRunning(false); }
  }

  const activeFile = getActiveFile();
  const canRun = tab === "quick" && activeFile && (activeFile.language !== "python" || pyStatus === "ready");

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#0a0a10]">

      {/* ── Unified header bar ── */}
      <div className="h-12 bg-[#0d0d18] border-b border-white/8 flex items-center px-4 gap-3 shrink-0">

        {/* Icon + title */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500/25 to-blue-500/35 border border-white/10 flex items-center justify-center text-sm">
            💻
          </div>
          <span className="text-white font-bold text-sm hidden sm:block">DAQS Studio</span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-0.5 bg-white/5 border border-white/8 rounded-xl p-1">
          <button
            onClick={() => setTab("full")}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              tab === "full"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
                : "text-sky-400/50 hover:text-sky-300"
            }`}
          >
            <span>💻</span>
            <span>Full Studio</span>
          </button>
          <button
            onClick={() => setTab("quick")}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              tab === "quick"
                ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md shadow-blue-500/30"
                : "text-blue-400/60 hover:text-blue-300"
            }`}
          >
            <span>⚡</span>
            <span>Quick Studio</span>
          </button>
        </div>

        {/* Right-side actions — contextual per tab */}
        <div className="ml-auto flex items-center gap-2">
          {tab === "full" ? (
            <>
              {/* Status */}
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${
                status === "online"  ? "text-emerald-400" :
                status === "offline" ? "text-red-400"     : "text-white/35"
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
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  status === "offline"
                    ? "bg-white/5 border border-white/10 text-white/25 pointer-events-none"
                    : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-md shadow-sky-500/20"
                }`}
              >
                Open Full Studio ↗
              </a>
            </>
          ) : (
            <>
              {/* Pyodide status */}
              <div className={`hidden sm:flex items-center gap-1.5 text-[10px] font-semibold ${
                pyStatus === "ready"   ? "text-emerald-400" :
                pyStatus === "loading" ? "text-amber-400"   : "text-white/25"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  pyStatus === "ready"   ? "bg-emerald-400" :
                  pyStatus === "loading" ? "bg-amber-400 animate-pulse" : "bg-white/15"
                }`} />
                {pyStatus === "ready" ? "Python ready" : pyStatus === "loading" ? "Loading Python…" : ""}
              </div>
              {/* Run */}
              <button
                onClick={handleRun}
                disabled={!canRun || running}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                {running ? "⏳ Running…" : "▶ Run"}
              </button>
              {/* New project */}
              <button
                onClick={() => setShowNewProject(true)}
                className="text-xs text-blue-400/70 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/40 rounded-xl px-3 py-2 transition-all"
              >
                + New Project
              </button>
              {/* Full page */}
              <Link
                href="/studio"
                title="Open Quick Studio full page"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/25 hover:border-blue-500/50 rounded-xl px-3 py-2 transition-all"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" />
                </svg>
                Expand
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-1 min-h-0">
        {tab === "full" ? (
          <FullStudioPane status={status} />
        ) : (
          <QuickStudioPane
            pyStatus={pyStatus}
            running={running}
            showNewProject={showNewProject}
            setShowNewProject={setShowNewProject}
            registerRunFn={(fn) => { childRunRef.current = fn; }}
          />
        )}
      </div>
    </div>
  );
}
