"use client";
import { useAuthStore } from "@/store/auth";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import LecturerDashboard from "@/components/dashboard/LecturerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  if (user.role === "lecturer") return <LecturerDashboard user={user} />;
  if (user.role === "admin") return <AdminDashboard user={user} />;
  return <StudentDashboard user={user} />;
}
