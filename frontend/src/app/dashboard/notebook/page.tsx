"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useSubscription } from "@/store/subscription";
import { courses } from "@/data/courses";
import { CourseIcon } from "@/components/CourseIcon";

const JUPYTERLITE_URL  = "https://jupyterlite.github.io/demo/lab/index.html";
const JUPYTERLAB_URL   = process.env.NEXT_PUBLIC_NOTEBOOK_URL ?? "";
const JUPYTERLAB_TOKEN = process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";

type Tab = "lab" | "lite" | "library";

/** Every course whose curriculum links to this notebook file — mirrors the
 *  server-side gating in /api/notebooks/open, so locked cards match reality. */
function courseIdsForFile(filename: string): string[] {
  const ids = new Set<string>();
  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.notebookFile === filename) ids.add(course.id);
      }
    }
  }
  return [...ids];
}

// ── Course notebooks served from /public/notebooks/ ──────────────────────────
const COURSE_NOTEBOOKS = [
  {
    id: "00_introduction",
    file: "00_introduction.ipynb",
    title: "00 — Introduction to Python",
    desc: "What is programming, compilers vs interpreters, Python history, features, applications, and your first print() programs.",
    chapter: "Introduction",
    subject: "Python Programming",
    icon: "/Python-Logo.png",
    color: "sky",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "01_get_started",
    file: "01_get_started.ipynb",
    title: "01 — Get Started",
    desc: "Machine vs programming languages, high-level vs low-level, compilers vs interpreters (movie analogy), IDEs, and syntax rules.",
    chapter: "Chapter 1",
    subject: "Python Programming",
    icon: "🚀",
    color: "violet",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "02_hello_python",
    file: "02_hello_python.ipynb",
    title: "02 — Hello Python",
    desc: "What Python is, its history and creator, key features, 10 application areas, and your first Python programs with print().",
    chapter: "Chapter 2",
    subject: "Python Programming",
    icon: "👋",
    color: "amber",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "03_variables",
    file: "03_variables.ipynb",
    title: "03 — Variables",
    desc: "What variables are, their 5 properties, how to create/print/input them, naming rules, keywords, id(), reassigning, and del.",
    chapter: "Chapter 3",
    subject: "Python Programming",
    icon: "📦",
    color: "indigo",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "04_data_types",
    file: "04_data_types.ipynb",
    title: "04 — Data Types",
    desc: "None, bool, int, float, complex, str, list, tuple, set, dict — with type(), comments, and full type conversion using int(), float(), str(), ord(), chr() and more.",
    chapter: "Chapter 4",
    subject: "Python Programming",
    icon: "🗂️",
    color: "sky",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "05_operators",
    file: "05_operators.ipynb",
    title: "05 — Operators",
    desc: "Unary, assignment, arithmetic (+, -, *, /, //, %, **), math module, compound operators (+=, -=…), relational, and identity operators (is, is not).",
    chapter: "Chapter 5",
    subject: "Python Programming",
    icon: "🔢",
    color: "violet",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "06_conditional_statements",
    file: "06_conditional_statements.ipynb",
    title: "06 — Conditional Statements",
    desc: "if, if-else, if-elif-else, nested if, indentation, logical operators, variable swapping (4 methods), bitwise operators, membership operators, and eval().",
    chapter: "Chapter 6",
    subject: "Python Programming",
    icon: "🔀",
    color: "amber",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "07_functions",
    file: "07_functions.ipynb",
    title: "07 — Functions",
    desc: "def, return, 5 argument types (*args, **kwargs), nested/recursive functions, local vs global scope, lambda, filter/map/reduce, decorators, and generators.",
    chapter: "Chapter 7",
    subject: "Python Programming",
    icon: "⚙️",
    color: "indigo",
    difficulty: "Intermediate",
    pages: 1,
  },
  {
    id: "08_strings",
    file: "08_strings.ipynb",
    title: "08 — Strings",
    desc: "Creating strings, positive/negative indexing, slicing, immutability, concatenation, repetition, len(), find(), index(), count(), replace(), split(), join(), case methods, and validation.",
    chapter: "Chapter 8",
    subject: "Python Programming",
    icon: "📝",
    color: "sky",
    difficulty: "Beginner",
    pages: 1,
  },
  {
    id: "09_list_tuple",
    file: "09_list_tuple.ipynb",
    title: "09 — List and Tuple",
    desc: "Creating, accessing, modifying lists; 9 cloning methods (shallow/deep copy); len(), count(), max(), min(), sum(), random.choice(); nested lists, aliasing, relational & membership operators; and immutable tuples with packing/unpacking.",
    chapter: "Chapter 9",
    subject: "Python Programming",
    icon: "📋",
    color: "violet",
    difficulty: "Intermediate",
    pages: 1,
  },
  {
    id: "10_control_flow",
    file: "10_control_flow.ipynb",
    title: "10 — Control Flow (Loops)",
    desc: "while and for loops, infinite loops, all 4 nested loop types, break/continue/pass statements, list comprehension, tuple comprehension with generators, and star/number/alphabet pattern drawing.",
    chapter: "Chapter 10",
    subject: "Python Programming",
    icon: "🔁",
    color: "amber",
    difficulty: "Intermediate",
    pages: 1,
  },
  {
    id: "11_set",
    file: "11_set.ipynb",
    title: "11 — Set",
    desc: "Unique element collections: creating sets (3 methods), add/update/copy, pop/remove/discard/clear, all set operations (union |, intersection &, difference -, symmetric_difference ^), issubset/issuperset/isdisjoint, Venn diagrams, and frozenset.",
    chapter: "Chapter 11",
    subject: "Python Programming",
    icon: "🔷",
    color: "indigo",
    difficulty: "Intermediate",
    pages: 1,
  },
  {
    id: "12_dictionary",
    file: "12_dictionary.ipynb",
    title: "12 — Dictionary",
    desc: "Key-value pairs: 5 creation methods (zip, fromkeys), insert/update, accessing with get/setdefault/items/keys/values, del/pop/popitem/clear, dictionary comprehension, nested dicts, and real-world examples.",
    chapter: "Chapter 12",
    subject: "Python Programming",
    icon: "📖",
    color: "sky",
    difficulty: "Intermediate",
    pages: 1,
  },
  {
    id: "13_oop",
    file: "13_oop.ipynb",
    title: "13 — Object Oriented Programming",
    desc: "Classes, objects, constructors, instance/static/local variables, encapsulation (public/protected/private), single/multilevel/multiple inheritance, polymorphism (overriding, operator overloading, duck typing), and abstract classes.",
    chapter: "Chapter 13",
    subject: "Python Programming",
    icon: "🏭",
    color: "violet",
    difficulty: "Advanced",
    pages: 1,
  },
  {
    id: "14_exception_handling",
    file: "14_exception_handling.ipynb",
    title: "14 — Exception Handling",
    desc: "Syntax vs runtime errors, normal vs abnormal flow, try-except, printing exception info, multiple except blocks, default except, finally block (3 cases), nested try-except-finally, else block, valid combinations, and custom exceptions with raise.",
    chapter: "Chapter 14",
    subject: "Python Programming",
    icon: "🛡️",
    color: "amber",
    difficulty: "Advanced",
    pages: 1,
  },
  {
    id: "tutoriall_capstone",
    file: "Tutoriall.ipynb",
    title: "Capstone — Full Python Tutorial",
    desc: "The complete Python Advanced capstone project — brings together everything from functions and OOP to real-world problem solving in one guided notebook.",
    chapter: "Capstone",
    subject: "Python Programming",
    icon: "🏆",
    color: "indigo",
    difficulty: "Advanced",
    pages: 1,
  },
];

