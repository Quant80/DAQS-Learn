"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GEOGEBRA_SCRIPT_SRC = "https://www.geogebra.org/apps/deployggb.js";
const GGB_CONTAINER_ID = "ggb-applet-container";

type Status = "loading" | "ready" | "error";

interface GGBApi {
  setSize: (w: number, h: number) => void;
}

interface GGBAppletInstance {
  inject: (containerId: string) => void;
}

declare global {
  interface Window {
    GGBApplet?: new (params: Record<string, unknown>, embedded: boolean) => GGBAppletInstance;
  }
}

const FEATURES = [
  "Compass-and-straightedge geometric constructions",
  "Points, angles, transformations, and measurements",
  "Dynamic worksheets — drag any point and everything updates",
  "Algebra, graphing, and geometry in one connected view",
];

export default function GeoGebraPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<GGBApi | null>(null);
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

  // Mount the applet once the script is loaded
  useEffect(() => {
    let cancelled = false;

    function mount() {
      if (cancelled || !containerRef.current || !window.GGBApplet) return;
      const rect = containerRef.current.getBoundingClientRect();
      const applet = new window.GGBApplet(
        {
          appName: "geometry",
          width: Math.max(320, Math.round(rect.width)),
          height: Math.max(320, Math.round(rect.height)),
          showToolBar: true,
          showAlgebraInput: true,
          showMenuBar: false,
          showResetIcon: true,
          enableRightClick: true,
          appletOnLoad: (api: GGBApi) => {
            if (cancelled) return;
            apiRef.current = api;
            setStatus("ready");
          },
        },
        true
      );
      applet.inject(GGB_CONTAINER_ID);
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GEOGEBRA_SCRIPT_SRC}"]`
    );

    if (window.GGBApplet) {
      mount();
    } else if (existing) {
      existing.addEventListener("load", mount);
      existing.addEventListener("error", () => !cancelled && setStatus("error"));
    } else {
      const script = document.createElement("script");
      script.src = GEOGEBRA_SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", mount);
      script.addEventListener("error", () => !cancelled && setStatus("error"));
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the applet's pixel size in sync with its container (toggle, resize, etc.)
  useEffect(() => {
    if (status !== "ready" || !containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      apiRef.current?.setSize(Math.max(320, Math.round(rect.width)), Math.max(320, Math.round(rect.height)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [status]);

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/dashboard/graphing"
            className="text-white/40 hover:text-white/70 text-xs font-medium inline-flex items-center gap-1 mb-2 transition-colors"
          >
            ← Graphing Calculators
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📏</span> GeoGebra
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Interactive geometry, construction, and dynamic worksheets
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

      {/* ── Applet ── */}
      <div
        ref={wrapperRef}
        className={`relative bg-white/[0.03] border border-white/8 overflow-hidden ${
          isFullscreen ? "rounded-none" : "rounded-2xl"
        }`}
      >
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white bg-[#0a1628]/90 hover:bg-[#0a1628] border border-white/15 rounded-lg px-3 py-1.5 shadow-lg backdrop-blur-sm transition-colors"
          >
            <span aria-hidden>⤡</span>
            Exit full view
          </button>
        )}
        {status === "error" ? (
          <div className="h-[560px] flex flex-col items-center justify-center gap-2 text-center px-6">
            <span className="text-3xl">📏</span>
            <p className="text-white/60 text-sm font-medium">Couldn't load GeoGebra</p>
            <p className="text-white/35 text-xs max-w-sm">
              Check your internet connection and reload the page. If this keeps happening,
              contact support.
            </p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className={`w-full ${isFullscreen ? "h-screen" : "h-[560px]"}`}
          >
            <div id={GGB_CONTAINER_ID} className="w-full h-full" />
          </div>
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
