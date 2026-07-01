"use client";
import { useState } from "react";
import Link from "next/link";

const JUPYTERLITE_URL = "https://jupyterlite.github.io/demo/lab/index.html";

export default function NotebookFullscreen() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a10]">
      {/* Slim top bar */}
      <div className="h-10 bg-[#0d0d18] border-b border-white/8 flex items-center px-3 gap-3 shrink-0">
        <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-[10px]">📓</div>
        <span className="text-amber-300 text-xs font-semibold">JupyterLite</span>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-white/30 text-xs">Python · NumPy · Pandas · Matplotlib · Scikit-learn</span>

        {loading && (
          <>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-amber-400 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Loading Python runtime…
            </span>
          </>
        )}

        <div className="ml-auto flex items-center gap-2">
          <a
            href={JUPYTERLITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-400/70 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 rounded-lg px-2.5 py-1 transition-all"
          >
            Open tab ↗
          </a>
          <Link
            href="/dashboard/notebook"
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/25 hover:border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 rounded-lg px-3 py-1.5 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4.5 1H1v3.5M7.5 1H11v3.5M11 7.5V11H7.5M1 7.5V11h3.5" />
            </svg>
            Collapse
          </Link>
        </div>
      </div>

      <iframe
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