// ── Starter notebook topics ──────────────────────────────────────────────────
const STARTER_NOTEBOOKS = [
  {
    track: "Python", icon: "/Python-Logo.png", color: "sky",
    notebooks: [
      { label: "Python Basics",          desc: "Variables, loops, functions" },
      { label: "Lists & Dict operations", desc: "Core data structures"        },
      { label: "File I/O",               desc: "Read and write files"         },
    ],
  },
  {
    track: "Data Science", icon: "📊", color: "violet",
    notebooks: [
      { label: "NumPy essentials",  desc: "Arrays and vectorised ops"   },
      { label: "Pandas DataFrames", desc: "Load, clean, filter data"    },
      { label: "Matplotlib plots",  desc: "Line, bar, scatter charts"   },
    ],
  },
  {
    track: "Machine Learning", icon: "🤖", color: "amber",
    notebooks: [
      { label: "Linear Regression",  desc: "From scratch with numpy"    },
      { label: "Scikit-learn basics", desc: "Train, test, evaluate"     },
      { label: "Decision Trees",      desc: "Classification walkthrough" },
    ],
  },
  {
    track: "Mathematics", icon: "🔢", color: "indigo",
    notebooks: [
      { label: "Statistics with SciPy", desc: "Distributions & tests"  },
      { label: "Linear Algebra",        desc: "Matrices with numpy"     },
      { label: "Calculus & gradients",  desc: "Derivatives numerically" },
    ],
  },
];

