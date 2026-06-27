"use client";
import Link from "next/link";

interface Props {
  user: { full_name: string; email: string; role: string };
}

export default function LecturerDashboard({ user }: Props) {
  const firstName = user.full_name.split(" ")[0];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome, {firstName} 👋</h1>
        <p className="text-white/40 mt-1 text-sm">Your teaching overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Active Courses", value: "0", icon: "📖" },
          { label: "Total Students", value: "0", icon: "👥" },
          { label: "Pending Submissions", value: "0", icon: "📋" },
          { label: "Live Sessions", value: "0", icon: "📡" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
            <span className="text-lg">{s.icon}</span>
            <div className="text-2xl font-bold text-white mt-3">{s.value}</div>
            <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4 mb-8 flex items-center gap-4">
        <span className="text-2xl shrink-0">🏗️</span>
        <div>
          <div className="font-semibold text-emerald-300 text-sm">Course builder coming in Phase 10</div>
          <div className="text-white/45 text-xs mt-0.5">
            Course creation, assignment tools, and student management are under active development.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Teaching Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📖", label: "Course Builder", desc: "Create and manage courses" },
              { icon: "📋", label: "Assignments", desc: "Set and mark work" },
              { icon: "📡", label: "Live Class", desc: "Host video sessions" },
              { icon: "📊", label: "Analytics", desc: "Student progress reports" },
              { icon: "🗂", label: "Q-Bank", desc: "Question bank" },
              { icon: "🏆", label: "Certificates", desc: "Issue certificates" },
            ].map((t) => (
              <div key={t.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 opacity-55">
                <span className="text-2xl">{t.icon}</span>
                <div className="font-semibold text-white text-sm mt-2">{t.label}</div>
                <div className="text-white/35 text-xs">{t.desc}</div>
                <span className="inline-block mt-2 text-[10px] text-white/20 border border-white/8 rounded-full px-2 py-0.5">Coming soon</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/dashboard/courses" className="flex items-center gap-3 bg-white/[0.03] border border-white/8 hover:border-emerald-500/25 hover:bg-white/[0.06] rounded-xl px-4 py-3 transition-all group">
              <span>📖</span>
              <span className="text-white/70 group-hover:text-white text-sm transition-colors">View my courses</span>
            </Link>
            {["Create new course", "Grade submissions", "Schedule live class"].map((a) => (
              <div key={a} className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 opacity-40 cursor-default">
                <span className="text-white/50 text-sm">{a}</span>
                <span className="ml-auto text-[10px] text-white/20 border border-white/10 rounded px-1">soon</span>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 mt-4">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Your Profile</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{user.full_name}</div>
                <div className="text-white/30 text-xs">{user.email}</div>
                <div className="text-emerald-400 text-[10px] mt-0.5 capitalize font-medium">{user.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
