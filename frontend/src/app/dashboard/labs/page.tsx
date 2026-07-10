"use client";
import { useState } from "react";
import { CourseIcon } from "@/components/CourseIcon";

const LABS_URL = process.env.NEXT_PUBLIC_LABS_URL ?? "http://localhost:7681";
const DOCKER_LAB_URL = process.env.NEXT_PUBLIC_DOCKER_LAB_URL ?? "http://localhost:7682";

interface Lab {
  id: string;
  title: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  tags: string[];
  description: string;
  objectives: string[];
  starter: string;
}

const LABS: Lab[] = [
  {
    id: "lab-01",
    title: "Python Fundamentals",
    icon: "/Python-Logo.png",
    difficulty: "beginner",
    duration: 30,
    tags: ["Python", "Basics", "Functions"],
    description: "Master variables, loops, functions, and error handling.",
    objectives: [
      "Work with variables and core data types",
      "Write loops and conditionals",
      "Define and call functions with type hints",
      "Handle exceptions with try/except",
      "Manipulate strings programmatically",
    ],
    starter: "python3 lab_01_python.py",
  },
  {
    id: "lab-02",
    title: "Data Analysis with Pandas",
    icon: "📊",
    difficulty: "intermediate",
    duration: 45,
    tags: ["Python", "Pandas", "NumPy", "Data"],
    description: "Load, clean, and analyse datasets using Pandas and NumPy.",
    objectives: [
      "Create and manipulate DataFrames",
      "Filter, sort, and group data",
      "Calculate descriptive statistics",
      "Add computed columns",
      "Rank and compare rows",
    ],
    starter: "python3 lab_02_pandas.py",
  },
  {
    id: "lab-03",
    title: "Web Scraping & APIs",
    icon: "🌐",
    difficulty: "intermediate",
    duration: 40,
    tags: ["Python", "requests", "JSON", "CSV"],
    description: "Consume REST APIs and export structured data using Requests.",
    objectives: [
      "Make GET and POST HTTP requests",
      "Parse and navigate JSON responses",
      "Extract and reshape data",
      "Export results to CSV",
    ],
    starter: "python3 lab_03_scraping.py",
  },
  {
    id: "lab-04",
    title: "Sorting Algorithms",
    icon: "🧮",
    difficulty: "intermediate",
    duration: 35,
    tags: ["Python", "Algorithms", "Big O", "Performance"],
    description: "Implement and benchmark classic sorting algorithms from scratch.",
    objectives: [
      "Implement bubble sort (O(n²))",
      "Implement merge sort (O(n log n))",
      "Implement quicksort (avg O(n log n))",
      "Benchmark against Python's built-in sort",
      "Verify correctness with test cases",
    ],
    starter: "python3 lab_04_sorting.py",
  },
  {
    id: "lab-05",
    title: "REST API with FastAPI",
    icon: "⚡",
    difficulty: "advanced",
    duration: 60,
    tags: ["Python", "FastAPI", "REST", "Pydantic"],
    description: "Build a full CRUD REST API with validation and auto-generated docs.",
    objectives: [
      "Set up a FastAPI app with Pydantic models",
      "Implement GET, POST, PUT, DELETE endpoints",
      "Return proper HTTP status codes",
      "Handle not-found with HTTPException",
      "Add a stats summary endpoint",
    ],
    starter: "uvicorn lab_05_fastapi:app --reload --port 8001",
  },
  {
    id: "lab-06",
    title: "Machine Learning Intro",
    icon: "🤖",
    difficulty: "advanced",
    duration: 50,
    tags: ["Python", "scikit-learn", "ML", "Classification"],
    description: "Train your first classifier and evaluate it with real metrics.",
    objectives: [
      "Explore the Iris dataset with Pandas",
      "Split data into train and test sets",
      "Train a Decision Tree classifier",
      "Evaluate with accuracy, precision, recall",
      "Make predictions on new samples",
    ],
    starter: "python3 lab_06_ml.py",
  },
];

const DOCKER_LABS: Lab[] = [
  {
    id: "docker-lab-01",
    title: "Write Your First Dockerfile",
    icon: "📦",
    difficulty: "beginner",
    duration: 20,
    tags: ["Docker", "Dockerfile", "Build"],
    description: "Containerize a Python script — write a Dockerfile, build it, and run it.",
    objectives: [
      "Pick a base image",
      "Set a working directory",
      "Copy files into the image",
      "Define the run command",
      "Build and run your own image",
    ],
    starter: "cd lab_01_dockerfile && cat INSTRUCTIONS.md",
  },
  {
    id: "docker-lab-02",
    title: "Images & Containers",
    icon: "🗂️",
    difficulty: "beginner",
    duration: 20,
    tags: ["Docker", "CLI", "Containers"],
    description: "Master the core commands: run, exec, logs, stop, rm.",
    objectives: [
      "Pull and run images",
      "List running containers",
      "Exec into a running container",
      "Read container logs",
      "Stop and remove containers",
    ],
    starter: "cd lab_02_images_containers && cat INSTRUCTIONS.md",
  },
  {
    id: "docker-lab-03",
    title: "Volumes & Persistence",
    icon: "💾",
    difficulty: "intermediate",
    duration: 25,
    tags: ["Docker", "Volumes", "Storage"],
    description: "Understand why containers are throwaway, and how volumes persist data.",
    objectives: [
      "See data disappear without a volume",
      "Create and use a named volume",
      "Share data between containers",
      "Use bind mounts",
    ],
    starter: "cd lab_03_volumes && cat INSTRUCTIONS.md",
  },
  {
    id: "docker-lab-04",
    title: "Multi-Container Apps",
    icon: "🧩",
    difficulty: "intermediate",
    duration: 30,
    tags: ["Docker", "Compose", "Redis", "Flask"],
    description: "Run a web app + Redis with docker-compose, all in one command.",
    objectives: [
      "Write a docker-compose.yml",
      "Build and start multiple services",
      "Connect services over a shared network",
      "View logs across services",
      "Tear down a full stack cleanly",
    ],
    starter: "cd lab_04_compose && cat INSTRUCTIONS.md",
  },
];

