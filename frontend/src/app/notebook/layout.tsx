"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function NotebookFullscreenLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/auth/login");
  }, [isAuthenticated, router]);
  return <>{children}</>;
}
