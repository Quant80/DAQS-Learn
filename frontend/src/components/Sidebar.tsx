"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

const studentNav = [
  { icon: "⊞", label: "Dashboard", href: "/dashboard" },
  { icon: "📚", label: "My Courses", href: "/dashboard/courses" },
  { icon: "🧮", label: "Notebook", href: "/dashboard/notebook", soon: true },
  { icon: "💻", label: "Studio", href: "/dashboard/studio", soon: true },
  { icon: "🤖", label: "AI Tutor", href: "/dashboard/tutor", soon: true },
  { icon: "🧪", label: "Labs", href: "/dashboard/labs", soon: true },
  { icon: "📋", label: "Assessments", href: "/dashboard/assessments", soon: true },
  { icon: "📡", label: "Classroom", href: "/dashboard/classroom", soon: true },
];

const lecturerNav = [
  { icon: "⊞", label: "Dashboard", href: "/dashboard" },
  { icon: "📖", label: "My Courses", href: "/dashboard/courses" },
  { icon: "👥", label: "Students", href: "/dashboard/students", soon: true },
  { icon: "📋", label: "Assignments", href: "/dashboard/assignments", soon: true },
  { icon: "📡", label: "Live Class", href: "/dashboard/classroom", soon: true },
  { icon: "📊", label: "Analytics", href: "/dashboard/analytics", soon: true },
];

const adminNav = [
  { icon: "⊞", label: "Overview", href: "/dashboard" },
  { icon: "👥", label: "Users", href: "/dashboard/users", soon: true },
  { icon: "📖", label: "Courses", href: "/dashboard/courses" },
  { icon: "💰", label: "Payments", href: "/dashboard/payments", soon: true },
  { icon: "📊", label: "Analytics", href: "/dashboard/analytics", soon: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const nav =
    user?.role === "lecturer" ? lecturerNav :
    user?.role === "admin" ? adminNav :
    studentNav;

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-[#070f20] border-r border-white/8 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8">
        <Image src="/Logo_small.png" alt="DAQS" width={30} height={30} className="rounded-lg" />
        <div>
          <div className="text-white text-sm font-bold leading-tight">DAQS Learn</div>
          <div className="text-white/50 text-[10px] capitalize">{user?.role ?? "student"}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                active
                  ? "bg-sky-500/15 text-sky-300 font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              } ${item.soon ? "cursor-default opacity-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </div>
              {item.soon && (
                <span className="text-[9px] text-white/20 border border-white/10 rounded px-1 py-0.5 leading-none">
                  soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Signout */}
      <div className="px-3 py-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] mb-2">
          <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 text-xs font-bold shrink-0">
            {user?.full_name?.charAt(0) ?? "U"}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">{user?.full_name}</div>
            <div className="text-white/50 text-[10px] truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={clearAuth}
          className="w-full text-left text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