const diffConfig = {
  beginner:     { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  intermediate: { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400"   },
  advanced:     { bg: "bg-red-500/10",      border: "border-red-500/20",     text: "text-red-400"     },
};

type Category = "python" | "docker";

export default function LabsPage() {
  const [category, setCategory] = useState<Category>("python");
  const [selected, setSelected] = useState<Lab | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const labs = category === "python" ? LABS : DOCKER_LABS;
  const labsUrl = category === "python" ? LABS_URL : DOCKER_LAB_URL;

  function switchCategory(next: Category) {
    setCategory(next);
    setSelected(null);
    setTerminalOpen(false);
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 0px)" }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-white/8 bg-[#060d1a] shrink-0">
        <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-lg">
          🧪
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">Docker Labs</h1>
          <p className="text-white/35 text-[10px]">{labs.length} labs · Interactive sandbox</p>
        </div>

        {/* Category tabs */}
        <div className="ml-4 flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
          <button
            onClick={() => switchCategory("python")}
            className={`text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              category === "python"
                ? "bg-sky-500 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            <CourseIcon icon="/Python-Logo.png" size={14} /> Python Lab
          </button>
          <button
            onClick={() => switchCategory("docker")}
            className={`text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
              category === "docker"
                ? "bg-sky-500 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            🐳 Docker Lab
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={labsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all"
          >
            Open terminal ↗
          </a>
          <button
            onClick={() => setTerminalOpen((v) => !v)}
            className={`text-xs font-semibold border rounded-xl px-4 py-1.5 transition-all ${
              terminalOpen
                ? "bg-teal-500/20 border-teal-500/30 text-teal-300"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
            }`}
          >
            {terminalOpen ? "Hide" : "Show"} Terminal
          </button>
        </div>
      </div>

      {/* ── Body (scrollable top + optional terminal bottom) ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Lab cards + instructions — scrollable */}
        <div className={`overflow-y-auto ${terminalOpen ? "flex-none" : "flex-1"}`}
          style={terminalOpen ? { height: "48%" } : {}}>
          <div className="p-6 lg:p-8 max-w-6xl space-y-6">
            {/* Lab grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {labs.map((lab) => {
                const c = diffConfig[lab.difficulty];
                const active = selected?.id === lab.id;
                return (
                  <button
                    key={lab.id}
                    onClick={() => setSelected(active ? null : lab)}
                    className={`text-left rounded-2xl p-5 border transition-all ${
                      active
                        ? "bg-sky-500/10 border-sky-500/30 ring-1 ring-sky-500/20"
                        : "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center text-xl`}>
                        <CourseIcon icon={lab.icon} size={26} />
                      </div>
                      <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${c.bg} ${c.border} ${c.text} capitalize`}>
                        {lab.difficulty}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1 leading-snug">{lab.title}</h3>
                    <p className="text-white/45 text-xs leading-relaxed mb-3">{lab.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/30">⏱ {lab.duration} min</span>
                      <span className={`font-semibold transition-colors ${active ? "text-sky-400" : "text-white/25"}`}>
                        {active ? "Selected ✓" : "Open →"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Selected lab instructions ── */}
            {selected && (
              <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                  <h2 className="text-white font-bold flex items-center gap-2 text-base">
                    <span>{selected.icon}</span> {selected.title}
                  </h2>
                  <button
                    onClick={() => setTerminalOpen(true)}
                    className="text-xs font-bold bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-xl transition-all"
                  >
                    Open Terminal →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Objectives */}
                  <div>
                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
                      Learning Objectives
                    </h3>
                    <ol className="space-y-2">
                      {selected.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-white/65">
                          <span className="text-teal-400 font-bold shrink-0 w-4">{i + 1}.</span>
                          {obj}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Starter + tags */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                        Run in Terminal
                      </h3>
                      <div className="bg-[#050d1c] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                        <code className="text-emerald-300 text-xs font-mono break-all">
                          {selected.starter}
                        </code>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-white/40 bg-white/5 border border-white/8 rounded px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                        Duration
                      </h3>
                      <p className="text-white/55 text-xs">⏱ {selected.duration} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Embedded terminal (ttyd) ── */}
        {terminalOpen && (
          <div className="flex-1 border-t border-white/8 flex flex-col min-h-0">
            {/* Terminal chrome bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#050d1c] border-b border-white/5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <span className="text-white/25 text-xs font-mono ml-2">bash — /workspace</span>
              {selected && (
                <span className="ml-auto text-[10px] text-teal-400/60 font-mono hidden sm:block">
                  {selected.starter}
                </span>
              )}
              <button
                onClick={() => setTerminalOpen(false)}
                className="ml-auto sm:ml-2 text-white/20 hover:text-white/50 text-xs transition-colors"
              >
                ✕
              </button>
            </div>
            <iframe
              src={labsUrl}
              className="flex-1 border-0 w-full"
              title="DAQS Labs Terminal"
            />
          </div>
        )}
      </div>
    </div>
  );
}
