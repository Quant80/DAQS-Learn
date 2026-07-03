"use client";
import Link from "next/link";
import { useCertificates } from "@/store/certificates";
import { useCourseProgress } from "@/store/courseProgress";
import { courses, getTotalLessons } from "@/data/courses";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";

const trackColors: Record<string, string> = {
  python:           "from-sky-500/20 to-sky-600/10 border-sky-500/30",
  "data-science":   "from-violet-500/20 to-violet-600/10 border-violet-500/30",
  "machine-learning": "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  "deep-learning":  "from-rose-500/20 to-rose-600/10 border-rose-500/30",
  "ai-llm":         "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  "agentic-ai":     "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  "web-dev":        "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
  "data-engineering": "from-lime-500/20 to-lime-600/10 border-lime-500/30",
  mathematics:      "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
  career:           "from-pink-500/20 to-pink-600/10 border-pink-500/30",
};

export default function CertificatesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = useAuthStore((s) => s.user);
  const { certificates, issue, hasCertificate } = useCertificates();
  const { getProgressPercent, isEnrolled } = useCourseProgress();

  // Auto-issue certificates for fully completed courses
  useEffect(() => {
    if (!user) return;
    for (const course of courses) {
      if (!isEnrolled(course.id)) continue;
      if (hasCertificate(course.id)) continue;
      const total = getTotalLessons(course);
      const pct = getProgressPercent(course.id, total);
      if (pct === 100) {
        issue({
          courseId: course.id,
          courseName: course.title,
          courseTrack: course.track,
          courseIcon: course.icon,
          difficulty: course.difficulty,
          studentName: user.full_name ?? user.email ?? "Learner",
          studentEmail: user.email ?? "",
        });
      }
    }
  }, [user, issue, hasCertificate, isEnrolled, getProgressPercent]);

  // Courses in progress but not yet completed (to show progress toward next cert)
  const inProgress = courses
    .filter((c) => {
      if (!isEnrolled(c.id)) return false;
      if (hasCertificate(c.id)) return false;
      const pct = getProgressPercent(c.id, getTotalLessons(c));
      return pct > 0 && pct < 100;
    })
    .map((c) => ({
      ...c,
      pct: getProgressPercent(c.id, getTotalLessons(c)),
    }));

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Certificates</h1>
        <p className="text-white/45 text-sm mt-1">
          Complete all lessons in a course to earn your certificate
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Earned",      value: mounted ? certificates.length : null, icon: "🏆" },
          { label: "In Progress", value: mounted ? inProgress.length : null,   icon: "📚" },
          { label: "Available",   value: courses.length,                        icon: "🎯" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">
              {s.value ?? <span className="inline-block w-4 h-4 rounded bg-white/10 animate-pulse align-middle" />}
            </div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Earned certificates */}
      {!mounted ? null : certificates.length > 0 ? (
        <section>
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Earned Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => {
              const grad = trackColors[cert.courseTrack] ?? "from-sky-500/20 to-sky-600/10 border-sky-500/30";
              const date = new Date(cert.issuedAt).toLocaleDateString("en-ZA", {
                day: "numeric", month: "long", year: "numeric",
              });
              return (
                <Link key={cert.id} href={`/dashboard/certificates/${cert.id}`}>
                  <div className={`relative bg-gradient-to-br ${grad} border rounded-2xl p-6 hover:scale-[1.01] transition-all cursor-pointer group overflow-hidden`}>
                    {/* Decorative circle */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{cert.courseIcon}</div>
                        <div className="text-right">
                          <div className="text-[10px] text-white/30 font-mono">{cert.id}</div>
                          <div className="text-[10px] text-amber-400/80 font-bold mt-0.5">✓ VERIFIED</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Certificate of Completion</div>
                      <div className="text-white font-bold text-lg leading-tight mb-1">{cert.courseName}</div>
                      <div className="text-white/50 text-xs mb-4 capitalize">{cert.courseTrack.replace(/-/g, " ")} · {cert.difficulty}</div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/80 text-sm font-semibold">{cert.studentName}</div>
                          <div className="text-white/35 text-xs">Issued {date}</div>
                        </div>
                        <div className="text-white/40 group-hover:text-white/70 text-sm transition-colors">
                          View →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-white font-bold text-lg mb-2">No certificates yet</h3>
          <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
            Complete all lessons in any course to earn your first certificate. Start with Python Fundamentals — it's a great place to begin.
          </p>
          <Link href="/dashboard/courses"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            Browse Courses →
          </Link>
        </div>
      )}

      {/* In progress */}
      {mounted && inProgress.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">In Progress</h2>
          <div className="space-y-3">
            {inProgress.map((c) => (
              <Link key={c.id} href={`/dashboard/courses/${c.id}`}>
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/8 hover:border-white/15 rounded-xl p-4 transition-all group">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold group-hover:text-sky-300 transition-colors">{c.title}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="text-xs text-white/40 shrink-0">{c.pct}%</span>
                    </div>
                  </div>
                  <div className="text-white/30 text-xs shrink-0">
                    {100 - c.pct}% to certificate
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
