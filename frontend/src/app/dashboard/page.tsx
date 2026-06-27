"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const modules = [
  { icon: "🧮", label: "Notebook", desc: "Jupyter cloud notebooks", href: "/notebook", available: false },
  { icon: "💻", label: "Studio", desc: "Browser VS Code IDE", href: "/studio", available: false },
  { icon: "🤖", label: "AI Tutor", desc: "Ask Claude anything", href: "/tutor", available: false },
  { icon: "🧪", label: "Labs", desc: "Docker sandbox environments", href: "/labs", available: false },
  { icon: "📋", label: "Assessments", desc: "Quizzes and assignments", href: "/assessments", available: false },
  { icon: "📡", label: "Classroom", desc: "Live video sessions", href: "/classroom", available: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  async function handleLogout() {
    await signOut(auth);
    clearAuth();
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#060d1a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#060d1a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/Logo_small.png" alt="DAQS" width={32} height={32} className="rounded-lg" />
          <span className="font-semibold text-white">DAQS Learn</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm text-white font-medium">{user.full_name}</div>
            <div className="text-xs text-white/40 capitalize">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/25"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.full_name.split(" ")[0]}
          </h1>
          <p className="text-white/50 mt-1 text-sm">
            Your learning dashboard — modules launch soon.
          </p>
        </div>

        {/* Coming soon banner */}
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl px-6 py-5 mb-8 flex items-start gap-4">
          <span className="text-2xl">🚀</span>
          <div>
            <div className="font-semibold text-sky-300">Platform launching soon</div>
            <div className="text-white/55 text-sm mt-1">
              Your account is ready. We&apos;re building the Notebook, Studio, AI Tutor and more.
              You&apos;ll be notified when each module goes live.
            </div>
          </div>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <div
              key={m.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 opacity-60"
            >
              <div className="text-3xl">{m.icon}</div>
              <div>
                <div className="font-semibold text-white text-sm">{m.label}</div>
                <div className="text-white/45 text-xs mt-0.5">{m.desc}</div>
              </div>
              <span className="text-xs text-white/30 border border-white/10 rounded-full px-3 py-1 self-start">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
