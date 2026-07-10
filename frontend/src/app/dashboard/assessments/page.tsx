"use client";
import Link from "next/link";
import { CourseIcon } from "@/components/CourseIcon";
import { assessmentTemplates, difficultyColors, getRecommendations } from "@/data/assessmentTemplates";
import { useSessionStore } from "@/store/assessmentSession";
import { useLearningProfile } from "@/store/learningProfile";

const subjects = ["Python", "Web Development", "Data Science", "Algorithms", "SQL", "Mathematics"];

export default function AssessmentsPage() {
  const sessions = useSessionStore((s) => s.sessions);
  const subjectStats = useLearningProfile((s) => s.subjectStats);

  const weakSubjects = Object.entries(subjectStats)
    .filter(([, v]) => v.scores.length > 0 && v.scores.reduce((a, b) => a + b, 0) / v.scores.length < 60)
    .map(([subject]) => subject);

  const completed = Object.values(sessions).filter((s) => s.completedAt);
  const mostRecent = completed.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))[0];
  const recommended = mostRecent
    ? getRecommendations(mostRecent.templateId, mostRecent.percentage, weakSubjects)
    : [];
  const recommendedIds = new Set(recommended.map((r) => r.id));
  const totalCompleted = completed.length;

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Assessments</h1>
          <p className="text-white/45 text-sm mt-1">
            {assessmentTemplates.length} assessments · Questions randomised every attempt · {totalCompleted} completed
          </p>
        </div>
        <Link href="/dashboard/progress" className="text-xs text-sky-400 hover:text-sky-300 border border-sky-500/25 rounded-xl px-4 py-2 transition-colors">
          View Progress →
        </Link>
      </div>

      {/* Smart Recommendations */}
      {recommended.length > 0 && (
        <div className="bg-gradient-to-br from-sky-500/10 to-violet-500/5 border border-sky-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎯</span>
            <h2 className="text-sm font-bold text-white">Recommended for You</h2>
            <span className="text-xs text-sky-400/70 ml-1">Based on your recent performance</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommended.map((t) => {
              const session = sessions[t.id];
              const done = !!session?.completedAt;
              const c = difficultyColors[t.difficulty];
              return (
                <Link key={t.id} href={`/dashboard/assessments/${t.id}`}>
                  <div className={`bg-white/[0.04] border ${c.border} hover:bg-white/[0.08] rounded-xl p-4 transition-all cursor-pointer h-full`}>
                    <div className="flex items-center justify-between mb-2">
                      <CourseIcon icon={t.icon} size={20} />
                      {done && <span className="text-emerald-400 text-xs font-bold">{session.percentage}% ✓</span>}
                    </div>
                    <div className="text-white text-sm font-semibold leading-tight">{t.title}</div>
                    <div className={`text-xs font-bold mt-1.5 ${c.text} capitalize`}>{t.difficulty}</div>
                    <div className="text-white/40 text-xs mt-1">{t.questionCount}q · {t.timeLimit}m</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Assessments", value: assessmentTemplates.length, icon: "📋" },
          { label: "Completed", value: totalCompleted, icon: "✅" },
          { label: "Subjects", value: subjects.length, icon: "📚" },
          { label: "Questions in Bank", value: "150+", icon: "🔀" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
            <div className="text-lg mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* All Assessments by Subject */}
      {subjects.map((subject) => {
        const subjectTemplates = assessmentTemplates.filter((t) => t.subject === subject);
        if (!subjectTemplates.length) return null;
        return (
          <section key={subject}>
            <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CourseIcon icon={subjectTemplates[0].icon} size={16} /> {subject}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectTemplates.map((t) => {
                const session = sessions[t.id];
                const done = !!session?.completedAt;
                const c = difficultyColors[t.difficulty];
                const isRec = recommendedIds.has(t.id);
                return (
                  <Link key={t.id} href={`/dashboard/assessments/${t.id}`}>
                    <div className={`relative bg-white/[0.03] border hover:border-white/20 hover:bg-white/[0.06] rounded-2xl p-5 transition-all cursor-pointer h-full group ${
                      isRec ? "border-sky-500/30" : "border-white/8"
                    }`}>
                      {isRec && (
                        <div className="absolute -top-2.5 left-4">
                          <span className="text-[10px] font-bold bg-sky-500 text-white px-2.5 py-0.5 rounded-full">Recommended</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                          <CourseIcon icon={t.icon} size={24} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs font-bold capitalize border rounded-full px-2.5 py-0.5 ${c.bg} ${c.border} ${c.text}`}>
                            {t.difficulty}
                          </span>
                          {done && (
                            <span className="text-emerald-400 text-xs font-bold">{session.percentage}% ✓</span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-white font-bold text-base mb-1.5 group-hover:text-sky-300 transition-colors">{t.title}</h3>
                      <p className="text-white/45 text-xs leading-relaxed mb-3">{t.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {t.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] text-white/30 bg-white/5 border border-white/8 rounded px-2 py-0.5">{tag}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 text-white/40">
                          <span>📋 {t.questionCount} questions</span>
                          <span>⏱ {t.timeLimit}m</span>
                        </div>
                        <span className="text-sky-400 font-semibold group-hover:text-sky-300 transition-colors">
                          {done ? "Retake →" : "Start →"}
                        </span>
                      </div>

                      {done && (
                        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${session.percentage >= 80 ? "bg-emerald-500" : session.percentage >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${session.percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
