"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useLearningProfile } from "@/store/learningProfile";
import RadarChart from "@/components/progress/RadarChart";
import Link from "next/link";

interface AIReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: { title: string; detail: string; priority: "high" | "medium" | "low" }[];
  nextSteps: string;
  predictedTrajectory: "improving" | "stable" | "needs_attention";
}

const priorityStyle = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const trajectoryConfig = {
  improving: { icon: "📈", label: "Improving", color: "text-emerald-400" },
  stable: { icon: "➡️", label: "Stable", color: "text-sky-400" },
  needs_attention: { icon: "⚠️", label: "Needs Attention", color: "text-amber-400" },
};

export default function ProgressPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useLearningProfile();
  const [report, setReport] = useState<AIReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [goalInput, setGoalInput] = useState(profile.goalMinutesPerDay);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const subjectRadarData = Object.entries(profile.subjectStats).map(([subject, stats]) => ({
    subject,
    score: stats.scores.length
      ? Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length)
      : 0,
  }));

  const totalAssessments = Object.values(profile.subjectStats).reduce((s, v) => s + v.attempts, 0);
  const avgScore = profile.getAverageScore();
  const todayActivity = profile.getTodayActivity();
  const todayMinutes = todayActivity?.minutesActive ?? 0;
  const goalProgress = Math.min((todayMinutes / profile.goalMinutesPerDay) * 100, 100);

  const topTutorSubject = Object.entries(profile.tutorTopics)
    .sort(([, a], [, b]) => b.count - a.count)[0];

  const strengths = subjectRadarData.filter((s) => s.score >= 75).sort((a, b) => b.score - a.score).slice(0, 3);
  const weaknesses = subjectRadarData.filter((s) => s.score < 60 && s.score > 0).sort((a, b) => a.score - b.score).slice(0, 3);

  const recentActivity = [...profile.dailyActivity]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)
    .reverse();

  async function generateReport() {
    setLoadingReport(true);
    try {
      const res = await fetch("/api/insights/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: user?.full_name ?? "Student",
          subjectStats: profile.subjectStats,
          tutorTopics: profile.tutorTopics,
          totalAssessments,
          averageScore: avgScore,
          streak: profile.streak,
          totalTutorMessages: profile.totalTutorMessages,
          achievements: profile.achievements.length,
        }),
      });
      const data = await res.json();
      setReport(data);
    } catch {
      // fallback handled in API route
    } finally {
      setLoadingReport(false);
    }
  }

  useEffect(() => {
    if (totalAssessments > 0 || profile.totalTutorMessages > 0) {
      generateReport();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show new badge notification
  useEffect(() => {
    const latest = profile.achievements[profile.achievements.length - 1];
    if (latest) {
      setNewBadge(`${latest.icon} ${latest.title} unlocked!`);
      const t = setTimeout(() => setNewBadge(null), 4000);
      return () => clearTimeout(t);
    }
  }, [profile.achievements.length]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Badge notification */}
      {newBadge && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl animate-pulse">
          {newBadge}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Learning Intelligence</h1>
          <p className="text-white/45 text-sm mt-1">Your personalised progress dashboard</p>
        </div>
        <button
          onClick={generateReport}
          disabled={loadingReport}
          className="flex items-center gap-2 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
        >
          {loadingReport ? (
            <><span className="animate-spin">⟳</span> Generating…</>
          ) : (
            <><span>🤖</span> Generate AI Report</>
          )}
        </button>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Assessments", value: totalAssessments, icon: "📋", sub: "completed" },
          { label: "Avg Score", value: `${avgScore}%`, icon: "🎯", sub: "across all subjects" },
          { label: "Streak", value: `${profile.streak}d`, icon: "🔥", sub: "consecutive days" },
          { label: "AI Sessions", value: profile.totalTutorMessages, icon: "🤖", sub: "messages sent" },
          { label: "Badges", value: profile.achievements.length, icon: "🏆", sub: `of ${9} earned` },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{s.icon}</span>
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-white/25 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Radar */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Subject Skill Map</h2>
          <div className="flex justify-center">
            <RadarChart data={subjectRadarData} size={220} />
          </div>
          {subjectRadarData.length === 0 && (
            <Link href="/dashboard/assessments" className="block text-center text-xs text-sky-400 mt-3 hover:text-sky-300 transition-colors">
              Take an assessment to see your skill map →
            </Link>
          )}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">💪 Strengths</h2>
            {strengths.length ? (
              <div className="space-y-2">
                {strengths.map((s) => (
                  <div key={s.subject} className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">{s.subject}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.score}%` }} />
                      </div>
                      <span className="text-emerald-400 text-xs font-bold w-9 text-right">{s.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-xs">Score 75%+ on assessments to see your strengths</p>
            )}
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">🎯 Areas to Improve</h2>
            {weaknesses.length ? (
              <div className="space-y-2">
                {weaknesses.map((s) => (
                  <div key={s.subject} className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">{s.subject}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${s.score}%` }} />
                      </div>
                      <span className="text-red-400 text-xs font-bold w-9 text-right">{s.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-xs">Score below 60% on a subject to see what needs work</p>
            )}
          </div>
        </div>

        {/* Daily Goal + Tutor Topics */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">⏱ Daily Goal</h2>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/55 text-xs">{todayMinutes} / {profile.goalMinutesPerDay} min today</span>
                <span className="text-xs font-bold text-sky-400">{Math.round(goalProgress)}%</span>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(Number(e.target.value))}
                min={5} max={240}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500/40"
              />
              <button
                onClick={() => profile.setDailyGoal(goalInput)}
                className="px-3 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-xs rounded-xl transition-all font-semibold"
              >
                Set
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">🤖 Top Tutor Topics</h2>
            {Object.keys(profile.tutorTopics).length ? (
              <div className="space-y-2">
                {Object.entries(profile.tutorTopics)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .slice(0, 5)
                  .map(([subject, data]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-white/65 text-xs">{subject}</span>
                      <span className="text-white/35 text-xs">{data.count} questions</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-white/30 text-xs">Your AI Tutor topics will appear here</p>
            )}
          </div>
        </div>
      </div>

      {/* 7-day Activity */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">📅 7-Day Activity</h2>
        {recentActivity.length ? (
          <div className="flex items-end gap-2 h-24">
            {recentActivity.map((d) => {
              const h = Math.max((d.assessmentsCompleted * 20 + d.tutorMessages * 5), d.minutesActive > 0 ? 15 : 0);
              const cappedH = Math.min(h, 80);
              const label = new Date(d.date).toLocaleDateString("en-ZA", { weekday: "short" });
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-white/5 rounded-lg relative overflow-hidden" style={{ height: 80 }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-sky-500/60 rounded-lg transition-all"
                      style={{ height: `${cappedH}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/30">{label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-white/30 text-sm">No activity recorded yet — complete assessments or use the AI Tutor to see your activity</p>
        )}
      </div>

      {/* AI Report */}
      {report && (
        <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🤖</span> AI Learning Report
            </h2>
            <div className={`flex items-center gap-1.5 text-xs font-bold ${trajectoryConfig[report.predictedTrajectory].color}`}>
              <span>{trajectoryConfig[report.predictedTrajectory].icon}</span>
              {trajectoryConfig[report.predictedTrajectory].label}
            </div>
          </div>

          <p className="text-white/70 text-sm leading-relaxed">{report.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Strengths</h3>
              <ul className="space-y-1.5">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Focus Areas</h3>
              <ul className="space-y-1.5">
                {report.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                    <span className="text-amber-400 mt-0.5 shrink-0">→</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3">Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.recommendations.map((r, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/8 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-sm font-semibold">{r.title}</span>
                    <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${priorityStyle[r.priority]}`}>
                      {r.priority}
                    </span>
                  </div>
                  <p className="text-white/55 text-xs leading-relaxed">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-lg shrink-0">🚀</span>
            <p className="text-white/70 text-sm">{report.nextSteps}</p>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">🏆 Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: "first_assessment", title: "First Step", icon: "🎯" },
            { id: "five_assessments", title: "Bookworm", icon: "📚" },
            { id: "perfect_score", title: "Perfect Score", icon: "⭐" },
            { id: "high_achiever", title: "High Achiever", icon: "🏆" },
            { id: "ai_explorer", title: "AI Explorer", icon: "🤖" },
            { id: "streak_3", title: "On Fire", icon: "🔥" },
            { id: "streak_7", title: "Week Warrior", icon: "⚡" },
            { id: "all_rounder", title: "All-Rounder", icon: "🌟" },
            { id: "tutor_power", title: "Tutor Power", icon: "💡" },
          ].map((badge) => {
            const earned = profile.achievements.find((a) => a.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 text-center border transition-all ${
                  earned
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-white/[0.02] border-white/6 opacity-40"
                }`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="text-xs font-semibold text-white/80">{badge.title}</div>
                {earned && (
                  <div className="text-[9px] text-amber-400/70 mt-1">
                    {new Date(earned.earnedAt).toLocaleDateString("en-ZA")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/dashboard/assessments" className="bg-white/[0.03] border border-white/8 hover:border-sky-500/25 hover:bg-white/[0.06] rounded-2xl p-4 flex items-center gap-3 transition-all group">
          <span className="text-xl">📋</span>
          <div>
            <div className="text-white text-sm font-semibold group-hover:text-sky-300 transition-colors">Take an Assessment</div>
            <div className="text-white/40 text-xs">Improve your skill map</div>
          </div>
        </Link>
        <Link href="/dashboard/tutor" className="bg-white/[0.03] border border-white/8 hover:border-violet-500/25 hover:bg-white/[0.06] rounded-2xl p-4 flex items-center gap-3 transition-all group">
          <span className="text-xl">🤖</span>
          <div>
            <div className="text-white text-sm font-semibold group-hover:text-violet-300 transition-colors">Ask AI Tutor</div>
            <div className="text-white/40 text-xs">Get help on weak areas</div>
          </div>
        </Link>
        <Link href="/dashboard/courses" className="bg-white/[0.03] border border-white/8 hover:border-emerald-500/25 hover:bg-white/[0.06] rounded-2xl p-4 flex items-center gap-3 transition-all group">
          <span className="text-xl">📚</span>
          <div>
            <div className="text-white text-sm font-semibold group-hover:text-emerald-300 transition-colors">Browse Courses</div>
            <div className="text-white/40 text-xs">Follow a structured path</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
