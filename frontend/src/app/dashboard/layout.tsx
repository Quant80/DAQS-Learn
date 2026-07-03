"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/auth/login");
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen bg-[#060d1a]">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#070f20] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Open navigation"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="4.5" width="16" height="2" rx="1" />
                <rect x="2" y="9" width="16" height="2" rx="1" />
                <rect x="2" y="13.5" width="16" height="2" rx="1" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <Image src="/Logo_small.png" alt="DAQS" width={26} height={26} className="rounded-lg" />
              <span className="text-white text-sm font-bold">DAQS Learn</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs capitalize">{user?.role}</span>
            <button
              onClick={clearAuth}
              className="text-white/40 hover:text-white/70 text-xs border border-white/10 rounded-lg px-2.5 py-1 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