const colorMap: Record<string, { pill: string; dot: string }> = {
  sky:    { pill: "bg-sky-500/15 text-sky-400 border-sky-500/25",         dot: "bg-sky-400"    },
  violet: { pill: "bg-violet-500/15 text-violet-400 border-violet-500/25", dot: "bg-violet-400" },
  amber:  { pill: "bg-amber-500/15 text-amber-400 border-amber-500/25",   dot: "bg-amber-400"  },
  indigo: { pill: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25", dot: "bg-indigo-400" },
};

const diffColor: Record<string, string> = {
  Beginner:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  Intermediate: "text-amber-400  bg-amber-500/10  border-amber-500/25",
  Advanced:     "text-rose-400   bg-rose-500/10   border-rose-500/25",
};

// ── Course Library pane ──────────────────────────────────────────────────────
function CourseLibraryPane() {
  const [launching, setLaunching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const email = useAuthStore((s) => s.user?.email);
  const token = useAuthStore((s) => s.token);
  const canAccessCourse = useSubscription((s) => s.canAccessCourse);
  // Force re-render when the fields canAccessCourse reads internally change —
  // selecting only the method doesn't subscribe to the state it reads via get().
  useSubscription((s) => s.subscription);
  useSubscription((s) => s.pythonPromoGranted);
  useSubscription((s) => s.unlockedCourseIds);

  function hasAccess(nb: typeof COURSE_NOTEBOOKS[0]): boolean {
    const gatingCourseIds = courseIdsForFile(nb.file);
    return gatingCourseIds.length === 0 || gatingCourseIds.some((id) => canAccessCourse(id));
  }

  async function openInJupyterLab(nb: typeof COURSE_NOTEBOOKS[0]) {
    if (!email || !token) {
      setError("Please sign in again to open notebooks in JupyterLab.");
      return;
    }
    setLaunching(nb.id);
    setError(null);
    try {
      const res = await fetch("/api/notebooks/open", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: nb.file, email }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Failed to open notebook in JupyterLab.");
      } else {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLaunching(null);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-white">Course Notebooks</h2>
          <p className="text-white/40 text-sm mt-1">
            Click <strong className="text-white/60">Open in JupyterLab</strong> to launch the notebook directly in your browser — no download needed.
          </p>
        </div>

        {/* How-to banner */}
        <div className="bg-sky-500/[0.06] border border-sky-500/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-300/70">
          <span className="text-base shrink-0">🖥️</span>
          <span>
            Notebooks open in <strong className="text-sky-200">JupyterLab</strong> in a new tab — you can run code, edit cells, and save your work.
            Use <strong className="text-sky-200">⬇ Download</strong> if you want a copy on your computer.
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-400">
            <span className="text-base shrink-0">⚠️</span>
            <div>
              <p className="font-bold mb-0.5">Could not open JupyterLab</p>
              <p className="text-red-400/70">{error}</p>
              <p className="text-white/30 mt-1.5">
                If JupyterLab is not running yet, start it with <code className="bg-white/5 px-1 rounded">docker compose up jupyter</code> or use the ⬇ Download button instead.
              </p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-white/30 hover:text-white/60 shrink-0 text-base">×</button>
          </div>
        )}

        {/* Notebook cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COURSE_NOTEBOOKS.map((nb) => {
            const unlocked = hasAccess(nb);
            return (
            <div key={nb.id} className={`bg-white/[0.03] border rounded-2xl p-5 flex flex-col gap-3 transition-all ${
              unlocked ? "border-white/10 hover:border-sky-500/30 hover:bg-white/[0.05]" : "border-white/8 opacity-80"
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-xl shrink-0">
                    <CourseIcon icon={nb.icon} size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">{nb.subject}</p>
                    <h3 className="text-white font-bold text-sm leading-tight">{nb.title}</h3>
                  </div>
                </div>
                <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 shrink-0 ${
                  unlocked ? (diffColor[nb.difficulty] ?? diffColor.Beginner) : "text-amber-400 bg-amber-500/10 border-amber-500/25"
                }`}>
                  {unlocked ? nb.difficulty : "🔒 Pro"}
                </span>
              </div>

              <p className="text-white/40 text-xs leading-relaxed">{nb.desc}</p>

              <div className="mt-auto flex items-center gap-2 pt-1">
                {unlocked ? (
                  <>
                    {/* Download */}
                    <a
                      href={`/notebooks/${nb.file}`}
                      download={nb.file}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white px-3 py-1.5 rounded-xl transition-all shrink-0"
                    >
                      ⬇ Download
                    </a>
                    {/* Open in JupyterLab */}
                    <button
                      onClick={() => openInJupyterLab(nb)}
                      disabled={!!launching}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-500 hover:from-sky-500 hover:to-indigo-400 disabled:opacity-50 text-white px-3 py-2 rounded-xl transition-all shadow-md shadow-sky-600/20"
                    >
                      {launching === nb.id ? (
                        <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> Uploading…</>
                      ) : (
                        <>🖥️ Open in JupyterLab ↗</>
                      )}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/dashboard/billing"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-3 py-2 rounded-xl transition-all"
                  >
                    🔒 Upgrade to Pro to unlock
                  </Link>
                )}
              </div>
            </div>
            );
          })}

          {/* Coming soon placeholder */}
          <div className="bg-white/[0.015] border border-dashed border-white/8 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 min-h-[160px]">
            <span className="text-3xl opacity-30">📓</span>
            <p className="text-white/20 text-xs">More notebooks coming soon</p>
            <p className="text-white/15 text-[11px]">Variables · Data Types · Operators · Strings…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── JupyterLab tab pane ──────────────────────────────────────────────────────
