"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

const ADMIN_EMAIL_DOMAIN = "@daqstech.com";

/**
 * Client-side gate for UX only — redirects non-admins away so they don't
 * land on a page full of 403s. The real security boundary is server-side,
 * in the backend's get_current_admin dependency (checked on every request).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const isAdmin = user?.role === "admin" && user.email.toLowerCase().endsWith(ADMIN_EMAIL_DOMAIN);

  useEffect(() => {
    if (user && !isAdmin) router.replace("/dashboard");
  }, [user, isAdmin, router]);

  if (!isAdmin) return null;
  return <>{children}</>;
}
