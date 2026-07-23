"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { CourseIcon } from "@/components/CourseIcon";
import { getCourse, getCoursesByTrack, getPrerequisiteCourses, getTotalLessons } from "@/data/courses";
import { useCourseProgress } from "@/store/courseProgress";
import { useSubscription, PYTHON_PROMO_COURSE_IDS } from "@/store/subscription";
import { useAuthStore } from "@/store/auth";
import { usePromoStatus } from "@/lib/usePromoStatus";
import { api } from "@/lib/api";

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

const lessonTypeIcon: Record<string, string> = {
  video:    "🎬",
  reading:  "📖",
  exercise: "💻",
  quiz:     "✅",
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

function AdminGlobalUnlockPanel({ courseId }: { courseId: string }) {
  const [until, setUntil] = useState<string | null | undefined>(undefined); // undefined = loading
  const [days, setDays] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .get<{ id: string; globally_unlocked_until: string | null }[]>("/admin/courses")
      .then((list) => setUntil(list.find((c) => c.id === courseId)?.globally_unlocked_until ?? null))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const isUnlocked = until != null && new Date(until) > new Date();

  async function unlockGlobal() {
    setBusy(true);
    try {
      await api.post(`/admin/courses/${courseId}/unlock-global`, { days: days ? Number(days) : null });
      setDays("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlock");
    } finally {
      setBusy(false);
    }
  }

  async function lockGlobal() {
    setBusy(true);
    try {
      await api.post(`/admin/courses/${courseId}/lock-global`, {});
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to lock");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-violet-500/10 border border-violet-500/25 rounded-2xl p-4 flex flex-wrap items-center gap-3">
      <span className="text-xs font-bold text-violet-300 uppercase tracking-wider shrink-0">Admin — Everyone</span>
      {until === undefined ? (
        <span className="text-white/40 text-xs">Loading…</span>
      ) : isUnlocked ? (
        <>
          <span className="text-emerald-400 text-xs font-medium">🔓 Unlocked for everyone until {formatDate(until!)}</span>
          <button
            disabled={busy}
            onClick={lockGlobal}
            className="ml-auto text-xs text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/40 rounded-lg px-2.5 py-1 transition-all disabled:opacity-40"
          >
            Lock again
          </button>
        </>
      ) : (
        <>
          <span className="text-white/40 text-xs">Not unlocked for everyone</span>
          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Forever"
            className="w-20 bg-white/[0.06] border border-white/15 rounded-lg px-2 py-1 text-white text-xs placeholder-white/25 focus:outline-none"
          />
          <span className="text-white/30 text-xs">days</span>
          <button
            disabled={busy}
            onClick={unlockGlobal}
            className="ml-auto text-xs font-semibold text-violet-300 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40"
          >
            Unlock for everyone
          </button>
        </>
      )}
      {error && <p className="text-red-400 text-xs w-full">{error}</p>}
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const course = getCourse(id);
  const prereqs = course ? getPrerequisiteCourses(id) : [];
  const [openModules, setOpenModules] = useState<Set<string>>(new Set([course?.modules[0]?.id ?? ""]));

  const { isEnrolled, enrol, getCourseProgress, getProgressPercent, isLessonComplete } = useCourseProgress();
  // canAccessCourse/isProOrTeam are store *methods* that read other state
  // internally via get() — selecting the method itself doesn't subscribe
  // this component to that internal state, so the raw fields are also
  // selected here purely to force a re-render when they change (e.g. once
  // syncPlanFromServer() resolves after mount).
  useSubscription((s) => s.subscription);
  useSubscription((s) => s.pythonPromoGranted);
  useSubscription((s) => s.unlockedCourseIds);
  const canAccessCourse = useSubscription((s) => s.canAccessCourse);
  const promoStatus = usePromoStatus();
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Guard against SSR/client mismatch: the server always renders with
  // empty/default persisted state (no localStorage), so anything read from
  // useCourseProgress/useSubscription before the client has mounted and
  // rehydrated must fall back to the same safe defaults, or React's
  // hydration pass sees mismatched HTML and throws.
  const enrolled = mounted && isEnrolled(id);
  const cp = mounted ? getCourseProgress(id) : undefined;
  const totalLessons = course ? getTotalLessons(course) : 0;
  const pct = mounted ? getProgressPercent(id, totalLessons) : 0;
  const accessible = !mounted || (course ? canAccessCourse(course.id) : true);

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/50 mb-4">Course not found.</p>
        <Link href="/dashboard/courses" className="text-sky-400 hover:text-sky-300 text-sm">Back to courses →</Link>
      </div>
    );
  }

  const tc = trackColorClass[course.trackColor] ?? trackColorClass.sky;
  const prereqsMet = !mounted || prereqs.every((p) => isEnrolled(p.id));

  function toggleModule(mid: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(mid) ? next.delete(mid) : next.add(mid);
      return next;
    });
  }

  function handleEnrol() {
    enrol(id);
    const c = course!;
    const firstModule = c.modules[0];
    const firstLesson = firstModule?.lessons[0];
    if (firstModule && firstLesson) {
      router.push(`/dashboard/courses/${id}/learn?module=${firstModule.id}&lesson=${firstLesson.id}`);
    }
  }

  function resumeCourse() {
    const firstModule = course!.modules[0];
    const firstLesson = firstModule?.lessons[0];
    const mId = cp?.lastModuleId ?? firstModule?.id;
    const lId = cp?.lastLessonId ?? firstLesson?.id;
    if (mId && lId) {
      router.push(`/dashboard/courses/${id}/learn?module=${mId}&lesson=${lId}`);
    }
  }

  const nextCourses = getCoursesByTrack(course.track).filter(
    (c) => c.id !== id && c.prerequisites.includes(id)
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-8">
      {isAdmin && <AdminGlobalUnlockPanel courseId={course.id} />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/35">
        <Link href="/dashboard/courses" className="hover:text-white/60 transition-colors">Courses</Link>
        <span>/</span>
        <span className={tc.text}>{course.track.replace("-", " ")}</span>
        <span>/</span>
        <span className="text-white/50">{course.title}</span>
      </div>

      {/* Hero */}
      <div className={`bg-white/[0.03] border ${enrolled ? tc.ring : "border-white/8"} rounded-2xl p-6 sm:p-8`}>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-bold capitalize border rounded-full px-3 py-1 ${difficultyBadge[course.difficulty]}`}>
                {course.difficulty}
              </span>
              <span className={`text-xs font-bold border rounded-full px-3 py-1 ${tc.bg} ${tc.ring} ${tc.text}`}>
                {course.track.replace(/-/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <CourseIcon icon={course.icon} size={28} />
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            </div>
            <p className="text-white/50 text-sm mb-4">{course.subtitle}</p>
            <p className="text-white/60 text-sm leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/8 text-sm text-white/50">
          <div className="flex items-center gap-1.5"><span>📚</span>{course.modules.length} modules</div>
          <div className="flex items-center gap-1.5"><span>📝</span>{totalLessons} lessons</div>
          <div className="flex items-center gap-1.5"><span>⏱</span>~{course.estimatedHours} hours</div>
          {course.prerequisites.length === 0 && (
            <div className="flex items-center gap-1.5 text-emerald-400/70"><span>✅</span>No prerequisites</div>
          )}
        </div>

        {/* Progress bar if enrolled */}
        {enrolled && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-white/40">{cp?.completedLessons.length ?? 0} / {totalLessons} lessons complete</span>
              <span className={`font-bold ${pct === 100 ? "text-emerald-400" : tc.text}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* CTA */}
        {!enrolled && !accessible ? (
          <div className="mt-6 bg-amber-500/10 border border-amber-500/25 rounded-xl p-5 text-center space-y-3">
            <div className="text-2xl">🔒</div>
            {!PYTHON_PROMO_COURSE_IDS.includes(id) ? (
              <>
                <p className="text-white font-semibold text-sm">This course requires a Pro plan</p>
                <p className="text-white/45 text-xs max-w-sm mx-auto">
                  Upgrade to Pro to unlock this course, along with every other course on DAQS Learn.
                </p>
              </>
            ) : (
              <>
                <p className="text-white font-semibold text-sm">
                  {promoStatus && promoStatus.remaining > 0
                    ? `This course is free for the first 100 sign-ups — ${promoStatus.remaining} spot${promoStatus.remaining === 1 ? "" : "s"} left`
                    : "The free promo spots for this course are all claimed"}
                </p>
                <p className="text-white/45 text-xs max-w-sm mx-auto">
                  {promoStatus && promoStatus.remaining > 0
                    ? "New accounts get this course free automatically while spots remain. Existing accounts can unlock it with Pro."
                    : "Upgrade to Pro to unlock this course, along with every other course on DAQS Learn."}
                </p>
              </>
            )}
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#1a1206] font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
            >
              View Pro plans →
            </Link>
          </div>
        ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {!enrolled ? (
            <button
              onClick={handleEnrol}
              disabled={!prereqsMet && prereqs.length > 0}
              className="flex-1 min-w-[160px] bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              {prereqs.length > 0 && !prereqsMet ? "Complete prerequisites first" : "Enrol & Start Learning →"}
            </button>
          ) : (
            <button
              onClick={resumeCourse}
              className={`flex-1 min-w-[160px] ${tc.bg} border ${tc.ring} ${tc.text} font-bold py-3 rounded-xl text-sm transition-all hover:opacity-90`}
            >
              {pct === 100 ? "Review Course →" : `Continue Learning → ${pct > 0 ? `(${pct}%)` : ""}`}
            </button>
          )}
          <Link href="/dashboard/courses"
            className="border border-white/10 hover:border-white/20 text-white/50 hover:text-white py-3 px-5 rounded-xl text-sm font-semibold transition-all">
            ← Back
          </Link>
        </div>
        )}
      </div>

      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">Prerequisites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prereqs.map((p) => {
              const ptc = trackColorClass[p.trackColor] ?? trackColorClass.sky;
              const done = mounted && isEnrolled(p.id) && getProgressPercent(p.id, getTotalLessons(p)) === 100;
              return (
                <Link key={p.id} href={`/dashboard/courses/${p.id}`}
                  className={`flex items-center gap-3 bg-white/[0.03] border ${done ? "border-emerald-500/30" : ptc.ring} hover:bg-white/[0.06] rounded-xl p-4 transition-all`}>
                  <span className="text-2xl"><CourseIcon icon={p.icon} size={28} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold truncate">{p.title}</div>
                    <div className={`text-xs capitalize ${ptc.text}`}>{p.difficulty} · {p.track.replace(/-/g, " ")}</div>
                  </div>
                  {done ? (
                    <span className="text-emerald-400 text-xs font-bold shrink-0">✓ Done</span>
                  ) : (
                    <span className="text-white/30 text-xs shrink-0">View →</span>
                  )}
                </Link>
              );
            })}
          </div>
          {!prereqsMet && (
            <p className="mt-2 text-xs text-amber-400/70">Complete all prerequisites to unlock this course.</p>
          )}
        </section>
      )}

      {/* What you'll learn */}
      <section>
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">What You&apos;ll Learn</h2>
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <ul className="space-y-2">
            {course.outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Curriculum */}
      <section>
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">
          Curriculum — {course.modules.length} Modules · {totalLessons} Lessons
        </h2>
        <div className="space-y-3">
          {course.modules.map((mod, mi) => {
            const open = openModules.has(mod.id);
            const modLessons = mod.lessons.length;
            const modDone = enrolled ? mod.lessons.filter((l) => isLessonComplete(id, l.id)).length : 0;
            return (
              <div key={mod.id} className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white/8 text-white/40 text-xs flex items-center justify-center font-bold shrink-0">
                      {mi + 1}
                    </span>
                    <div className="text-left">
                      <div className="text-white text-sm font-semibold">{mod.title}</div>
                      <div className="text-white/35 text-xs">
                        {modLessons} lessons{enrolled ? ` · ${modDone}/${modLessons} done` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {enrolled && modDone === modLessons && (
                      <span className="text-emerald-400 text-xs font-bold">✓</span>
                    )}
                    <span className="text-white/30 text-sm">{open ? "▲" : "▼"}</span>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-white/8 divide-y divide-white/5">
                    {mod.lessons.map((lesson, li) => {
                      const done = enrolled && isLessonComplete(id, lesson.id);
                      return (
                        <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                          <span className="text-white/25 text-xs w-4 text-center shrink-0">{li + 1}</span>
                          <span className="text-sm shrink-0">{lessonTypeIcon[lesson.type]}</span>
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm ${done ? "text-white/40 line-through" : "text-white/75"}`}>
                              {lesson.title}
                            </span>
                            <span className="text-white/25 text-xs ml-2 capitalize">{lesson.type.replace("_", " ")}</span>
                          </div>
                          <span className="text-white/25 text-xs shrink-0">{lesson.duration}m</span>
                          {done && <span className="text-emerald-400 text-xs shrink-0">✓</span>}
                          {enrolled && !done && (
                            <Link
                              href={`/dashboard/courses/${id}/learn?module=${mod.id}&lesson=${lesson.id}`}
                              className="text-xs text-sky-400 hover:text-sky-300 shrink-0 transition-colors"
                            >
                              Start →
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Tags */}
      <section>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span key={tag} className="text-xs text-white/40 bg-white/5 border border-white/8 rounded-full px-3 py-1">{tag}</span>
          ))}
        </div>
      </section>

      {/* What's next */}
      {nextCourses.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">What Comes Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nextCourses.map((nc) => {
              const ntc = trackColorClass[nc.trackColor] ?? trackColorClass.sky;
              return (
                <Link key={nc.id} href={`/dashboard/courses/${nc.id}`}
                  className={`flex items-center gap-3 bg-white/[0.03] border border-white/8 hover:border-white/20 rounded-xl p-4 transition-all group`}>
                  <span className="text-2xl"><CourseIcon icon={nc.icon} size={28} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold group-hover:text-sky-300 transition-colors">{nc.title}</div>
                    <div className={`text-xs capitalize ${ntc.text}`}>{nc.difficulty}</div>
                  </div>
                  <span className="text-white/30 text-xs shrink-0 group-hover:text-white/50 transition-colors">→</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