function JupyterLabPane({ labStatus }: { labStatus: "checking" | "online" | "offline" }) {
  const labUrl = JUPYTERLAB_TOKEN
    ? `${JUPYTERLAB_URL}?token=${JUPYTERLAB_TOKEN}`
    : JUPYTERLAB_URL;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {/* Hero card */}
        <div className="bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/25 to-indigo-500/15 border border-sky-500/30 flex items-center justify-center text-4xl shadow-lg shadow-sky-500/10">
            🖥️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">JupyterLab on DAQS Server</h2>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed mx-auto">
              Full persistent notebook environment running on the DAQS Oracle Cloud server.
              Files are saved between sessions. Supports NumPy, Pandas, Matplotlib, Scikit-learn and more.
            </p>
          </div>

          {labStatus === "offline" || !JUPYTERLAB_URL ? (
            <div className="w-full max-w-md space-y-3 text-left">
              <div className="bg-black/30 border border-white/10 rounded-xl px-5 py-4">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Server URL</p>
                <code className="text-white/50 text-xs font-mono">{JUPYTERLAB_URL || "Not configured"}</code>
              </div>
              <p className="text-white/30 text-xs text-center">
                {JUPYTERLAB_URL ? "Server is currently offline — check docker compose on the OCI server." : "Set NEXT_PUBLIC_NOTEBOOK_URL to enable."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <a
                href={labUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-sky-500/25 text-sm"
              >
                Launch JupyterLab ↗
              </a>
              {JUPYTERLAB_TOKEN && (
                <p className="text-white/25 text-xs">
                  Token: <code className="text-white/40 font-mono">{JUPYTERLAB_TOKEN}</code>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">✨ What&apos;s available</h2>
            <ul className="space-y-2.5">
              {[
                "Full JupyterLab interface",
                "Persistent file system (saved between sessions)",
                "NumPy, Pandas, Matplotlib, Seaborn",
                "Scikit-learn & SciPy",
                "IPython magic commands",
                "Upload & download notebooks",
                "Multiple kernels per session",
                "Inline plots & rich output",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-xs text-white/60">
                  <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">⌨️ Useful shortcuts</h2>
            <div className="space-y-2.5">
              {[
                { keys: "Shift + Enter", desc: "Run cell and move to next" },
                { keys: "Ctrl + Enter",  desc: "Run cell in place"         },
                { keys: "A / B",         desc: "Insert cell above / below" },
                { keys: "D D",           desc: "Delete selected cell"      },
                { keys: "M",             desc: "Change cell to Markdown"   },
                { keys: "Y",             desc: "Change cell to code"       },
                { keys: "Ctrl + S",      desc: "Save notebook"             },
                { keys: "0 0",           desc: "Restart kernel"            },
              ].map((s) => (
                <div key={s.keys} className="flex items-center justify-between gap-4">
                  <span className="text-white/55 text-xs">{s.desc}</span>
                  <kbd className="shrink-0 text-[10px] font-mono bg-white/8 border border-white/12 rounded px-2 py-0.5 text-white/55 whitespace-nowrap">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs text-center">
          JupyterLab opens in a new tab — cross-origin policy prevents embedding.
        </p>
      </div>
    </div>
  );
}

// ── JupyterLite tab pane ─────────────────────────────────────────────────────
function JupyterLitePane() {
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tutorCode, setTutorCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("fromTutor") === "1") {
      const code = sessionStorage.getItem("daqs_tutor_code");
      if (code) {
        setTutorCode(code);
        sessionStorage.removeItem("daqs_tutor_code");
        navigator.clipboard.writeText(code).catch(() => {});
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 4000);
        setLoading(true);
        setLaunched(true);
      }
    }
  }, []);

  function copyCode() {
    if (!tutorCode) return;
    navigator.clipboard.writeText(tutorCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  if (launched) {
    return (
      <div className="flex-1 flex flex-col">
        {tutorCode && (
          <div className="bg-sky-500/[0.07] border-b border-sky-500/25 px-4 py-2.5 flex items-center gap-3 shrink-0 flex-wrap">
            <span className="text-sky-300 text-xs font-bold flex items-center gap-1.5">🤖 AI Tutor Code ready</span>
            <span className="text-white/40 text-xs flex-1 min-w-0">Open a new cell → Ctrl+V to paste</span>
            <button onClick={copyCode} className="text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white px-3 py-1 rounded-lg transition-colors shrink-0">
              {codeCopied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button onClick={() => setTutorCode(null)} className="text-white/30 hover:text-white/60 text-base shrink-0">×</button>
          </div>
        )}

        {/* Toolbar */}
        <div className="h-9 bg-[#0d0d14] border-b border-white/8 flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setLaunched(false)}
            className="text-white/40 hover:text-white text-xs transition-colors flex items-center gap-1.5"
          >
            ← Notebook home
          </button>
          <div className="w-px h-4 bg-white/10" />
          {loading && (
            <span className="text-emerald-400 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Loading Python runtime (~20–30s)…
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/notebook"
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/25 hover:border-emerald-500/50 rounded-lg px-2.5 py-1 transition-all"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" />
              </svg>
              Expand
            </Link>
          </div>
        </div>

        <iframe
          key="jlite"
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {/* Hero card */}
        <div className="bg-gradient-to-br from-emerald-600/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600/25 to-teal-500/15 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/10">
            ⚡
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">JupyterLite — In Your Browser</h2>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed mx-auto">
              Full Jupyter environment powered by <strong className="text-white">Pyodide + WebAssembly</strong> — runs entirely in your browser.
              No server, no install. NumPy, Pandas, Matplotlib and Scikit-learn all included.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => { setLoading(true); setLaunched(true); }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/25 text-sm"
            >
              🚀 Launch JupyterLite
            </button>
            <p className="text-white/25 text-xs">First load ~20–30 s · not saved between sessions</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5 flex gap-4">
          <div className="text-3xl shrink-0">🧮</div>
          <div className="space-y-1.5">
            <div className="text-white font-semibold text-sm">Python runs in your browser</div>
            <p className="text-white/45 text-sm leading-relaxed">
              JupyterLite uses <strong className="text-white">Pyodide</strong> — a full CPython distribution compiled to WebAssembly.
              First load downloads ~20 MB of runtime; subsequent visits are faster due to caching.
            </p>
            <p className="text-white/30 text-xs">Notebooks are not auto-saved — download your work (File → Download) before closing.</p>
          </div>
        </div>

        {/* AI Tutor code banner */}
        {tutorCode && (
          <div className="bg-sky-500/[0.06] border border-sky-500/30 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-sky-500/20 bg-sky-500/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🤖</span>
                <div>
                  <div className="text-sky-300 font-semibold text-sm">Code from AI Tutor</div>
                  <div className="text-white/40 text-xs">Auto-copied to clipboard — open a new cell and press Ctrl+V</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={copyCode} className="text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-lg transition-colors">
                  {codeCopied ? "✓ Copied!" : "Copy code"}
                </button>
                <button onClick={() => setTutorCode(null)} className="text-white/30 hover:text-white/60 text-lg leading-none px-1">×</button>
              </div>
            </div>
            <pre className="overflow-x-auto p-4 bg-[#060e1f] text-xs text-emerald-300 font-mono leading-relaxed max-h-52">{tutorCode}</pre>
          </div>
        )}

        {/* Starter notebooks */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Starter notebooks by track</h2>
          <div className="bg-emerald-500/[0.04] border border-emerald-500/15 rounded-2xl p-4 text-xs text-emerald-400/70 flex items-start gap-3">
            <span className="text-base shrink-0">💡</span>
            <span>Launch JupyterLite above, then use <strong className="text-emerald-300">File → New → Notebook</strong> to start any of these topics.</span>
          </div>
          {STARTER_NOTEBOOKS.map((track) => {
            const colors = colorMap[track.color];
            return (
              <div key={track.track} className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/6 flex items-center gap-2">
                  <span className="text-lg"><CourseIcon icon={track.icon} size={18} /></span>
                  <span className="text-white font-semibold text-sm">{track.track}</span>
                  <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ml-auto ${colors.pill}`}>
                    {track.notebooks.length} topics
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {track.notebooks.map((nb) => (
                    <div key={nb.label} className="w-full text-left px-5 py-3 flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{nb.label}</div>
                        <div className="text-white/35 text-xs">{nb.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function NotebookPage() {
  const [tab, setTab] = useState<Tab>("library");
  const [labStatus, setLabStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    if (!JUPYTERLAB_URL) { setLabStatus("offline"); return; }
    fetch(JUPYTERLAB_URL, { mode: "no-cors" })
      .then(() => setLabStatus("online"))
      .catch(() => setLabStatus("offline"));
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#0a0a10]">

      {/* ── Unified header bar ── */}
      <div className="h-12 bg-[#0d0d18] border-b border-white/8 flex items-center px-4 gap-3 shrink-0">

        {/* Icon + title */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500/20 to-emerald-600/20 border border-white/10 flex items-center justify-center text-sm">
            📓
          </div>
          <span className="text-white font-bold text-sm hidden sm:block">DAQS Notebook</span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-0.5 bg-white/5 border border-white/8 rounded-xl p-1">
          <button
            onClick={() => setTab("library")}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              tab === "library"
                ? "bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-md"
                : "text-violet-400/60 hover:text-violet-300"
            }`}
          >
            <span>📚</span>
            <span>Course Library</span>
          </button>
          <button
            onClick={() => setTab("lite")}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              tab === "lite"
                ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/30"
                : "text-emerald-400/60 hover:text-emerald-300"
            }`}
          >
            <span>⚡</span>
            <span>JupyterLite</span>
          </button>
          <button
            onClick={() => setTab("lab")}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              tab === "lab"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
                : "text-sky-400/50 hover:text-sky-300"
            }`}
          >
            <span>🖥️</span>
            <span>JupyterLab</span>
          </button>
        </div>

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-2">
          {tab === "lab" ? (
            <>
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${
                labStatus === "online"  ? "text-emerald-400" :
                labStatus === "offline" ? "text-red-400"     : "text-white/35"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  labStatus === "online"  ? "bg-emerald-400" :
                  labStatus === "offline" ? "bg-red-400"     : "bg-white/30 animate-pulse"
                }`} />
                {labStatus === "online" ? "Online" : labStatus === "offline" ? "Offline" : "Checking…"}
              </div>
              <a
                href={JUPYTERLAB_TOKEN ? `${JUPYTERLAB_URL}?token=${JUPYTERLAB_TOKEN}` : JUPYTERLAB_URL}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  !JUPYTERLAB_URL || labStatus === "offline"
                    ? "bg-white/5 border border-white/10 text-white/25 pointer-events-none"
                    : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-md shadow-sky-500/20"
                }`}
              >
                Open JupyterLab ↗
              </a>
            </>
          ) : (
            <Link
              href="/notebook"
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/25 hover:border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl px-3 py-2 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" />
              </svg>
              Expand
            </Link>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 min-h-0">
        {tab === "library" ? (
          <CourseLibraryPane />
        ) : tab === "lab" ? (
          <JupyterLabPane labStatus={labStatus} />
        ) : (
          <JupyterLitePane />
        )}
      </div>
    </div>
  );
}
