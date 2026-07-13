"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

type NavItem = { icon: string; label: string; href: string; soon?: boolean };

const studentNav: NavItem[] = [
  { icon: "⊞", label: "Dashboard", href: "/dashboard" },
  { icon: "📈", label: "My Progress", href: "/dashboard/progress" },
  { icon: "📚", label: "My Courses", href: "/dashboard/courses" },
  { icon: "🧮", label: "Notebook", href: "/dashboard/notebook" },
  { icon: "💻", label: "Studio", href: "/dashboard/studio" },
  { icon: "🤖", label: "AI Tutor", href: "/dashboard/tutor" },
  { icon: "📐", label: "Graphing Calculators", href: "/dashboard/graphing" },
  { icon: "📝", label: "My Notes", href: "/dashboard/notes" },
  { icon: "🧪", label: "Labs", href: "/dashboard/labs" },
  { icon: "📋", label: "Assessments", href: "/dashboard/assessments" },
  { icon: "📡", label: "Classroom", href: "/dashboard/classroom" },
  { icon: "🏆", label: "Certificates", href: "/dashboard/certificates" },
  { icon: "💳", label: "Billing", href: "/dashboard/billing" },
  { icon: "🤝", label: "For Schools", href: "/consulting" },
];

const lecturerNav: NavItem[] = [
  { icon: "⊞", label: "Dashboard", href: "/dashboard" },
  { icon: "📖", label: "My Courses", href: "/dashboard/courses" },
  { icon: "👥", label: "Students", href: "/dashboard/students", soon: true },
  { icon: "📋", label: "Assignments", href: "/dashboard/assignments", soon: true },
  { icon: "📡", label: "Live Class", href: "/dashboard/classroom" },
  { icon: "📊", label: "Analytics", href: "/dashboard/analytics", soon: true },
];

const adminNav: NavItem[] = [
  { icon: "⊞", label: "Overview", href: "/dashboard" },
  { icon: "👥", label: "Users", href: "/dashboard/users", soon: true },
  { icon: "📖", label: "Courses", href: "/dashboard/courses" },
  { icon: "💰", label: "Payments", href: "/dashboard/payments", soon: true },
  { icon: "🤝", label: "Consulting", href: "/dashboard/admin/consulting" },
  { icon: "📊", label: "Analytics", href: "/dashboard/analytics", soon: true },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavLinks({ nav, pathname, onClose }: {
  nav: NavItem[];
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.soon ? "#" : item.href}
            onClick={item.soon ? undefined : onClose}
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
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const nav =
    user?.role === "lecturer" ? lecturerNav :
    user?.role === "admin"    ? adminNav :
    studentNav;

  function handleSignOut() {
    onClose?.();
    clearAuth();
  }

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <Image src="/Logo_small.png" alt="DAQS" width={30} height={30} className="rounded-lg" />
          <div>
            <div className="text-white text-sm font-bold leading-tight">DAQS Learn</div>
            <div className="text-white/50 text-[10px] capitalize">{user?.role ?? "student"}</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.293 3.293a1 1 0 011.414 0L8 6.586l3.293-3.293a1 1 0 111.414 1.414L9.414 8l3.293 3.293a1 1 0 01-1.414 1.414L8 9.414l-3.293 3.293a1 1 0 01-1.414-1.414L6.586 8 3.293 4.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <NavLinks nav={nav} pathname={pathname} onClose={onClose} />

      {/* User card + sign out */}
      <div className="px-3 py-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] mb-2">
          <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 text-xs font-bold shrink-0">
            {user?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">{user?.full_name}</div>
            <div className="text-white/50 text-[10px] truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          Sign out
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-[#070f20] border-r border-white/8 h-full overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer panel */}
          <aside className="relative flex flex-col w-72 max-w-[85vw] bg-[#070f20] border-r border-white/10 h-full overflow-hidden shadow-2xl">
            <SidebarContent onClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
