"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useTutorNotes, TutorNote, NoteMessage, NoteSource } from "@/store/tutorNotes";

type FilterTab = "all" | NoteSource;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function firstAiSnippet(note: TutorNote): string {
  const msg = note.messages.find((m) => m.role === "assistant");
  if (!msg) return "";
  const plain = msg.content.replace(/[#*`_~\[\]()]/g, "").replace(/\n+/g, " ").trim();
  return plain.length > 180 ? plain.slice(0, 180) + "…" : plain;
}

function normaliseMath(text: string): string {
  text = text.replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m}$`);
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$\n${m}\n$$`);
  return text;
}

// ── Question card ──────────────────────────────────────────────────────────────

function QuestionCardDisplay({ msg }: { msg: NoteMessage }) {
  const q = msg.questionMeta!;
  const scoreBadge = q.fullMark
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
    : q.earned > 0
    ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
    : "text-red-400 bg-red-500/10 border-red-500/25";

  return (
    <div className="border border-sky-500/20 bg-sky-500/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sky-400 uppercase tracking-wider text-xs">
            Question {q.number} of {q.total}
          </span>
          <span className="text-white/30 border border-white/10 rounded px-1.5 py-0.5 capitalize text-[10px]">
            {q.qType.replace("_", " ")}
          </span>
          <span className="text-white/30 border border-white/10 rounded px-1.5 py-0.5 text-[10px]">
            {q.difficulty}
          </span>
        </div>
        <span className={`font-bold border rounded-full px-2.5 py-0.5 shrink-0 text-xs ${scoreBadge}`}>
          {q.earned}/{q.max} pts {q.fullMark ? "✓" : "✗"}
        </span>
      </div>
      <p className="text-white/90 font-medium leading-relaxed text-sm">{q.question}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-white/35 shrink-0 w-20">My answer:</span>
          <span className={`font-mono leading-relaxed ${q.fullMark ? "text-emerald-300" : "text-red-300/80"}`}>
            {q.userAnswer}
          </span>
        </div>
        {!q.fullMark && (
          <div className="flex items-start gap-2">
            <span className="text-white/35 shrink-0 w-20">Correct:</span>
            <span className="font-mono text-emerald-300 leading-relaxed">{q.correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Full AI-Tutor-identical message renderer ───────────────────────────────────
// Matches tutor/page.tsx MessageBubble exactly

function NoteMessageBubble({ msg }: { msg: NoteMessage }) {
  if (msg.type === "question_prompt" && msg.questionMeta) {
    return <QuestionCardDisplay msg={msg} />;
  }
  // Hide user messages that are raw API prompts (no questionMeta)
  if (msg.role === "user") return null;

  return (
    <div className="flex gap-3 flex-row">
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-1 bg-violet-500/20 border border-violet-500/30 text-violet-300">
        AI
      </div>
      {/* flex-1 min-w-0: fills full available width so tables and content span edge-to-edge */}
      <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed bg-white/[0.04] border border-white/10 text-white/90">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypePlugins={[rehypeKatex as any]}
          components={{
            code({ className, children }) {
              const lang = className?.replace("language-", "") ?? "";
              const codeText = String(children).replace(/\n$/, "");
              const isPython = lang === "python";

              if (lang) {
                return (
                  <div className="my-3 rounded-xl overflow-hidden border border-white/10">
                    <div className="flex items-center justify-between bg-white/5 px-4 py-1.5 border-b border-white/[0.08]">
                      <span className="text-[10px] text-white/40 font-mono">{lang}</span>
                      <div className="flex items-center gap-2">
                        {isPython && (
                          <button
                            onClick={() => {
                              sessionStorage.setItem("daqs_tutor_code", codeText);
                              window.open("/dashboard/notebook?fromTutor=1", "_blank");
                            }}
                            className="text-[10px] font-semibold text-sky-300 hover:text-sky-200 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded px-2.5 py-0.5 transition-all flex items-center gap-1"
                          >
                            ▶ Open in Notebook
                          </button>
                        )}
                        <button
                          onClick={() => navigator.clipboard.writeText(codeText)}
                          className="text-[10px] text-white/40 hover:text-white/70 border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                          Copy
                        </button>
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
              <blockquote className="border-l-2 border-sky-500/40 pl-3 my-2 text-white/60 italic">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="border-white/10 my-4" />,
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
      </div>
    </div>
  );
}

// ── Compact renderer for inline card preview ───────────────────────────────────

function CompactNoteMessage({ msg }: { msg: NoteMessage }) {
  if (msg.type === "question_prompt" && msg.questionMeta) {
    const q = msg.questionMeta;
    const scoreBadge = q.fullMark
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
      : q.earned > 0
      ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
      : "text-red-400 bg-red-500/10 border-red-500/25";
    return (
      <div className="border border-sky-500/20 bg-sky-500/5 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-bold text-sky-400 text-[9px] uppercase tracking-wider">
            Q{q.number}/{q.total}
          </span>
          <span className={`font-bold border rounded-full px-2 py-0.5 text-[9px] ${scoreBadge}`}>
            {q.earned}/{q.max} {q.fullMark ? "✓" : "✗"}
          </span>
        </div>
        <p className="text-white/80 text-xs leading-relaxed">{q.question}</p>
      </div>
    );
  }
  if (msg.role === "user") return null;

  return (
    <div className="flex gap-2.5">
      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 bg-violet-500/20 border border-violet-500/30 text-violet-300">
        AI
      </div>
      <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm px-3 py-2.5 text-xs leading-relaxed bg-white/[0.03] border border-white/8 text-white/80">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children }) {
              const lang = className?.replace("language-", "") ?? "";
              const codeText = String(children).replace(/\n$/, "");
              if (lang) {
                return (
                  <div className="my-2 rounded-lg overflow-hidden border border-white/10">
                    <div className="bg-white/5 px-3 py-1">
                      <span className="text-[9px] text-white/40 font-mono">{lang}</span>
                    </div>
                    <pre className="overflow-x-auto p-2.5 bg-[#0a1628]">
                      <code className="text-[11px] text-emerald-300 font-mono">{codeText}</code>
                    </pre>
                  </div>
                );
              }
              return <code className="bg-white/10 text-emerald-300 rounded px-1 py-0.5 text-[10px] font-mono">{children}</code>;
            },
            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-1.5">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-1.5">{children}</ol>,
            li: ({ children }) => <li>{children}</li>,
            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
            h1: ({ children }) => <h1 className="text-xs font-bold text-white mb-1 mt-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xs font-bold text-white mb-1 mt-1.5">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xs font-semibold text-white mb-0.5 mt-1">{children}</h3>,
            table: ({ children }) => (
              <div className="my-1.5 overflow-x-auto rounded-lg border border-violet-500/20">
                <table className="w-full text-xs border-collapse">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{ background: "rgba(109,40,217,0.4)" }}>{children}</thead>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className="border-t border-white/[0.06]">{children}</tr>,
            th: ({ children }) => <th className="px-2 py-1.5 text-left text-[9px] font-bold text-white uppercase">{children}</th>,
            td: ({ children }) => <td className="px-2 py-1.5 text-white/70">{children}</td>,
          }}
        >
          {msg.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ── Expanded note view — same layout structure as AI Tutor (h-screen) ─────────

function ExpandedNoteView({ note, onClose }: { note: TutorNote; onClose: () => void }) {
  const scoreColor =
    (note.percentage ?? 0) >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
    (note.percentage ?? 0) >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
    "text-red-400 bg-red-500/10 border-red-500/20";

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // h-full fills the locked main container — same pattern as tutor/page.tsx
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header — matches AI Tutor header structure */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/8 bg-[#060d1a] shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors shrink-0"
          title="Close (Esc)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs font-medium hidden sm:inline">My Notes</span>
        </button>
        <div className="w-px h-5 bg-white/10 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              note.source === "assessment"
                ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-sky-400 bg-sky-500/10 border-sky-500/20"
            }`}>
              {note.source === "assessment" ? "Assessment Review" : "Tutor Session"}
            </span>
            {note.percentage !== undefined && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreColor}`}>
                {note.percentage}%
              </span>
            )}
          </div>
          <h2 className="text-white font-bold text-sm leading-tight truncate">{note.title}</h2>
          <p className="text-white/35 text-xs">{note.moduleLabel} · {formatDate(note.savedAt)}</p>
        </div>
        <span className="text-white/20 text-[10px] hidden lg:block shrink-0">
          {note.messages.filter(m => m.role === "assistant").length} AI explanations · Esc to close
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages — identical to AI Tutor messages area: px-4 md:px-8 py-6 space-y-5 */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        {note.messages.map((msg, i) => (
          <NoteMessageBubble key={i} msg={msg} />
        ))}
        <div className="h-8" />
      </div>
    </div>
  );
}

// ── Note card (list view) ─────────────────────────────────────────────────────

function NoteCard({ note, expanded, onToggle, onExpand, onPin, onDelete }: {
  note: TutorNote;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onPin: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const scoreColor =
    (note.percentage ?? 0) >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
    (note.percentage ?? 0) >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
    "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${
      note.pinned ? "border-amber-500/25 bg-amber-500/5" : "border-white/8 bg-white/[0.02]"
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                note.source === "assessment"
                  ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                  : "text-sky-400 bg-sky-500/10 border-sky-500/20"
              }`}>
                {note.source === "assessment" ? "Assessment Review" : "Tutor Session"}
              </span>
              {note.percentage !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreColor}`}>
                  {note.percentage}%
                </span>
              )}
              {note.pinned && <span className="text-amber-400 text-xs">📌</span>}
            </div>
            <h3 className="text-white text-sm font-semibold leading-snug mb-0.5 truncate">{note.title}</h3>
            <p className="text-white/40 text-xs">{note.moduleLabel} · {formatDate(note.savedAt)}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onExpand} title="Expand to full view"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-sky-400 hover:bg-sky-500/10 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button onClick={onPin} title={note.pinned ? "Unpin" : "Pin"}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm hover:bg-white/8 transition-colors">
              {note.pinned ? "📌" : "📍"}
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={onDelete}
                  className="text-[10px] text-red-400 border border-red-500/30 hover:bg-red-500/15 rounded px-2 py-1 transition-colors">
                  Delete
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="text-[10px] text-white/30 border border-white/10 hover:bg-white/5 rounded px-2 py-1 transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} title="Delete"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                🗑
              </button>
            )}
          </div>
        </div>

        {!expanded && (
          <p className="text-white/40 text-xs mt-2.5 leading-relaxed line-clamp-2">{firstAiSnippet(note)}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-white/25 text-[10px]">
            {note.messages.filter(m => m.role === "assistant").length} AI responses
          </span>
          <div className="flex items-center gap-3">
            <button onClick={onExpand}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors font-semibold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Expand
            </button>
            <button onClick={onToggle}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
              {expanded ? "Collapse ▲" : "Preview ▼"}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/8 px-4 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
          {note.messages.map((msg, i) => (
            <CompactNoteMessage key={i} msg={msg} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: FilterTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center text-3xl">📝</div>
      <div>
        <h3 className="text-white font-semibold mb-1">No notes yet</h3>
        <p className="text-white/35 text-sm max-w-sm">
          {filter === "assessment"
            ? "Complete an assessment and click \"Ask AI Tutor\" — the review session saves automatically."
            : filter === "general"
            ? "Have a conversation in the AI Tutor and click \"Save Note\" to keep it."
            : "Your AI Tutor conversations will appear here, organised by subject."}
        </p>
      </div>
      <Link href="/dashboard/tutor"
        className="text-sm text-violet-400 hover:text-violet-300 border border-violet-500/25 hover:border-violet-500/40 rounded-xl px-5 py-2.5 transition-all">
        Open AI Tutor →
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotesPage() {
  const { notes, deleteNote, togglePin } = useTutorNotes();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandedNote, setExpandedNote] = useState<TutorNote | null>(null);

  // Early return: full-screen note view, matching AI Tutor h-screen layout exactly
  if (expandedNote) {
    return <ExpandedNoteView note={expandedNote} onClose={() => setExpandedNote(null)} />;
  }

  const filtered = (() => {
    let list = [...notes];
    if (filter !== "all") list = list.filter((n) => n.source === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) =>
        n.title.toLowerCase().includes(q) ||
        n.moduleLabel.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        n.messages.some((m) => m.content.toLowerCase().includes(q))
      );
    }
    return list;
  })();

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  const bySubject: Record<string, TutorNote[]> = {};
  for (const note of unpinned) {
    if (!bySubject[note.subject]) bySubject[note.subject] = [];
    bySubject[note.subject].push(note);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const TABS: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: notes.length },
    { key: "assessment", label: "Assessments", count: notes.filter((n) => n.source === "assessment").length },
    { key: "general", label: "General", count: notes.filter((n) => n.source === "general").length },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📝</span> My Study Notes
          </h1>
          <p className="text-white/45 text-sm mt-1">AI Tutor conversations saved by module — ready to review any time</p>
        </div>
        <Link href="/dashboard/tutor"
          className="flex items-center gap-2 text-sm bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 px-4 py-2.5 rounded-xl transition-all font-semibold shrink-0">
          🤖 Open Tutor
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes…"
          className="flex-1 bg-white/[0.04] border border-white/10 focus:border-sky-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-colors" />
        <div className="flex gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === t.key ? "bg-sky-500/20 text-sky-300 border border-sky-500/25" : "text-white/40 hover:text-white/70"
              }`}>
              {t.label}
              <span className={`text-[9px] rounded-full px-1.5 py-0.5 font-bold ${
                filter === t.key ? "bg-sky-500/30 text-sky-300" : "bg-white/8 text-white/30"
              }`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-8">
          {pinned.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>📌</span> Pinned
              </h2>
              <div className="space-y-3">
                {pinned.map((note) => (
                  <NoteCard key={note.id} note={note} expanded={expanded.has(note.id)}
                    onToggle={() => toggleExpand(note.id)} onExpand={() => setExpandedNote(note)}
                    onPin={() => togglePin(note.id)} onDelete={() => deleteNote(note.id)} />
                ))}
              </div>
            </section>
          )}
          {Object.entries(bySubject).map(([subject, subjectNotes]) => (
            <section key={subject}>
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-white/15 inline-block" />
                {subject} <span className="text-white/20">({subjectNotes.length})</span>
                <span className="flex-1 h-px bg-white/8 inline-block" />
              </h2>
              <div className="space-y-3">
                {subjectNotes.map((note) => (
                  <NoteCard key={note.id} note={note} expanded={expanded.has(note.id)}
                    onToggle={() => toggleExpand(note.id)} onExpand={() => setExpandedNote(note)}
                    onPin={() => togglePin(note.id)} onDelete={() => deleteNote(note.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
