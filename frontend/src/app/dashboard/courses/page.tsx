"use client";
import { useState } from "react";
import Link from "next/link";
import { courses, tracks, getTotalLessons } from "@/data/courses";
import type { Course } from "@/data/courses";
import { useCourseProgress } from "@/store/courseProgress";

const difficultyBadge: Record<string, string> = {
  beginner:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced:     "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const trackColorClass: Record<string, { ring: string; bg: string; text: string }> = {
  sky:     { ring: "border-sky-500/40",     bg: "bg-sky-500/10",     text: "text-sky-400"     },
  violet:  { ring: "border-violet-500/40",  bg: "bg-violet-500/10",  text: "text-violet-400"  },
  amber:   { ring: "border-amber-500/40",   bg: "bg-amber-500/10",   text: "text-amber-400"   },
  rose:    { ring: "border-rose-500/40",    bg: "bg-rose-500/10",    text: "text-rose-400"    },
  emerald: { ring: "border-emerald-500/40", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  orange:  { ring: "border-orange-500/40",  bg: "bg-orange-500/10",  text: "text-orange-400"  },
  cyan:    { ring: "border-cyan-500/40",    bg: "bg-cyan-500/10",    text: "text-cyan-400"    },
  lime:    { ring: "border-lime-500/40",    bg: "bg-lime-500/10",    text: "text-lime-400"    },
  indigo:  { ring: "border-indigo-500/40",  bg: "bg-indigo-500/10",  text: "text-indigo-400"  },
  pink:    { ring: "border-pink-500/40",    bg: "bg-pink-500/10",    text: "text-pink-400"    },
};

function CourseCard({ course }: { course: Course }) {
  const { isEnrolled, getCourseProgress, getProgressPercent } = useCourseProgress();
  const enrolled = isEnrolled(course.id);
  const cp = getCourseProgress(course.id);
  const totalLessons = getTotalLessons(course);
  const pct = getProgressPercent(course.id, totalLessons);
  const tc = trackColorClass[course.trackColor] ?? trackColorClass.sky;

  return (
    <Link href={`/dashboard/courses/${course.id}`}>
      <div className={`relative bg-white/[0.03] border hover:border-white/20 hover:bg-white/[0.06] rounded-2xl p-5 transition-all cursor-pointer h-full flex flex-col group ${
        enrolled ? tc.ring : "border-white/8"
      }`}>
        {enrolled && (
          <div className="absolute -top-2.5 left-4">
            <span className={`text-[10px] font-bold ${tc.bg} ${tc.text} border ${tc.ring} px-2.5 py-0.5 rounded-full`}>
              {pct === 100 ? "Completed ✓" : pct > 0 ? `${pct}% done` : "Enrolled"}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl ${tc.bg} border ${tc.ring} flex items-center justify-center text-2xl shrink-0`}>
            {course.icon}
          </div>
          <span className={`text-[11px] font-bold capitalize border rounded-full px-2.5 py-0.5 ${difficultyBadge[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>

        <h3 className="text-white font-bold text-sm mb-1 group-hover:text-sky-300 transition-colors leading-tight">
          {course.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{course.subtitle}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-white/30 bg-white/5 border border-white/8 rounded px-2 py-0.5">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-white/35">
          <div className="flex items-center gap-3">
            <span>📚 {course.modules.length} modules</span>
            <span>⏱ {course.estimatedHours}h</span>
          </div>
          {course.prerequisites.length > 0 && (
            <span className="text-amber-500/60 text-[10px]">🔗 prereqs</span>
          )}
        </div>

        {enrolled && totalLessons > 0 && (
          <div className="mt-3 h-1 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}

        {!enrolled && (
          <div className="mt-3 text-xs text-sky-400 font-semibold group-hover:text-sky-300 transition-colors">
            View course →
          </div>
        )}
        {enrolled && cp?.lastLessonId && pct < 100 && (
          <div className={`mt-3 text-xs font-semibold ${tc.text}`}>Continue →</div>
        )}
      </div>
    </Link>
  );
}

export default function CoursesPage() {
  const [activeTrack, setActiveTrack] = useState<string>("all");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { progress } = useCourseProgress();

  const enrolledIds = Object.keys(progress);
  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  const filtered = courses.filter((c) => {
    const matchTrack = activeTrack === "all" || c.track === activeTrack;
    const matchDiff = activeDifficulty === "all" || c.difficulty === activeDifficulty;
    const matchSearch = !searchQuery || [c.title, c.subtitle, ...c.tags].some((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchTrack && matchDiff && matchSearch;
  });

  const isFiltered = activeTrack !== "all" || activeDifficulty !== "all" || !!searchQuery;

  return (
    <div className="p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Course Catalogue</h1>
        <p className="text-white/45 text-sm mt-1">
          From Python fundamentals to Agentic AI — structured paths with clear prerequisites
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Courses",   value: courses.length, icon: "📚" },
          { label: "Enrolled",        value: enrolledCourses.length, icon: "🎓" },
          { label: "Learning Tracks", value: tracks.length, icon: "🗺️" },
          { label: "Hours of Content", value: `${courses.reduce((s, c) => s + c.estimatedHours, 0)}+`, icon: "⏱" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
            <div className="text-lg mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* My courses */}
      {enrolledCourses.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">My Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {enrolledCourses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses, topics, or tags…"
          className="w-full bg-white/[0.03] border border-white/10 focus:border-sky-500/50 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-all"
        />

        {/* Track pills */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTrack("all")}
            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
              activeTrack === "all" ? "bg-sky-500 border-sky-500 text-white" : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
            }`}>All Tracks</button>
          {tracks.map((t) => {
            const tc = trackColorClass[t.color];
            return (
              <button key={t.id} onClick={() => setActiveTrack(t.id)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all flex items-center gap-1.5 ${
                  activeTrack === t.id ? `${tc.bg} ${tc.ring} ${tc.text}` : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
                }`}>
                {t.icon} {t.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty pills */}
        <div className="flex flex-wrap gap-2">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((d) => (
            <button key={d} onClick={() => setActiveDifficulty(d)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium capitalize transition-all ${
                activeDifficulty === d
                  ? d === "all" ? "bg-white/15 border-white/30 text-white"
                    : difficultyBadge[d]
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}>
              {d === "all" ? "All Levels" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-white/30 text-xs">
        {isFiltered
          ? `Showing ${filtered.length} of ${courses.length} courses`
          : `${courses.length} courses across ${tracks.length} tracks`}
        {searchQuery && ` for "${searchQuery}"`}
      </p>

      {/* Course display */}
      {isFiltered ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-white/30">No courses match your filters.</div>
          ) : (
            filtered.map((c) => <CourseCard key={c.id} course={c} />)
          )}
        </div>
      ) : (
        tracks.map((track) => {
          const trackCourses = courses.filter((c) => c.track === track.id);
          if (!trackCourses.length) return null;
          const tc = trackColorClass[track.color] ?? trackColorClass.sky;
          return (
            <section key={track.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl ${tc.bg} border ${tc.ring} flex items-center justify-center text-lg shrink-0`}>
                  {track.icon}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{track.label}</h2>
                  <p className="text-white/35 text-xs">
                    {trackCourses.length} courses · {trackCourses.reduce((s, c) => s + c.estimatedHours, 0)}h total
                  </p>
                </div>
                <div className="flex-1 h-px bg-white/8 ml-2" />
              </div>

              {/* Path visualiser */}
              <div className="flex items-start gap-2 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {trackCourses.map((c, i) => {
                  const tc2 = trackColorClass[c.trackColor] ?? trackColorClass.sky;
                  return (
                    <div key={c.id} className="flex items-center gap-2 shrink-0">
                      <div className={`text-center px-3 py-2 rounded-xl border ${tc2.bg} ${tc2.ring} ${tc2.text} text-xs font-medium w-28`}>
                        <div className="text-lg mb-0.5">{c.icon}</div>
                        <div className="leading-tight text-[11px]">{c.title.replace(" Fundamentals", "").replace(" Essentials", "").replace(" for Machine Learning", " for ML")}</div>
                        <div className="text-[9px] mt-0.5 opacity-60 capitalize">{c.difficulty}</div>
                      </div>
                      {i < trackCourses.length - 1 && <span className="text-white/20 text-lg shrink-0">→</span>}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trackCourses.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
