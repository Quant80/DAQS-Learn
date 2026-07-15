"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { userWorkspaceDir } from "@/lib/notebookPaths";

const NOTEBOOK_URL = process.env.NEXT_PUBLIC_NOTEBOOK_URL ?? "http://localhost:8888";
const NOTEBOOK_TOKEN = process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "daqs2024";

type Status = "checking" | "preparing" | "online" | "offline";

const STATUS_LABEL: Record<Status, string> = {
  checking: "Checking…",
  preparing: "Preparing your workspace…",
  online: "Online",
  offline: "Offline",
};

export default function NotebookPage() {
  const email = useAuthStore((s) => s.user?.email);
  const [status, setStatus] = useState<Status>("checking");
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!email) return;
    setStatus("checking");
    fetch(`${NOTEBOOK_URL}/api`, { mode: "no-cors" })
      .then(async () => {
        setStatus("preparing");
        try {
          const res = await fetch("/api/notebooks/ensure-workspace", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          setWorkspacePath(data.path ?? userWorkspaceDir(email));
        } catch {
          setWorkspacePath(userWorkspaceDir(email));
        }
        setStatus("online");
      })
      .catch(() => setStatus("offline"));
  }, [email]);

  useEffect(() => { connect(); }, [connect]);

  const labUrl = workspacePath
    ? `${NOTEBOOK_URL}/lab/tree/${workspacePath}?token=${NOTEBOOK_TOKEN}`
    : `${NOTEBOOK_URL}/lab?token=${NOTEBOOK_TOKEN}`;
  const ready = status === "online" && workspacePath;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 0px)" }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 bg-[#060d1a] shrink-0">
        <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-lg">
          🧮
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">DAQS Notebook</h1>
          <p className="text-white/35 text-[10px]">JupyterLab · Python · Data Science</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Status pill */}
          <div className={`flex items-center gap-1.5 text-xs font-medium ${
            status === "online"   ? "text-emerald-400" :
            status === "offline"  ? "text-red-400"     : "text-white/40"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === "online"   ? "bg-emerald-400" :
              status === "offline"  ? "bg-red-400"     : "bg-white/30 animate-pulse"
            }`} />
            {STATUS_LABEL[status]}
          </div>

          {ready && (
            <a
              href={labUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-sky-400 hover:text-sky-300 border border-sky-500/25 hover:border-sky-500/40 rounded-lg px-3 py-1.5 transition-all"
            >
              Open in new tab ↗
            </a>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {status === "offline" ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-6 px-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl">
            🧮
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Notebook Service Offline</h2>
            <p className="text-white/45 text-sm max-w-sm">
              The DAQS Notebook service is not running. Start it with Docker Compose, then refresh.
            </p>
          </div>
          <div className="bg-[#0a1628] border border-white/10 rounded-xl px-5 py-4 text-left max-w-sm w-full">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Start the service</p>
            <code className="text-emerald-300 text-xs font-mono">docker compose up notebook</code>
          </div>
          <button
            onClick={connect}
            className="text-sm text-sky-400 hover:text-sky-300 border border-sky-500/25 hover:border-sky-500/40 rounded-xl px-4 py-2 transition-all"
          >
            Retry connection
          </button>
        </div>
      ) : ready ? (
        <iframe
          src={labUrl}
          className="flex-1 border-0 w-full"
          allow="clipboard-read; clipboard-write"
          title="DAQS Notebook — JupyterLab"
        />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 px-6">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-orange-400 animate-spin" />
          <p className="text-white/40 text-sm">{STATUS_LABEL[status]}</p>
        </div>
      )}
    </div>
  );
}
