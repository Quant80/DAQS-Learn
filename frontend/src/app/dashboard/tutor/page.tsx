"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ReferenceDot, ResponsiveContainer,
} from "recharts";
import { evaluate } from "mathjs";
import { useAuthStore } from "@/store/auth";
import { useLearningProfile, detectSubjectFromMessage } from "@/store/learningProfile";
import { useAIPreferences } from "@/store/aiPreferences";
import { useTutorNotes } from "@/store/tutorNotes";
import { AI_MODELS, PROVIDER_META, getModelsByProvider } from "@/lib/aiProvider";
import type { AIProvider } from "@/lib/aiProvider";
import { openCodeInNotebook } from "@/lib/notebook";

interface QuestionCardMeta {
  number: number;
  total: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  earned: number;
  max: number;
  qType: string;
  difficulty: string;
  fullMark: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "question_prompt";
  questionMeta?: QuestionCardMeta;
}

type GraphSpec = {
  title?: string;
  functions: Array<{ expr: string; label?: string; color?: string }>;
  xMin: number;
  xMax: number;
  yMin?: number;
  yMax?: number;
  xIntercepts?: Array<{ x: number; y: number; label?: string }>;
  yIntercept?: { x: number; y: number; label?: string };
  vertex?: { x: number; y: number; label?: string };
  axisOfSymmetry?: number;
};

const PROVIDERS: AIProvider[] = ["claude", "openai", "deepseek", "gemini", "groq"];

const STARTERS = [
  "Solve x² - 4x + 4 = 0 and plot the graph",
  "Help me understand how neural networks work",
  "What is the difference between SQL JOIN types?",
  "Explain Big O notation simply",
  "Plot f(x) = sin(x) from -π to π",
  "Explain Python list comprehensions with examples",
];

