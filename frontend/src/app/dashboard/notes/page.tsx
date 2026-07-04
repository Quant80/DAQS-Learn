"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTutorNotes, TutorNote, NoteSource } from "@/store/tutorNotes";

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

function NoteCard({ note, expanded, onToggle, onPin, onDelete }: {
  note: TutorNote;
  expanded: boolean;
  onToggle: () => void;
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
      {/* Card header — always visible */}
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
          <div className="flex items-center gap-1.5 shrink-0">
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

        {/* Stats row */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-white/25 text-[10px]">
            {note.messages.filter(m => m.role === "assistant").length} AI responses · {note.messages.filter(m => m.role === "user").length} questions
          </span>
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            {expanded ? "Collapse ▲" : "Read note ▼"}
          </button>
        </div>
      </div>

      {/* Expanded conversation */}
      {expanded && (
        <div className="border-t border-white/8 px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {note.messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-1 ${
                  isUser
                    ? "bg-sky-500/20 border border-sky-500/30 text-sky-300"
                    : "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                }`}>
                  {isUser ? "U" : "AI"}
                </div>
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-sky-500/10 border border-sky-500/15 text-white/80 rounded-tr-sm"
                    : "bg-white/[0.03] border border-white/8 text-white/80 rounded-tl-sm"
                }`}>
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ className, children }) {
                          const lang = className?.replace("language-", "") ?? "";
                          const codeText = String(children).replace(/\n$/, "");
                          if (lang) {
                            return (
                              <div className="my-2 rounded-xl overflow-hidden border border-white/10">
                                <div className="flex items-center justify-between bg-white/5 px-3 py-1 border-b border-white/8">
                                  <span className="text-[9px] text-white/40 font-mono">{lang}</span>
                                </div>
                                <pre className="overflow-x-auto p-3 bg-[#0a1628]">
                                  <code className="text-[11px] text-emerald-300 font-mono leading-relaxed">{codeText}</code>
                                </pre>
                              </div>
                            );
                          }
                          return (
                            <code className="bg-white/10 text-emerald-300 rounded px-1 py-0.5 text-[10px] font-mono">{children}</code>
                          );
                        },
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 text-white/75">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 text-white/75">{children}</ol>,
                        li: ({ children }) => <li className="text-white/75">{children}</li>,
                        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        h1: ({ children }) => <h1 className="text-sm font-bold text-white mb-1.5 mt-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xs font-bold text-white mb-1 mt-2.5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-semibold text-white mb-1 mt-2">{children}</h3>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-sky-500/40 pl-2.5 my-1.5 text-white/55 italic">{children}</blockquote>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

export default function NotesPage() {
  const { notes, deleteNote, togglePin } = useTutorNotes();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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
          {/* Pinned section */}
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
                    onPin={() => togglePin(note.id)}
                    onDelete={() => deleteNote(note.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Subject groups */}
          {Object.entries(bySubject).map(([subject, subjectNotes]) => (
            <section key={subject}>
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-white/15 inline-block" />
                {subject}
                <span className="text-white/20">({subjectNotes.length})</span>
                <span className="w-full h-px bg-white/8 inline-block" />
              </h2>
              <div className="space-y-3">
                {subjectNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    expanded={expanded.has(note.id)}
                    onToggle={() => toggleExpand(note.id)}
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
  );
}
