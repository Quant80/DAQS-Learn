import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: "🧮",
    title: "DAQS Notebook",
    desc: "Cloud Jupyter notebooks — run Python, R, and data science tools directly in your browser. No setup required.",
    badge: "Phase 5",
  },
  {
    icon: "💻",
    title: "DAQS Studio",
    desc: "A full VS Code IDE in the browser. Write, debug, and deploy real projects from any device.",
    badge: "Phase 6",
  },
  {
    icon: "🤖",
    title: "AI Tutor",
    desc: "Claude-powered AI tutor that explains concepts, reviews your code, and answers questions 24/7.",
    badge: "Phase 8",
  },
  {
    icon: "🧪",
    title: "Docker Labs",
    desc: "Isolated containerised lab environments. Experiment safely — break things, learn fast.",
    badge: "Phase 7",
  },
  {
    icon: "📋",
    title: "Smart Assessments",
    desc: "AI-marked assignments, quizzes, and coding challenges with instant detailed feedback.",
    badge: "Phase 9",
  },
  {
    icon: "📡",
    title: "Live Classroom",
    desc: "Real-time video classes, interactive whiteboard, and screen sharing with your lecturer.",
    badge: "Phase 11",
  },
];

const roles = [
  {
    icon: "🎓",
    title: "Students",
    color: "from-sky-500/20 to-blue-500/10 border-sky-500/20",
    accent: "text-sky-400",
    points: [
      "Access Jupyter notebooks and VS Code in your browser",
      "Get 24/7 help from your Claude AI tutor",
      "Complete assignments and get instant AI feedback",
      "Join live sessions and collaborate on a shared whiteboard",
    ],
  },
  {
    icon: "🏫",
    title: "Lecturers",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
    accent: "text-emerald-400",
    points: [
      "Build structured courses with modules and lessons",
      "Create assignments with AI-assisted auto-marking",
      "Host live video sessions and manage your class",
      "Track student progress with detailed analytics",
    ],
  },
  {
    icon: "🏢",
    title: "Companies",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/20",
    accent: "text-violet-400",
    points: [
      "Manage corporate training programmes at scale",
      "Assign courses to teams and track completion",
      "Get certificates for upskilled employees",
      "Custom branded learning environment",
    ],
  },
];

const stats = [
  { value: "6+", label: "Learning modules" },
  { value: "5", label: "User roles" },
  { value: "AI", label: "Powered by Claude" },
  { value: "ZA", label: "Built for Africa" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#060d1a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-white/8 bg-[#060d1a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/Logo_small.png" alt="DAQS" width={34} height={34} className="rounded-lg" />
          <div>
            <span className="font-bold text-white text-sm tracking-tight">DAQS Learn</span>
            <span className="text-white/25 text-xs ml-2 hidden sm:inline">by N³ SmartSolutions</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            Sign in
          </Link>
          <Link href="/auth/register" className="text-sm bg-sky-500 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition-colors font-semibold shadow-lg shadow-sky-500/20">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_70%_60%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-400 text-xs font-semibold tracking-wider uppercase">Now in development — Phase 1 complete</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            Learn with AI.{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
              Build for Africa.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            DAQS Learn is an AI-powered cloud platform combining Jupyter notebooks, a browser IDE,
            live classrooms, Docker labs, and a Claude AI tutor — all in one place, built for South African learners.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-3.5 rounded-xl font-bold transition-all text-base shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5">
              Start learning free
            </Link>
            <Link href="/auth/login" className="border border-white/15 hover:border-white/30 hover:bg-white/5 text-white/80 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all text-base">
              Sign in to dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/8 bg-white/[0.02] py-6 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-white/40 text-xs mt-0.5 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Everything in one platform</h2>
          <p className="text-white/45 max-w-xl mx-auto">No more switching between tools. Notebooks, IDE, AI, assessments, and live classes — all connected.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-sky-500/25 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{f.icon}</span>
                <span className="text-[10px] text-white/25 border border-white/10 rounded-full px-2 py-0.5 font-mono">{f.badge}</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for everyone */}
      <section className="px-6 lg:px-12 pb-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Built for everyone in education</h2>
          <p className="text-white/45 max-w-xl mx-auto">Whether you learn, teach, or upskill teams — DAQS Learn has a role designed for you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r) => (
            <div key={r.title} className={`bg-gradient-to-br ${r.color} border rounded-2xl p-6`}>
              <div className="text-3xl mb-4">{r.icon}</div>
              <h3 className={`font-bold text-lg mb-4 ${r.accent}`}>{r.title}</h3>
              <ul className="space-y-2.5">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-white/65">
                    <span className={`mt-0.5 text-xs ${r.accent}`}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(14,165,233,0.1),transparent)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start learning?
          </h2>
          <p className="text-white/50 mb-8 text-lg">
            Create your free account today. Access the platform the moment it launches.
          </p>
          <Link href="/auth/register" className="inline-block bg-sky-500 hover:bg-sky-400 text-white px-10 py-4 rounded-xl font-bold text-base transition-all shadow-2xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5">
            Create free account
          </Link>
          <p className="text-white/25 text-sm mt-4">No credit card required · Free to join</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/Logo_small.png" alt="DAQS" width={24} height={24} className="rounded" />
            <span className="text-white/40 text-sm">DAQS Learn — N³ SmartSolutions</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <a href="https://daqstech.com" className="hover:text-white/60 transition-colors">daqstech.com</a>
            <Link href="/auth/login" className="hover:text-white/60 transition-colors">Sign in</Link>
            <Link href="/auth/register" className="hover:text-white/60 transition-colors">Register</Link>
          </div>
          <span className="text-white/20 text-xs">© 2025 DAQS</span>
        </div>
      </footer>
    </div>
  );
}