function MathGraph({ spec }: { spec: GraphSpec }) {
  const N = 300;
  const step = (spec.xMax - spec.xMin) / N;

  const data = Array.from({ length: N + 1 }, (_, i) => {
    const x = Number((spec.xMin + i * step).toFixed(6));
    const point: Record<string, number | null> = { x };
    for (const fn of spec.functions) {
      try {
        const y = Number(evaluate(fn.expr, { x }));
        point[fn.expr] = isFinite(y) ? y : null;
      } catch {
        point[fn.expr] = null;
      }
    }
    return point;
  });

  // Compute y bounds from actual data
  let autoYMin = Infinity;
  let autoYMax = -Infinity;
  for (const row of data) {
    for (const fn of spec.functions) {
      const v = row[fn.expr];
      if (v !== null && typeof v === "number" && isFinite(v)) {
        if (v < autoYMin) autoYMin = v;
        if (v > autoYMax) autoYMax = v;
      }
    }
  }
  const yRange = autoYMax - autoYMin || 1;
  // Generous padding: 25% of range below (min 2 units) and 15% above
  // so curves always cut through the x-axis with clear space on both sides
  const yPadBelow = Math.max(yRange * 0.25, 2);
  const yPadAbove = Math.max(yRange * 0.15, 1);
  const computedYMin = autoYMin - yPadBelow;
  const computedYMax = autoYMax + yPadAbove;

  // Always use computed bounds — spec values from the AI are often too tight
  const domainY: [number, number] = [computedYMin, computedYMax];

  return (
    <div className="my-4 bg-[#060e1f] border border-white/10 rounded-xl p-4 overflow-hidden max-w-[420px] mx-auto">
      {spec.title && (
        <p className="text-white/70 text-sm font-semibold mb-3 text-center">{spec.title}</p>
      )}
      <ResponsiveContainer width="100%" aspect={1.1}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[spec.xMin, spec.xMax]}
            stroke="rgba(255,255,255,0.25)"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            tickFormatter={(v: number) => v % 1 === 0 ? String(v) : v.toFixed(1)}
          />
          <YAxis
            domain={domainY}
            stroke="rgba(255,255,255,0.25)"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            tickFormatter={(v: number) => v % 1 === 0 ? String(v) : v.toFixed(1)}
          />
          <Tooltip
            contentStyle={{
              background: "#0a1628",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              color: "white",
              fontSize: 11,
            }}
            formatter={(value) => [typeof value === "number" ? value.toFixed(3) : String(value)]}
            labelFormatter={(label) => `x = ${Number(label).toFixed(3)}`}
          />

          {/* Coordinate axes */}
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />

          {/* Axis of symmetry — dashed amber line */}
          {spec.axisOfSymmetry !== undefined && (
            <ReferenceLine
              x={spec.axisOfSymmetry}
              stroke="#f59e0b"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{ value: `x = ${spec.axisOfSymmetry}`, position: "insideTopRight", fill: "#f59e0b", fontSize: 10 }}
            />
          )}

          {/* Function curves */}
          {spec.functions.map((fn) => (
            <Line
              key={fn.expr}
              type="monotone"
              dataKey={fn.expr}
              stroke={fn.color ?? "#60a5fa"}
              strokeWidth={2.5}
              dot={false}
              connectNulls={false}
              name={fn.label ?? fn.expr}
            />
          ))}

          {/* x-intercepts — green dots (skip if overlaps with vertex to avoid label collision) */}
          {spec.xIntercepts?.map((p, i) => {
            const overlapsVertex = spec.vertex &&
              Math.abs(p.x - spec.vertex.x) < 0.001 &&
              Math.abs(p.y - spec.vertex.y) < 0.001;
            if (overlapsVertex) return null; // vertex dot will show a merged label
            return (
              <ReferenceDot
                key={`xi-${i}`}
                x={p.x} y={p.y} r={5}
                fill="#4ade80" stroke="#060e1f" strokeWidth={1.5}
                label={{ value: p.label ?? `(${p.x}, ${p.y})`, fill: "#4ade80", fontSize: 10, position: "top" }}
              />
            );
          })}

          {/* y-intercept — sky dot (skip if overlaps vertex) */}
          {spec.yIntercept && !(
            spec.vertex &&
            Math.abs(spec.yIntercept.x - spec.vertex.x) < 0.001 &&
            Math.abs(spec.yIntercept.y - spec.vertex.y) < 0.001
          ) && (
            <ReferenceDot
              x={spec.yIntercept.x} y={spec.yIntercept.y} r={5}
              fill="#38bdf8" stroke="#060e1f" strokeWidth={1.5}
              label={{ value: spec.yIntercept.label ?? `(${spec.yIntercept.x}, ${spec.yIntercept.y})`, fill: "#38bdf8", fontSize: 10, position: "right" }}
            />
          )}

          {/* Vertex — violet dot. If it coincides with an x-intercept, show merged label. */}
          {spec.vertex && (() => {
            const xIntAtVertex = spec.xIntercepts?.find(
              (p) => Math.abs(p.x - spec.vertex!.x) < 0.001 && Math.abs(p.y - spec.vertex!.y) < 0.001
            );
            const mergedLabel = xIntAtVertex
              ? `Vertex & x-int (${spec.vertex.x}, ${spec.vertex.y})`
              : (spec.vertex.label ?? `Vertex (${spec.vertex.x}, ${spec.vertex.y})`);
            return (
              <ReferenceDot
                x={spec.vertex.x} y={spec.vertex.y} r={7}
                fill="#a78bfa" stroke="#060e1f" strokeWidth={2}
                label={{ value: mergedLabel, fill: "#a78bfa", fontSize: 10, position: "top" }}
              />
            );
          })()}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend chips */}
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
        {spec.functions.map((fn) => (
          <span key={fn.expr}
            style={{ borderColor: `${fn.color ?? "#60a5fa"}40`, color: fn.color ?? "#60a5fa", background: `${fn.color ?? "#60a5fa"}15` }}
            className="text-[11px] border rounded-full px-2.5 py-1 font-mono">
            {fn.label ?? fn.expr}
          </span>
        ))}
        {spec.xIntercepts?.map((p, i) => (
          <span key={i} className="text-[11px] bg-green-500/10 text-green-400 border border-green-500/25 rounded-full px-2.5 py-1">
            x-int {p.label ?? `(${p.x}, ${p.y})`}
          </span>
        ))}
        {spec.yIntercept && (
          <span className="text-[11px] bg-sky-500/10 text-sky-400 border border-sky-500/25 rounded-full px-2.5 py-1">
            y-int {spec.yIntercept.label ?? `(${spec.yIntercept.x}, ${spec.yIntercept.y})`}
          </span>
        )}
        {spec.vertex && (
          <span className="text-[11px] bg-violet-500/10 text-violet-400 border border-violet-500/25 rounded-full px-2.5 py-1">
            vertex {spec.vertex.label ?? `(${spec.vertex.x}, ${spec.vertex.y})`}
          </span>
        )}
        {spec.axisOfSymmetry !== undefined && (
          <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-full px-2.5 py-1">
            axis of symmetry: x = {spec.axisOfSymmetry} (dashed)
          </span>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-[10px] text-white/40 hover:text-white/70 border border-white/10 rounded px-2 py-0.5 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/** Convert any LaTeX delimiter variant the AI might output into the $...$ form KaTeX expects */
function normaliseMath(text: string): string {
  // \( ... \)  →  $ ... $
  text = text.replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m}$`);
  // \[ ... \]  →  $$ ... $$
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$\n${m}\n$$`);
  return text;
}

