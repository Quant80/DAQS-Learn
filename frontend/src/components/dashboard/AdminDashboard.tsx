"use client";

interface Props {
  user: { full_name: string; email: string; role: string };
}

export default function AdminDashboard({ user }: Props) {
  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-white/40 mt-1 text-sm">Platform management — {user.email}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Users", value: "1", icon: "👥" },
          { label: "Active Courses", value: "0", icon: "📖" },
          { label: "Revenue (ZAR)", value: "R0", icon: "💰" },
          { label: "Platform Status", value: "Dev", icon: "🔧" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
            <span className="text-lg">{s.icon}</span>
            <div className="text-2xl font-bold text-white mt-3">{s.value}</div>
            <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl px-5 py-4">
        <div className="font-semibold text-violet-300 text-sm mb-1">🛠 Admin panel in development</div>
        <div className="text-white/45 text-xs">User management, payment tracking, and platform analytics will be available in Phase 13+.</div>
      </div>
    </div>
  );
}
