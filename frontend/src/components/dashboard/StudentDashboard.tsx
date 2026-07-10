"use client";
import Link from "next/link";

const modules = [
  { icon: "🧮", label: "Notebook", desc: "Jupyter cloud notebooks", href: "/dashboard/notebook", color: "sky" },
  { icon: "💻", label: "Studio", desc: "Browser VS Code IDE", href: "/dashboard/studio", color: "indigo" },
  { icon: "🤖", label: "AI Tutor", desc: "Ask Claude anything", href: "/dashboard/tutor", color: "violet" },
  { icon: "🧪", label: "Labs", desc: "Docker sandbox", href: "/dashboard/labs", color: "emerald" },
  { icon: "📋", label: "Assessments", desc: "Quizzes & assignments", href: "/dashboard/assessments", color: "amber" },
  { icon: "📡", label: "Classroom", desc: "Live video sessions", href: "/dashboard/classroom", color: "rose" },
];

const colorRing: Record<string, string> = {
  sky:     "hover:border-sky-500/40 hover:bg-sky-500/5",
  indigo:  "hover:border-indigo-500/40 hover:bg-indigo-500/5",
  violet:  "hover:border-violet-500/40 hover:bg-violet-500/5",
  emerald: "hover:border-emerald-500/40 hover:bg-emerald-500/5",
  amber:   "hover:border-amber-500/40 hover:bg-amber-500/5",
  rose:    "hover:border-rose-500/40 hover:bg-rose-500/5",
};

const activityItems = [
  { text: "Account created successfully", time: "Just now", icon: "✅" },
  { text: "Welcome to DAQS Learn!", time: "Just now", icon: "🎉" },
];

interface Props {
  user: { full_name: string; email: string; role: string };
}

export default function StudentDashboard({ user }: Props) {
  const firstName = user.full_name.split(" ")[0];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-white/40 mt-1 text-sm">Here's your learning overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Courses Enrolled", value: "0", icon: "📚", note: "Start exploring" },
          { label: "Hours Learned", value: "0h", icon: "⏱", note: "Keep going" },
          { label: "Assignments Due", value: "0", icon: "📋", note: "All clear" },
          { label: "AI Sessions", value: "0", icon: "🤖", note: "Ask Claude" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg">{s.icon}</span>
              <span className="text-[10px] text-white/45">{s.note}</span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Learning Modules</h2>
          <div className="grid grid-cols-2 gap-3">
            {modules.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                className={`bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex flex-col gap-2 transition-all ${colorRing[m.color]}`}
              >
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{m.label}</div>
                  <div className="text-white/60 text-xs">{m.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent activity */}
          <div>
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Recent Activity</h2>
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl divide-y divide-white/5">
              {activityItems.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-base">{a.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-white/85 text-xs">{a.text}</div>
                    <div className="text-white/45 text-[10px] mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/dashboard/courses" className="flex items-center gap-3 bg-white/[0.03] border border-white/8 hover:border-sky-500/25 hover:bg-white/[0.06] rounded-xl px-4 py-3 transition-all group">
                <span className="text-base">📚</span>
                <span className="text-white/70 group-hover:text-white text-sm transition-colors">Browse courses</span>
              </Link>
              <Link href="/dashboard/tutor" className="flex items-center gap-3 bg-white/[0.03] border border-white/8 hover:border-violet-500/25 hover:bg-white/[0.06] rounded-xl px-4 py-3 transition-all group">
                <span className="text-base">🤖</span>
                <span className="text-white/70 group-hover:text-white text-sm transition-colors">Ask AI Tutor</span>
              </Link>
              <Link href="/dashboard/notebook" className="flex items-center gap-3 bg-white/[0.03] border border-white/8 hover:border-sky-500/25 hover:bg-white/[0.06] rounded-xl px-4 py-3 transition-all group">
                <span className="text-base">🧮</span>
                <span className="text-white/70 group-hover:text-white text-sm transition-colors">Open Notebook</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