function QuestionCard({ meta }: { meta: QuestionCardMeta }) {
  const scoreBadge = meta.fullMark
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
    : meta.earned > 0
    ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
    : "text-red-400 bg-red-500/10 border-red-500/25";

  return (
    <div className="border border-sky-500/20 bg-sky-500/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-sky-400/70 uppercase tracking-wider">
            Question {meta.number} of {meta.total}
          </span>
          <span className="text-[9px] text-white/25 border border-white/10 rounded px-1.5 py-0.5 capitalize">
            {meta.qType.replace("_", " ")}
          </span>
          <span className="text-[9px] text-white/25 border border-white/10 rounded px-1.5 py-0.5">
            {meta.difficulty}
          </span>
        </div>
        <span className={`text-xs font-bold border rounded-full px-2.5 py-0.5 shrink-0 ${scoreBadge}`}>
          {meta.earned}/{meta.max} pts
        </span>
      </div>
      <p className="text-white/90 text-sm font-medium leading-relaxed">{meta.question}</p>
      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="text-white/35 text-xs shrink-0 mt-0.5 w-20">My answer:</span>
          <span className={`text-xs font-mono leading-relaxed ${meta.fullMark ? "text-emerald-300" : "text-red-300/90"}`}>
            {meta.userAnswer}
          </span>
          <span className="ml-auto shrink-0 text-sm">{meta.fullMark ? "✓" : "✗"}</span>
        </div>
        {!meta.fullMark && (
          <div className="flex items-start gap-2">
            <span className="text-white/35 text-xs shrink-0 mt-0.5 w-20">Correct:</span>
            <span className="text-emerald-300 text-xs font-mono leading-relaxed">{meta.correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const SITE_URL = "https://learn.daqstech.com";

function ShareToolbar({ getElement, question }: { getElement: () => HTMLElement | null; question: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function captureImage(): Promise<string | null> {
    const el = getElement();
    if (!el) return null;
    const { default: html2canvas } = await import("html2canvas-pro");
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#0a1120",
      useCORS: true,
      allowTaint: true,
    });
    return canvas.toDataURL("image/png");
  }

  function downloadDataUrl(dataUrl: string) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `DAQS-AI-Tutor-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const dataUrl = await captureImage();
      if (dataUrl) downloadDataUrl(dataUrl);
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  async function handleShare(platform: "facebook" | "linkedin") {
    setBusy(true);
    try {
      const dataUrl = await captureImage();
      if (dataUrl) downloadDataUrl(dataUrl);
      const shareUrl =
        platform === "facebook"
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(question)}`
          : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=650");
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        className="flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 transition-colors disabled:opacity-50"
      >
        {busy ? "Preparing…" : "🔗 Share"}
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1.5 w-64 bg-[#0a1628] border border-white/12 rounded-xl shadow-2xl z-30 overflow-hidden">
          <button
            onClick={handleDownload}
            className="w-full text-left px-3.5 py-2.5 text-xs text-white/75 hover:bg-white/5 flex items-center gap-2.5"
          >
            <span>🖼️</span> Download as image
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="w-full text-left px-3.5 py-2.5 text-xs text-white/75 hover:bg-white/5 flex items-center gap-2.5 border-t border-white/8"
          >
            <span>📘</span> Share to Facebook
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="w-full text-left px-3.5 py-2.5 text-xs text-white/75 hover:bg-white/5 flex items-center gap-2.5 border-t border-white/8"
          >
            <span>💼</span> Share to LinkedIn
          </button>
          <p className="px-3.5 py-2 text-[10px] text-white/30 border-t border-white/8 bg-white/[0.02] leading-relaxed">
            Downloads an image of this Q&amp;A — attach it to the post that opens.
          </p>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  if (msg.type === "question_prompt" && msg.questionMeta) {
    return <QuestionCard meta={msg.questionMeta} />;
  }

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-1 ${
        isUser
          ? "bg-sky-500/20 border border-sky-500/30 text-sky-300"
          : "bg-violet-500/20 border border-violet-500/30 text-violet-300"
      }`}>
        {isUser ? "U" : "AI"}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? "bg-sky-500/15 border border-sky-500/20 text-white rounded-tr-sm"
          : "bg-white/[0.04] border border-white/10 text-white/90 rounded-tl-sm"
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rehypePlugins={[rehypeKatex as any]}
            components={{
              code({ className, children }) {
                const lang = className?.replace("language-", "") ?? "";
                const codeText = String(children).replace(/\n$/, "");

                if (lang === "graph") {
                  try {
                    const spec = JSON.parse(codeText) as GraphSpec;
                    return <MathGraph spec={spec} />;
                  } catch {
                    // fall through to regular code block
                  }
                }

                if (lang) {
                  const isPython = lang === "python";
                  return (
                    <div className="my-3 rounded-xl overflow-hidden border border-white/10">
                      <div className="flex items-center justify-between bg-white/5 px-4 py-1.5 border-b border-white/[0.08]">
                        <span className="text-[10px] text-white/40 font-mono">{lang}</span>
                        <div className="flex items-center gap-2">
                          {isPython && (
                            <button
                              onClick={() => openCodeInNotebook(codeText)}
                              className="text-[10px] font-semibold text-sky-300 hover:text-sky-200 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded px-2.5 py-0.5 transition-all flex items-center gap-1"
                            >
                              ▶ Open in Notebook
                            </button>
                          )}
                          <CopyButton text={codeText} />
                        </div>
                      </div>
                      <pre className="overflow-x-auto p-4 bg-[#0a1628]">
                        <code className="text-xs text-emerald-300 font-mono leading-relaxed">{codeText}</code>
                      </pre>
                    </div>
                  );
                }

                return (
                  <code className="bg-white/10 text-emerald-300 rounded px-1.5 py-0.5 text-xs font-mono">
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-white/80">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-white/80">{children}</ol>,
              li: ({ children }) => <li className="text-white/80">{children}</li>,
              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
              em: ({ children }) => <em className="text-white/70 italic">{children}</em>,
              h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2 mt-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold text-white mb-2 mt-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold text-white mb-1 mt-3">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-sky-500/40 pl-3 my-2 text-white/60 italic">{children}</blockquote>
              ),
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto rounded-xl border border-violet-500/25 shadow-lg shadow-violet-950/30">
                  <style>{`
                    .daqs-table tbody tr:nth-child(even) { background: rgba(139,92,246,0.04); }
                    .daqs-table tbody tr:hover { background: rgba(96,165,250,0.06); }
                    .daqs-table tbody td:first-child { color: rgba(255,255,255,0.95); font-weight: 500; }
                    .daqs-table strong { color: #fbbf24; font-weight: 700; }
                    .daqs-table em { color: #a78bfa; font-style: normal; font-weight: 600; }
                  `}</style>
                  <table className="w-full text-sm border-collapse daqs-table">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.55) 0%, rgba(37,99,235,0.55) 100%)" }}>
                  {children}
                </thead>
              ),
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => (
                <tr className="border-t border-white/[0.06] transition-colors">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap border-r border-white/[0.08] last:border-r-0">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-white/75 border-r border-white/[0.04] last:border-r-0">
                  {children}
                </td>
              ),
            }}
          >
            {normaliseMath(msg.content)}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold bg-violet-500/20 border border-violet-500/30 text-violet-300">
        AI
      </div>
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function ModelPicker() {
  const { provider, modelId, setModel } = useAIPreferences();
  const [open, setOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AIProvider>(provider);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentModel = AI_MODELS.find((m) => m.id === modelId);
  const meta = PROVIDER_META[provider];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 text-xs font-semibold border rounded-xl px-3 py-2 transition-all ${meta.bgColor} ${meta.borderColor} ${meta.color}`}
      >
        <span>{meta.icon}</span>
        <span className="hidden sm:inline">{currentModel?.name ?? "Select model"}</span>
        <span className="sm:hidden">{meta.label}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0a1628] border border-white/12 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex border-b border-white/8">
            {PROVIDERS.map((p) => {
              const pm = PROVIDER_META[p];
              return (
                <button
                  key={p}
                  onClick={() => setActiveProvider(p)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-all ${
                    activeProvider === p
                      ? `${pm.bgColor} ${pm.color} border-b-2 ${pm.borderColor}`
                      : "text-white/35 hover:text-white/60"
                  }`}
                >
                  <span className="block text-sm mb-0.5">{pm.icon}</span>
                  {pm.label}
                </button>
              );
            })}
          </div>

          <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
            {getModelsByProvider(activeProvider).map((m) => {
              const selected = m.id === modelId && m.provider === provider;
              const pm = PROVIDER_META[m.provider];
              return (
                <button
                  key={m.id}
                  onClick={() => { setModel(m.provider, m.id); setOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 ${
                    selected ? `${pm.bgColor} border ${pm.borderColor}` : "hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-semibold ${selected ? pm.color : "text-white/80"}`}>{m.name}</span>
                      {m.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pm.bgColor} ${pm.color} border ${pm.borderColor}`}>
                          {m.badge}
                        </span>
                      )}
                      {selected && <span className="ml-auto text-xs text-emerald-400">✓</span>}
                    </div>
                    <p className="text-white/35 text-[11px] leading-relaxed">{m.description}</p>
                    <span className="text-[10px] text-white/25">{m.contextWindow} context</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-white/8 bg-white/[0.02]">
            <p className="text-[10px] text-white/30">
              API keys configured server-side. Missing a provider? Add its key to <code className="text-white/45">.env.local</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const SESSION_KEY = "daqs_tutor_messages";
const ASSESSMENT_KEY = "daqs_tutor_assessment";

interface AssessmentQuestion {
  number: number;
  question: string;
  type: string;
  difficulty: string;
  userAnswer: string;
  correctAnswer: string;
  earned: number;
  max: number;
  explanation: string;
  concepts: string[];
  feedback: string | null;
}

interface AssessmentContext {
  assessmentId?: string;
  title: string;
  subject: string;
  difficulty: string;
  percentage: number;
  totalScore: number;
  maxScore: number;
  questions: AssessmentQuestion[];
}

function buildSingleQuestionPrompt(
  q: AssessmentQuestion,
  index: number,
  total: number,
  ctx: AssessmentContext
): string {
  const fullMark = q.earned === q.max;
  const lines: string[] = [];

  if (index === 0) {
    lines.push(
      `I just completed the "${ctx.title}" assessment on ${ctx.subject} and scored ${ctx.percentage}% (${ctx.totalScore}/${ctx.maxScore} pts). We will go through all ${total} questions one at a time.`,
      ""
    );
  }

  lines.push(
    `─── Question ${index + 1} of ${total} | ${q.type.replace("_", " ")} | ${q.difficulty} ───`,
    "",
    `**${q.question}**`,
    "",
    `My answer: ${q.userAnswer}`
  );

  if (fullMark) {
    lines.push(`Result: ✓ Correct (${q.earned}/${q.max} pts)`);
  } else {
    lines.push(`Result: ✗ ${q.earned}/${q.max} pts`);
    lines.push(`Correct answer: ${q.correctAnswer}`);
  }

  if (q.feedback) lines.push(``, `Prior AI feedback: ${q.feedback}`);

  lines.push(
    "",
    `Please provide a complete, thorough worked example for this question. This explanation is saved as the student's study note, so do NOT skip or summarise — be exhaustive.`,
    ``,
    `Use this exact structure:`,
    `1. **Title**: "Worked Example: Question ${index + 1} — [descriptive concept name]"`,
    `2. **Introduction** — one short paragraph setting the scene`,
    `3. **Step 1: What this question tests and why it matters** — explain the concept in depth`,
    `4. **Step 2: The correct answer with full reasoning** — show every step, include annotated code blocks`,
    fullMark
      ? `5. **Step 3: Why this is correct — deep dive** — explain the mechanism thoroughly`
      : `5. **Step 3: Why the given answer was wrong** — diagnose the mistake precisely`,
    `6. **Step 4: Common mistakes and how to avoid them**`,
    `7. **Summary table** — always include a markdown table (| ASPECT | EXPLANATION |) summarising key points`,
    `8. **Try It Yourself** — include a runnable code block the student can copy into their notebook`,
    ``,
    `Use markdown formatting: bold headings, bullet lists, fenced code blocks with language tag, and tables. Be detailed.`
  );

  return lines.join("\n");
}

function buildQuestionCardMeta(
  q: AssessmentQuestion,
  index: number,
  total: number
): QuestionCardMeta {
  return {
    number: index + 1,
    total,
    question: q.question,
    userAnswer: q.userAnswer,
    correctAnswer: q.correctAnswer,
    earned: q.earned,
    max: q.max,
    qType: q.type,
    difficulty: q.difficulty,
    fullMark: q.earned === q.max,
  };
}

type MessageGroup =
  | { kind: "pair"; user: Message; assistant: Message; assistantIdx: number }
  | { kind: "single"; msg: Message; idx: number };

function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  let i = 0;
  while (i < messages.length) {
    const m = messages[i];
    const next = messages[i + 1];
    if (m.role === "user" && next?.role === "assistant") {
      groups.push({ kind: "pair", user: m, assistant: next, assistantIdx: i + 1 });
      i += 2;
    } else {
      groups.push({ kind: "single", msg: m, idx: i });
      i += 1;
    }
  }
  return groups;
}

type LockReason = "quota_exceeded" | "locked";

export default function TutorPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const recordTutorMessage = useLearningProfile((s) => s.recordTutorMessage);
  const { provider, modelId } = useAIPreferences();
  const { upsertNote } = useTutorNotes();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [restored, setRestored] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [locked, setLocked] = useState<LockReason | null>(null);
  const [requestState, setRequestState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  // Assessment mode state
  const [currentQIdx, setCurrentQIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pairRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const assessmentMetaRef = useRef<AssessmentContext | null>(null);
  const assessmentQuestionsRef = useRef<AssessmentQuestion[]>([]);
  const currentQIdxRef = useRef(-1);
  const assessmentNoteIdRef = useRef<string | null>(null);
  const generalNoteIdRef = useRef<string | null>(null);
  const prevStreamingRef = useRef(false);

  // Restore conversation from session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
    setRestored(true);
  }, []);

  // Persist conversation whenever it changes
  useEffect(() => {
    if (!restored) return;
    if (messages.length > 0) sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    else sessionStorage.removeItem(SESSION_KEY);
  }, [messages, restored]);

  // Auto-send assessment context when navigated from results page
  useEffect(() => {
    if (!restored) return;
    try {
      const raw = sessionStorage.getItem(ASSESSMENT_KEY);
      if (!raw) return;
      sessionStorage.removeItem(ASSESSMENT_KEY);
      const ctx = JSON.parse(raw) as AssessmentContext;
      assessmentMetaRef.current = ctx;
      assessmentQuestionsRef.current = ctx.questions;
      assessmentNoteIdRef.current = `assessment-${ctx.assessmentId ?? ctx.title.replace(/\s+/g, "-")}-${Date.now()}`;
      currentQIdxRef.current = 0;
      setCurrentQIdx(0);
      const q = ctx.questions[0];
      sendMessage(
        buildSingleQuestionPrompt(q, 0, ctx.questions.length, ctx),
        buildQuestionCardMeta(q, 0, ctx.questions.length)
      );
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored]);

  // Auto-save note whenever an assessment-mode AI response finishes streaming
  useEffect(() => {
    const wasStreaming = prevStreamingRef.current;
    prevStreamingRef.current = streaming;
    if (wasStreaming && !streaming && assessmentMetaRef.current && messages.length >= 2) {
      const meta = assessmentMetaRef.current;
      upsertNote({
        id: assessmentNoteIdRef.current!,
        title: `${meta.title} — AI Review`,
        source: "assessment",
        sourceId: meta.assessmentId ?? meta.title,
        subject: meta.subject,
        moduleLabel: `${meta.subject} · ${meta.title}`,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.type ? { type: m.type } : {}),
          ...(m.questionMeta ? { questionMeta: m.questionMeta } : {}),
        })),
        percentage: meta.percentage,
        pinned: false,
      });
    }
  }, [streaming, messages, upsertNote]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  function handleNextQuestion() {
    const nextIdx = currentQIdxRef.current + 1;
    const questions = assessmentQuestionsRef.current;
    const meta = assessmentMetaRef.current;
    if (!meta || nextIdx >= questions.length) return;
    currentQIdxRef.current = nextIdx;
    setCurrentQIdx(nextIdx);
    const q = questions[nextIdx];
    sendMessage(
      buildSingleQuestionPrompt(q, nextIdx, questions.length, meta),
      buildQuestionCardMeta(q, nextIdx, questions.length)
    );
  }

  function saveGeneralNote() {
    if (!messages.length) return;
    if (!generalNoteIdRef.current) {
      generalNoteIdRef.current = `general-${Date.now()}`;
    }
    const firstUser = messages.find((m) => m.role === "user")?.content ?? "Session";
    const title = firstUser.length > 60 ? firstUser.slice(0, 60) + "…" : firstUser;
    upsertNote({
      id: generalNoteIdRef.current,
      title,
      source: "general",
      sourceId: generalNoteIdRef.current,
      subject: detectSubjectFromMessage(firstUser),
      moduleLabel: "General Tutor Session",
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.type ? { type: m.type } : {}),
        ...(m.questionMeta ? { questionMeta: m.questionMeta } : {}),
      })),
      pinned: false,
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  }

  async function sendMessage(content: string, questionMeta?: QuestionCardMeta) {
    if (!content.trim() || streaming || locked) return;
    setError("");

    const userMsg: Message = {
      role: "user",
      content: content.trim(),
      ...(questionMeta ? { type: "question_prompt" as const, questionMeta } : {}),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    recordTutorMessage(content.trim());
    setInput("");
    setStreaming(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          provider,
          modelId,
        }),
      });

      if (res.status === 403) {
        const err = await res.json().catch(() => ({}));
        if (err.error === "quota_exceeded" || err.error === "locked") {
          setLocked(err.error as LockReason);
          setStreaming(false);
          return;
        }
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Request failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantContent };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  async function requestAccess() {
    setRequestState("sending");
    try {
      const res = await fetch("/api/tutor/request-access", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      setRequestState("sent");
    } catch {
      setRequestState("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  }

  const currentMeta = PROVIDER_META[provider];
  const showEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header — shrink-0 keeps it fixed at top; page-level scroll is disabled by layout */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/8 bg-[#060d1a] shrink-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
          currentQIdx >= 0
            ? "bg-sky-500/20 border border-sky-500/30"
            : "bg-violet-500/20 border border-violet-500/30"
        }`}>
          {currentQIdx >= 0 ? "📝" : "🤖"}
        </div>
        <div className="flex-1 min-w-0">
          {currentQIdx >= 0 && assessmentMetaRef.current ? (
            <>
              <h1 className="text-white font-bold text-sm leading-tight truncate">
                {assessmentMetaRef.current.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-sky-400/80">
                  Q {currentQIdx + 1} / {assessmentQuestionsRef.current.length}
                </span>
                <div className="flex-1 max-w-[120px] h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQIdx + 1) / assessmentQuestionsRef.current.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-emerald-400/70">✓ Auto-saving</span>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-white font-bold text-base leading-tight">DAQS AI Tutor</h1>
              <p className={`text-xs ${currentMeta.color} opacity-70`}>
                {currentMeta.icon} {currentMeta.label} · {AI_MODELS.find((m) => m.id === modelId)?.name ?? modelId}
              </p>
            </>
          )}
        </div>
        {currentQIdx < 0 && <ModelPicker />}
        {messages.length > 0 && currentQIdx < 0 && (
          <button
            onClick={saveGeneralNote}
            className={`text-xs border rounded-lg px-3 py-1.5 transition-all shrink-0 ${
              noteSaved
                ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : "text-violet-400 border-violet-500/25 hover:border-violet-500/40 hover:bg-violet-500/10"
            }`}
          >
            {noteSaved ? "✓ Saved" : "📝 Save Note"}
          </button>
        )}
        {messages.length > 0 && (
          <button
            onClick={() => {
              assessmentMetaRef.current = null;
              assessmentQuestionsRef.current = [];
              assessmentNoteIdRef.current = null;
              generalNoteIdRef.current = null;
              currentQIdxRef.current = -1;
              setCurrentQIdx(-1);
              setMessages([]);
              sessionStorage.removeItem(SESSION_KEY);
            }}
            className="text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all shrink-0"
          >
            New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        {showEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-8">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-3xl mx-auto mb-4">
                🤖
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hi {user?.full_name?.split(" ")[0]}, I&apos;m your AI Tutor</h2>
              <p className="text-white/45 text-sm max-w-md">
                I can render maths with LaTeX, draw interactive graphs, and present tables — ask me anything.
              </p>
              <div className={`inline-flex items-center gap-1.5 mt-3 text-xs ${currentMeta.color} ${currentMeta.bgColor} border ${currentMeta.borderColor} rounded-full px-3 py-1`}>
                <span>{currentMeta.icon}</span>
                Powered by {AI_MODELS.find((m) => m.id === modelId)?.name ?? modelId}
              </div>
            </div>

            <div className="w-full max-w-xl">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Try asking</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-sm text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-white/15 rounded-xl px-4 py-3 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {groupMessages(messages).map((group) => {
              if (group.kind === "single") {
                return <MessageBubble key={group.idx} msg={group.msg} />;
              }
              const { user, assistant, assistantIdx } = group;
              return (
                <div key={assistantIdx} className="space-y-2">
                  <div
                    ref={(el) => { pairRefs.current[assistantIdx] = el; }}
                    className="space-y-3 p-4 rounded-2xl border border-white/5"
                    style={{ background: "#0a1120" }}
                  >
                    <MessageBubble msg={user} />
                    <MessageBubble msg={assistant} />
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <div className="w-4 h-4 rounded bg-violet-500/30 flex items-center justify-center text-[9px] shrink-0">🤖</div>
                      <span className="text-[10px] text-white/25 font-medium">DAQS AI Tutor · learn.daqstech.com</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <ShareToolbar
                      getElement={() => pairRefs.current[assistantIdx] ?? null}
                      question={user.content}
                    />
                  </div>
                </div>
              );
            })}
            {streaming && messages[messages.length - 1]?.role !== "assistant" && (
              <TypingIndicator />
            )}
            {error && (
              <div className="bg-[#1a0a0a] border border-red-500/40 rounded-xl px-4 py-3 space-y-1">
                <div className="text-red-400 text-sm font-semibold">⚠️ Error</div>
                <div className="text-red-300 text-xs leading-relaxed">{error}</div>
              </div>
            )}

            {/* Assessment mode: Next Question / Done card */}
            {!streaming && currentQIdx >= 0 && messages.length >= 2 && (
              <div className="flex justify-center pt-2 pb-1">
                {currentQIdx < assessmentQuestionsRef.current.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                  >
                    <span>Next: Question {currentQIdx + 2} of {assessmentQuestionsRef.current.length}</span>
                    <span className="text-lg">→</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl px-8 py-6 text-center">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <p className="text-emerald-400 font-bold text-sm">All {assessmentQuestionsRef.current.length} questions reviewed!</p>
                      <p className="text-white/40 text-xs mt-1">Your full AI review has been saved to My Notes.</p>
                    </div>
                    <Link
                      href="/dashboard/notes"
                      className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                    >
                      📝 View in My Notes →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — or a lock screen once the free trial quota is used up */}
      {locked ? (
        <div className="shrink-0 px-4 md:px-8 py-5 border-t border-amber-500/20 bg-[#0d0a06]">
          <div className="max-w-xl mx-auto text-center space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-xl mx-auto">
              🔒
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {locked === "locked" ? "This account has been locked" : "You've used your 2 free AI Tutor questions"}
              </p>
              <p className="text-white/45 text-xs mt-1 max-w-sm mx-auto">
                {locked === "locked"
                  ? "Contact the DAQS Learn administrator to have this account reviewed."
                  : "Request access to keep using the AI Tutor — an administrator will review and approve it."}
              </p>
            </div>
            {locked === "quota_exceeded" && (
              requestState === "sent" ? (
                <p className="text-emerald-400 text-xs font-medium">✓ Request sent — you'll be able to continue once it's approved.</p>
              ) : (
                <button
                  onClick={requestAccess}
                  disabled={requestState === "sending"}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#1a1206] font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
                >
                  {requestState === "sending" ? "Sending…" : "Request Access"}
                </button>
              )
            )}
            {locked === "locked" && (
              // A locked account is rejected by every authenticated endpoint
              // (including the request-access API), so there's no in-app
              // action available here — a direct email is the only option.
              <a
                href={`mailto:Ncube.T@daqstech.com?subject=${encodeURIComponent(
                  "DAQS Learn — account locked, please review"
                )}&body=${encodeURIComponent(
                  `Hi,\n\nMy DAQS Learn account (${user?.email ?? ""}) has been locked. Could you please review it?\n\nThanks.`
                )}`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#1a1206] font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
              >
                Email Administrator
              </a>
            )}
            {requestState === "error" && (
              <p className="text-red-400 text-xs">Couldn't send the request — please try again.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="shrink-0 px-4 md:px-8 py-4 border-t border-white/8 bg-[#060d1a]">
          <div className="max-w-3xl mx-auto">
            <div className={`flex gap-3 items-end bg-white/[0.04] border hover:border-white/20 focus-within:border-sky-500/40 rounded-2xl px-4 py-3 transition-all ${currentMeta.borderColor} border`}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentQIdx >= 0
                    ? "Ask a follow-up about this question… (Enter to send)"
                    : "Ask your tutor anything… (Enter to send, Shift+Enter for new line)"
                }
                disabled={streaming}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-white/25 text-sm resize-none focus:outline-none leading-relaxed min-h-[24px] max-h-40"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming}
                className="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className={`text-center text-[10px] mt-2 ${currentMeta.color} opacity-50`}>
              {currentMeta.icon} {AI_MODELS.find((m) => m.id === modelId)?.name ?? modelId} · For learning and education only
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
