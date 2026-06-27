import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: "🧮",
    title: "DAQS Notebook",
    desc: "Cloud Jupyter notebooks — run Python, R, and data science tools directly in your browser.",
  },
  {
    icon: "💻",
    title: "DAQS Studio",
    desc: "A full VS Code IDE in the browser. Write, debug, and deploy real projects.",
  },
  {
    icon: "🤖",
    title: "AI Tutor",
    desc: "Claude-powered AI tutor that explains concepts, reviews your code, and answers questions.",
  },
  {
    icon: "🧪",
    title: "Docker Labs",
    desc: "Isolated containerised lab environments. Experiment safely without breaking anything.",
  },
  {
    icon: "📋",
    title: "Smart Assessments",
    desc: "AI-marked assignments, quizzes, and coding challenges with instant feedback.",
  },
  {
    icon: "📡",
    title: "Live Classroom",
    desc: "Real-time video classes, interactive whiteboard, and screen sharing with your lecturer.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#060d1a]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#060d1a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/Logo_small.png" alt="DAQS" width={32} height={32} className="rounded-lg" />
          <span className="font-semibold text-white">DAQS Learn</span>
          <span className="text-white/30 text-xs ml-1">by N³ SmartSolutions</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.12)_0%,_transparent_60%)] pointer-events-none" />
        <div className="relative">
          <span className="text-sky-400 text-sm font-medium tracking-widest uppercase mb-4 inline-block">
            Built for Africa
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
            Learn with AI.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Build for the future.
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            DAQS Learn is an AI-powered cloud platform combining Jupyter notebooks, a browser IDE, live
            classrooms, and an intelligent AI tutor — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <Link
              href="/auth/register"
              className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors text-base"
            >
              Start learning free
            </Link>
            <Link
              href="/auth/login"
              className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors text-base"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <h2 className="text-center text-2xl font-bold text-white mb-12">
          Everything you need to learn and build
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-sky-500/30 transition-all group"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 flex items-center justify-between text-white/40 text-sm">
        <span>© 2025 DAQS — N³ SmartSolutions</span>
        <a href="https://daqstech.com" className="hover:text-white/70 transition-colors">
          daqstech.com
        </a>
      </footer>
    </div>
  );
}
