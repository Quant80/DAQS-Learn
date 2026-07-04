"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

// ── Shared conversation renderer (used by both inline and expanded views) ──────

function QuestionCardNote({ msg, compact }: { msg: NoteMessage; compact?: boolean }) {
  const q = msg.questionMeta!;
  const scoreBadge = q.fullMark
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : q.earned > 0
    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
    : "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <div className="border border-sky-500/20 bg-sky-500/5 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className={`font-bold text-sky-400/70 uppercase tracking-wider ${compact ? "text-[9px]" : "text-[10px]"}`}>
          Question {q.number} of {q.total}
        </span>
        <span className={`font-bold border rounded-full px-2 py-0.5 ${scoreBadge} ${compact ? "text-[9px]" : "text-xs"}`}>
          {q.earned}/{q.max} pts {q.fullMark ? "✓" : "✗"}
        </span>
      </div>
      <p className={`text-white/90 font-medium leading-relaxed ${compact ? "text-xs" : "text-sm"}`}>{q.question}</p>
      <div className={`space-y-1 ${compact ? "text-[10px]" : "text-xs"}`}>
        <div className="flex gap-2">
          <span className="text-white/30 w-20 shrink-0">My answer:</span>
          <span className={`font-mono ${q.fullMark ? "text-emerald-300" : "text-red-300/80"}`}>{q.userAnswer}</span>
        </div>
        {!q.fullMark && (
          <div className="flex gap-2">
            <span className="text-white/30 w-20 shrink-0">Correct:</span>
            <span className="font-mono text-emerald-300">{q.correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteMessageRenderer({ msg, compact }: { msg: NoteMessage; compact?: boolean }) {
  const isUser = msg.role === "user";

  if (msg.type === "question_prompt" && msg.questionMeta) {
    return <QuestionCardNote msg={msg} compact={compact} />;
  }

  if (isUser) return null; // hide raw user follow-up prompts in notes

  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-1 bg-violet-500/20 border border-violet-500/30 text-violet-300">
        AI
      </div>
      <div className={`flex-1 rounded-2xl rounded-tl-sm px-4 py-3 leading-relaxed bg-white/[0.03] border border-white/8 text-white/85 ${compact ? "text-xs" : "text-sm"}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children }) {
              const lang = className?.replace("language-", "") ?? "";
              const codeText = String(children).replace(/\n$/, "");
              if (lang) {
                return (
                  <div className="my-3 rounded-xl overflow-hidden border border-white/10">
                    <div className="flex items-center bg-white/5 px-3 py-1.5 border-b border-white/8">
                      <span className="text-[10px] text-white/40 font-mono">{lang}</span>
                    </div>
                    <pre className="overflow-x-auto p-4 bg-[#0a1628]">
                      <code className={`text-emerald-300 font-mono leading-relaxed ${compact ? "text-[11px]" : "text-xs"}`}>{codeText}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <code className="bg-white/10 text-emerald-300 rounded px-1.5 py-0.5 text-[11px] font-mono">{children}</code>
              );
            },
            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-white/80">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-white/80">{children}</ol>,
            li: ({ children }) => <li className="text-white/80">{children}</li>,
            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
            em: ({ children }) => <em className="text-white/70 italic">{children}</em>,
            h1: ({ children }) => <h1 className="text-base font-bold text-white mb-2 mt-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-sm font-bold text-white mb-2 mt-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-semibold text-white mb-1 mt-3">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-sky-500/40 pl-3 my-2 text-white/55 italic">{children}</blockquote>
            ),
            hr: () => <hr className="border-white/10 my-4" />,
          }}
        >
          {msg.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ── Full-panel expanded view ───────────────────────────────────────────────────

function ExpandedNotePanel({ note, onClose }: { note: TutorNote; onClose: () => void }) {
  const scoreColor =
    (note.percentage ?? 0) >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
    (note.percentage ?? 0) >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
    "text-red-400 bg-red-500/10 border-red-500/20";

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    // Covers the right panel only — md:left-56 matches the sidebar width (w-56 = 224px)
    <div className="fixed inset-0 md:left-56 z-40 flex flex-col bg-[#060d1a]">
      {/* Panel header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/8 shrink-0 bg-[#070f20]">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors shrink-0"
          title="Close (Esc)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline text-xs">Back to Notes</span>
        </button>

        <div className="w-px h-5 bg-white/10 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
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
          <h2 className="text-white font-bold text-sm leading-tight mt-0.5 truncate">{note.title}</h2>
          <p className="text-white/35 text-xs">{note.moduleLabel} · {formatDate(note.savedAt)}</p>
        </div>

        <div className="shrink-0 text-white/25 text-[10px] hidden sm:block">
          {note.messages.filter(m => m.role === "assistant").length} AI explanations
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/35 hover:text-white hover:bg-white/8 transition-colors shrink-0"
          title="Close (Esc)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 space-y-6">
          {note.messages.map((msg, i) => (
            <NoteMessageRenderer key={i} msg={msg} compact={false} />
          ))}
          <div className="h-8" />
        </div>
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
      {/* Card header */}
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
            {/* Expand to full panel */}
            <button
              onClick={onExpand}
              title="Expand to full view"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button
              onClick={onPin}
              title={note.pinned ? "Unpin" : "Pin"}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm hover:bg-white/8 transition-colors"
            >
              {note.pinned ? "📌" : "📍"}
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={onDelete} className="text-[10px] text-red-400 border border-red-500/30 hover:bg-red-500/15 rounded px-2 py-1 transition-colors">Delete</button>
                <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-white/30 border border-white/10 hover:bg-white/5 rounded px-2 py-1 transition-colors">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete note"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                🗑
              </button>
            )}
          </div>
        </div>

        {/* Snippet preview */}
        {!expanded && (
          <p className="text-white/40 text-xs mt-2.5 leading-relaxed line-clamp-2">{firstAiSnippet(note)}</p>
        )}

        {/* Stats + actions row */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-white/25 text-[10px]">
            {note.messages.filter(m => m.role === "assistant").length} AI responses
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onExpand}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors font-semibold"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Expand
            </button>
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {expanded ? "Collapse ▲" : "Preview ▼"}
            </button>
          </div>
        </div>
      </div>

      {/* Inline preview (compact) */}
      {expanded && (
        <div className="border-t border-white/8 px-4 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
          {note.messages.map((msg, i) => (
            <NoteMessageRenderer key={i} msg={msg} compact />
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
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center text-3xl">
        📝
      </div>
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
      <Link
        href="/dashboard/tutor"
        className="text-sm text-violet-400 hover:text-violet-300 border border-violet-500/25 hover:border-violet-500/40 rounded-xl px-5 py-2.5 transition-all"
      >
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

  const filtered = useMemo(() => {
    let list = [...notes];
    if (filter !== "all") list = list.filter((n) => n.source === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.moduleLabel.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          n.messages.some((m) => m.content.toLowerCase().includes(q))
      );
    }
    return list;
  }, [notes, filter, search]);

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  const bySubject = useMemo(() => {
    const groups: Record<string, TutorNote[]> = {};
    for (const note of unpinned) {
      if (!groups[note.subject]) groups[note.subject] = [];
      groups[note.subject].push(note);
    }
    return groups;
  }, [unpinned]);

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
    <>
      {/* Full-panel expanded view */}
      {expandedNote && (
        <ExpandedNotePanel note={expandedNote} onClose={() => setExpandedNote(null)} />
      )}

      <div className="p-6 lg:p-8 max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📝</span> My Study Notes
            </h1>
            <p className="text-white/45 text-sm mt-1">
              AI Tutor conversations saved by module — ready to review any time
            </p>
          </div>
          <Link
            href="/dashboard/tutor"
            className="flex items-center gap-2 text-sm bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 px-4 py-2.5 rounded-xl transition-all font-semibold shrink-0"
          >
            🤖 Open Tutor
          </Link>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="flex-1 bg-white/[0.04] border border-white/10 focus:border-sky-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-colors"
          />
          <div className="flex gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === t.key
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/25"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t.label}
                <span className={`text-[9px] rounded-full px-1.5 py-0.5 font-bold ${
                  filter === t.key ? "bg-sky-500/30 text-sky-300" : "bg-white/8 text-white/30"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-8">
            {/* Pinned */}
            {pinned.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>📌</span> Pinned
                </h2>
                <div className="space-y-3">
                  {pinned.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      expanded={expanded.has(note.id)}
                      onToggle={() => toggleExpand(note.id)}
                      onExpand={() => setExpandedNote(note)}
                      onPin={() => togglePin(note.id)}
                      onDelete={() => deleteNote(note.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* By subject */}
            {Object.entries(bySubject).map(([subject, subjectNotes]) => (
              <section key={subject}>
                <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/15 inline-block" />
                  {subject}
                  <span className="text-white/20">({subjectNotes.length})</span>
                  <span className="flex-1 h-px bg-white/8 inline-block" />
                </h2>
                <div className="space-y-3">
                  {subjectNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      expanded={expanded.has(note.id)}
                      onToggle={() => toggleExpand(note.id)}
                      onExpand={() => setExpandedNote(note)}
                      onPin={() => togglePin(note.id)}
                      onDelete={() => deleteNote(note.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
