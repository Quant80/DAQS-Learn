"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCourseProgress } from "@/store/courseProgress";
import { useSessionStore } from "@/store/assessmentSession";
import { useTutorNotes } from "@/store/tutorNotes";
import { courses } from "@/data/courses";

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

interface Props {
  user: { full_name: string; email: string; role: string };
}

export default function StudentDashboard({ user }: Props) {
  const firstName = user.full_name.split(" ")[0];
  const { progress } = useCourseProgress();
  const sessions = useSessionStore((s) => s.sessions);
  const { notes: tutorNotes } = useTutorNotes();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const enrolledCount = mounted ? Object.keys(progress).length : 0;

  const minutesLearned = mounted ? (() => {
    let total = 0;
    for (const [courseId, cp] of Object.entries(progress)) {
      const course = courses.find((c) => c.id === courseId);
      if (!course) continue;
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          if (cp.completedLessons.includes(lesson.id)) {
            total += lesson.duration;
          }
        }
      }
    }
    return total;
  })() : 0;

  const hoursDisplay = minutesLearned === 0
    ? "0h"
    : minutesLearned < 60
      ? `${minutesLearned}m`
      : `${(minutesLearned / 60).toFixed(1)}h`;

  const assessmentsDone = mounted
    ? Object.values(sessions).filter((s) => s.completedAt).length
    : 0;

  const aiSessionCount = mounted ? tutorNotes.length : 0;

  const recentActivity: { text: string; time: string; icon: string }[] = [];
  if (mounted) {
    const completedSessions = Object.values(sessions)
      .filter((s) => s.completedAt)
      .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))
      .slice(0, 2);
    for (const s of completedSessions) {
      recentActivity.push({
        text: `Assessment completed — ${s.percentage}%`,
        time: new Date(s.completedAt!).toLocaleDateString(),
        icon: s.percentage >= 80 ? "🏆" : s.percentage >= 50 ? "✅" : "📋",
      });
    }
    const enrolledCourses = Object.values(progress)
      .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
      .slice(0, 2 - recentActivity.length);
    for (const cp of enrolledCourses) {
      const course = courses.find((c) => c.id === cp.courseId);
      if (course) {
        recentActivity.push({
          text: `Enrolled in ${course.title}`,
          time: new Date(cp.enrolledAt).toLocaleDateString(),
          icon: "📚",
        });
      }
    }
  }
  if (recentActivity.length === 0) {
    recentActivity.push(
      { text: "Account created successfully", time: "Just now", icon: "✅" },
      { text: "Welcome to DAQS Learn!", time: "Just now", icon: "🎉" }
    );
  }

  const stats = [
    { label: "Courses Enrolled",  value: enrolledCount.toString(),    icon: "📚", note: enrolledCount > 0 ? "Keep going!" : "Start exploring" },
    { label: "Hours Learned",     value: hoursDisplay,                icon: "🕐", note: minutesLearned > 0 ? "Great progress" : "Keep going" },
    { label: "Assessments Done",  value: assessmentsDone.toString(),  icon: "📋", note: assessmentsDone > 0 ? "Well done!" : "All clear" },
    { label: "AI Sessions",       value: aiSessionCount.toString(),   icon: "🤖", note: aiSessionCount > 0 ? "Keep learning!" : "Ask Claude" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-white/40 mt-1 text-sm">Here&apos;s your learning overview</p>
      </div>

      {/* Stats column */}
      <div className="flex flex-col gap-2 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl w-7 shrink-0">{s.icon}</span>
            <span className="text-xl font-bold text-white w-12 shrink-0">{s.value}</span>
            <span className="text-sm text-white/60 flex-1">{s.label}</span>
            <span className="text-[11px] text-white/35 shrink-0">{s.note}</span>
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
                className={`bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex flex-col gap-1.5 transition-all ${colorRing[m.color]}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl shrink-0">{m.icon}</span>
                  <div className="font-semibold text-white text-sm">{m.label}</div>
                </div>
                <div className="text-white/60 text-xs pl-0.5">{m.desc}</div>
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
              {recentActivity.map((a, i) => (
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
