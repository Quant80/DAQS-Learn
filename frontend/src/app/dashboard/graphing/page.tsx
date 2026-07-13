"use client";
import { useEffect, useRef, useState } from "react";

const DESMOS_API_KEY =
  process.env.NEXT_PUBLIC_DESMOS_API_KEY ?? "dcb31709b452b1cf9dc26972add0fda6";
const DESMOS_SCRIPT_SRC = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${DESMOS_API_KEY}`;

type Status = "loading" | "ready" | "error";

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (
        el: HTMLElement,
        options?: Record<string, unknown>
      ) => { destroy: () => void; setBlank: () => void };
    };
  }
}

const FEATURES = [
  "Plot any function, inequality, or point instantly",
  "Sliders for exploring parameters interactively",
  "Tables, regressions, and statistics",
  "Save and share graphs with a link",
];

export default function GraphingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<{ destroy: () => void } | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current?.requestFullscreen();
    }
  }

  useEffect(() => {
    let cancelled = false;

    function mount() {
      if (cancelled || !containerRef.current || !window.Desmos) return;
      calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        keypad: true,
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        expressionsTopbar: true,
      });
      setStatus("ready");
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${DESMOS_SCRIPT_SRC}"]`
    );

    if (window.Desmos) {
      mount();
    } else if (existing) {
      existing.addEventListener("load", mount);
      existing.addEventListener("error", () => !cancelled && setStatus("error"));
    } else {
      const script = document.createElement("script");
      script.src = DESMOS_SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", mount);
      script.addEventListener("error", () => !cancelled && setStatus("error"));
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      calculatorRef.current?.destroy();
      calculatorRef.current = null;
    };
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📐</span> Graphing Calculator
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Powered by Desmos — plot, explore, and share graphs interactively
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${
            status === "ready" ? "text-emerald-400" :
            status === "error" ? "text-red-400"     : "text-white/40"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === "ready" ? "bg-emerald-400" :
              status === "error" ? "bg-red-400"     : "bg-white/30 animate-pulse"
            }`} />
            {status === "ready" ? "Ready" : status === "error" ? "Failed to load" : "Loading…"}
          </div>

          {status !== "error" && (
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 transition-colors"
            >
              <span aria-hidden>{isFullscreen ? "⤡" : "⤢"}</span>
              {isFullscreen ? "Exit full view" : "Expand"}
            </button>
          )}
        </div>
      </div>

      {/* ── Calculator ── */}
      <div
        ref={wrapperRef}
        className={`bg-white/[0.03] border border-white/8 overflow-hidden ${
          isFullscreen ? "rounded-none" : "rounded-2xl"
        }`}
      >
        {status === "error" ? (
          <div className="h-[560px] flex flex-col items-center justify-center gap-2 text-center px-6">
            <span className="text-3xl">📐</span>
            <p className="text-white/60 text-sm font-medium">Couldn't load the Desmos calculator</p>
            <p className="text-white/35 text-xs max-w-sm">
              Check your internet connection and reload the page. If this keeps happening,
              contact support.
            </p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className={`w-full ${isFullscreen ? "h-screen" : "h-[560px]"}`}
          />
        )}
      </div>

      {/* ── Features ── */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">✨ What You Can Do</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-white/60">
              <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
