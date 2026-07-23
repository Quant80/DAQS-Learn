"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { courses, getCourse, getTotalLessons } from "@/data/courses";
import { CourseIcon } from "@/components/CourseIcon";
import type { Module, Lesson } from "@/data/courses";
import { useCourseProgress } from "@/store/courseProgress";
import { useCertificates } from "@/store/certificates";
import { useSubscription } from "@/store/subscription";
import { useAuthStore } from "@/store/auth";

const NOTEBOOK_URL = process.env.NEXT_PUBLIC_NOTEBOOK_URL ?? "http://localhost:8888";

function notebookHref(file: string) {
  return `${NOTEBOOK_URL}/lab/tree/daqs-notebooks/${file}`;
}

const lessonTypeIcon: Record<string, string> = {
  video:    "🎬",
  reading:  "📖",
  exercise: "💻",
  quiz:     "✅",
};

const lessonTypeLabel: Record<string, string> = {
  video:    "Video Lesson",
  reading:  "Reading",
  exercise: "Coding Exercise",
  quiz:     "Knowledge Check",
};

function MarkdownRenderer({ content }: { content: string }) {
  const html = content
    .replace(/^### (.+)/gm, '<h3 class="text-white font-bold text-base mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)/gm, '<h2 class="text-white font-bold text-lg mt-8 mb-3 border-b border-white/10 pb-2">$1</h2>')
    .replace(/^# (.+)/gm, '<h1 class="text-white font-bold text-2xl mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/`([^`\n]+)`/g, '<code class="bg-white/8 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/```(\w+)?\n([\s\S]+?)```/g, (_, lang, code) =>
      `<pre class="bg-[#0a1628] border border-white/10 rounded-xl p-4 my-4 overflow-x-auto"><code class="text-emerald-300 text-sm font-mono leading-relaxed">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
    )
    .replace(/^\| (.+)/gm, (match) => {
      if (match.includes("---")) return "";
      const cells = match.split("|").filter((c) => c.trim());
      return `<tr>${cells.map((c) => `<td class="border border-white/10 px-3 py-2 text-sm text-white/70">${c.trim()}</td>`).join("")}</tr>`;
    })
    .replace(/(<tr>[\s\S]+?<\/tr>)/g, '<table class="w-full border-collapse border border-white/10 rounded-xl overflow-hidden my-4">$1</table>')
    .replace(/^- (.+)/gm, '<li class="text-white/70 text-sm ml-4 mb-1 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)/gm, '<li class="text-white/70 text-sm ml-4 mb-1 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="text-white/65 text-sm leading-7 mb-4">')
    .replace(/^\[(.+)\]\((.+)\)/gm, '<a href="$2" class="text-sky-400 hover:text-sky-300 underline" target="_blank">$1</a>');

  return (
    <div
      className="prose-daqs space-y-1"
      dangerouslySetInnerHTML={{ __html: `<p class="text-white/65 text-sm leading-7 mb-4">${html}</p>` }}
    />
  );
}

function LessonContent({ lesson }: { lesson: Lesson }) {
  if (lesson.type === "reading" && lesson.content) {
    return (
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 sm:p-8">
        <MarkdownRenderer content={lesson.content} />
      </div>
    );
  }

  if (lesson.type === "reading" && !lesson.content) {
    return (
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">📖</div>
        <h3 className="text-white font-bold mb-2">Reading: {lesson.title}</h3>
        <p className="text-white/45 text-sm mb-6 max-w-md mx-auto">
          This reading covers key concepts for this lesson. The full content is being prepared and will be available soon.
        </p>
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-sm text-sky-300/80 max-w-md mx-auto">
          💡 While waiting, try asking the AI Tutor about this topic for an instant explanation.
        </div>
      </div>
    );
  }

  if (lesson.type === "video") {
    return (
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
        <div className="aspect-video bg-[#0a1628] flex flex-col items-center justify-center border-b border-white/8">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-white font-bold mb-2">{lesson.title}</h3>
          <p className="text-white/40 text-sm">Video content coming soon</p>
          <p className="text-white/25 text-xs mt-1">Duration: ~{lesson.duration} minutes</p>
        </div>
        <div className="p-6">
          <p className="text-white/50 text-sm">
            This video lesson will walk you through {lesson.title.toLowerCase()} with clear examples
            and demonstrations. Video lectures are being recorded by our expert instructors.
          </p>
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300/80">
            💡 Tip: While this video is being prepared, use the AI Tutor to get an explanation of this topic right now.
          </div>
        </div>
      </div>
    );
  }

  if (lesson.type === "exercise") {
    return (
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
            💻
          </div>
          <div>
            <h3 className="text-white font-bold">Coding Exercise</h3>
            <p className="text-white/40 text-xs">{lesson.title} · ~{lesson.duration} minutes</p>
          </div>
        </div>

        {/* Notebook launch card */}
        {lesson.notebookFile && (
          <a
            href={notebookHref(lesson.notebookFile)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 bg-emerald-500/10 hover:bg-emerald-500/18 border border-emerald-500/25 rounded-xl px-5 py-4 transition-all group"
          >
            <div className="text-3xl shrink-0">🧮</div>
            <div className="flex-1">
              <div className="text-emerald-300 font-semibold text-sm">Open in Jupyter Notebook</div>
              <div className="text-emerald-300/45 text-xs">Complete this exercise interactively in {lesson.notebookFile}</div>
            </div>
            <span className="text-emerald-400/50 group-hover:text-emerald-400 transition-colors text-lg shrink-0">↗</span>
          </a>
        )}

        {/* Inline content if exercise has instructions */}
        {lesson.content && (
          <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5">
            <MarkdownRenderer content={lesson.content} />
          </div>
        )}

        {!lesson.content && (
          <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5">
            <h4 className="text-white/70 text-xs font-bold uppercase tracking-wider mb-3">Exercise Instructions</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              This hands-on exercise lets you practice {lesson.title.toLowerCase()}.
              Apply what you have learned in this module by completing the tasks below.
            </p>
            <div className="mt-4 space-y-2">
              {["Read the problem statement carefully", "Plan your approach before coding", "Write clean, well-structured code", "Test your solution with different inputs", "Compare with the provided solution"].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/55">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {!lesson.notebookFile && (
          <div className="bg-[#0a1628] border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/[0.02]">
              <span className="text-[10px] text-white/30 font-mono">Python Exercise</span>
              <span className="text-[10px] text-emerald-400/60">Write your solution here</span>
            </div>
            <div className="p-4">
              <pre className="text-emerald-300 text-xs font-mono leading-relaxed">
{`# ${lesson.title}
# Complete the exercise below

def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 text-xs text-violet-300/80">
          🤖 Stuck? Ask the <Link href="/dashboard/tutor" className="text-violet-400 hover:text-violet-300 font-semibold">AI Tutor</Link> for a hint — without spoiling the solution.
        </div>
      </div>
    );
  }

  if (lesson.type === "quiz") {
    return (
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">✅</div>
          <div>
            <h3 className="text-white font-bold">Knowledge Check</h3>
            <p className="text-white/40 text-xs">{lesson.title} · ~{lesson.duration} minutes</p>
          </div>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          Test your understanding of the concepts covered in this module.
          This quiz helps you identify areas that need more review before advancing.
        </p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300/80">
          💡 Tip: After this quiz, try the full <Link href="/dashboard/assessments" className="text-amber-400 hover:text-amber-300 font-semibold">Assessments</Link> for a comprehensive randomised test with full solutions.
        </div>
        <Link href="/dashboard/assessments"
          className="inline-flex items-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
          Go to Assessments →
        </Link>
      </div>
    );
  }

  return null;
}

function LearnPageInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const course = getCourse(id);
  const moduleId = searchParams.get("module") ?? course?.modules[0]?.id ?? "";
  const lessonId = searchParams.get("lesson") ?? course?.modules[0]?.lessons[0]?.id ?? "";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { isEnrolled, enrol, isLessonComplete, completeLesson, setLastPosition, getProgressPercent } = useCourseProgress();
  const { hasCertificate, hydrate } = useCertificates();
  // canAccessCourse is a store *method* that reads other state internally
  // via get() — selecting the raw fields too forces a re-render once
  // syncPlanFromServer() resolves after mount (selecting the method alone
  // would not, since its reference never changes).
  useSubscription((s) => s.subscription);
  useSubscription((s) => s.pythonPromoGranted);
  useSubscription((s) => s.unlockedCourseIds);
  const canAccessCourse = useSubscription((s) => s.canAccessCourse);
  const user = useAuthStore((s) => s.user);
  const enrolled = isEnrolled(id);
  const accessible = course ? canAccessCourse(course.id) : true;

  // Deep-link protection — server-side enroll already rejects gated courses,
  // but this content itself is static/bundled, so the redirect has to
  // happen here too, not just hide the "Enrol" button on the detail page.
  useEffect(() => {
    if (course && !accessible) router.replace(`/dashboard/courses/${id}`);
  }, [course, accessible, id, router]);

  useEffect(() => {
    if (course && !enrolled && accessible) enrol(id);
  }, [course, enrolled, accessible, id, enrol]);

  useEffect(() => {
    if (moduleId && lessonId) setLastPosition(id, lessonId, moduleId);
  }, [id, moduleId, lessonId, setLastPosition]);

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/50 mb-4">Course not found.</p>
        <Link href="/dashboard/courses" className="text-sky-400 hover:text-sky-300 text-sm">Back to courses →</Link>
      </div>
    );
  }

  if (!accessible) {
    return null;
  }

  const allLessons: Array<{ mod: Module; lesson: Lesson }> = course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({ mod, lesson }))
  );

  const currentIndex = allLessons.findIndex((l) => l.lesson.id === lessonId);
  const current = allLessons[currentIndex];
  const prev = allLessons[currentIndex - 1];
  const next = allLessons[currentIndex + 1];
  const totalLessons = getTotalLessons(course);
  const done = isLessonComplete(id, lessonId);

  function navigate(mod: Module, lesson: Lesson) {
    router.push(`/dashboard/courses/${id}/learn?module=${mod.id}&lesson=${lesson.id}`);
  }

  function markComplete() {
    const c = course as NonNullable<typeof course>;
    const mod = c.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    completeLesson(id, lessonId, moduleId, mod.lessons.length);

    // Certificates are issued server-side (in the same request that
    // records this lesson completion) — re-pull the list shortly after so
    // the newly-earned certificate shows up locally without a full reload.
    const isLastLesson = !next;
    if (isLastLesson && !hasCertificate(id) && user) {
      const icons = Object.fromEntries(courses.map((crs) => [crs.id, crs.icon]));
      setTimeout(() => hydrate(icons, user.email ?? ""), 1500);
    }

    if (next) navigate(next.mod, next.lesson);
  }

  if (!current) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/50">Lesson not found.</p>
        <Link href={`/dashboard/courses/${id}`} className="text-sky-400 hover:text-sky-300 text-sm">Back to course →</Link>
      </div>
    );
  }

  const progressPct = Math.round((currentIndex / totalLessons) * 100);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-72" : "w-0"} shrink-0 transition-all duration-300 overflow-hidden border-r border-white/8 bg-[#060d1a] flex flex-col`}>
        {/* Course title */}
        <div className="px-4 py-4 border-b border-white/8">
          <Link href={`/dashboard/courses/${id}`} className="flex items-center gap-2 group mb-3">
            <span className="text-lg"><CourseIcon icon={course.icon} size={20} /></span>
            <div className="min-w-0">
              <div className="text-white text-xs font-bold truncate group-hover:text-sky-300 transition-colors">{course.title}</div>
              <div className="text-white/30 text-[10px]">{course.difficulty}</div>
            </div>
          </Link>
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="text-white/30 text-[10px] mt-1">{currentIndex} / {totalLessons} lessons</div>
        </div>

        {/* Module/lesson list */}
        <div className="flex-1 overflow-y-auto py-2">
          {course.modules.map((mod, mi) => (
            <div key={mod.id}>
              <div className="px-4 py-2 text-[10px] text-white/30 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-white/8 text-white/25 text-[9px] flex items-center justify-center font-bold">{mi + 1}</span>
                {mod.title}
              </div>
              {mod.lessons.map((lesson) => {
                const isActive = lesson.id === lessonId;
                const lDone = isLessonComplete(id, lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(mod, lesson)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                      isActive ? "bg-sky-500/15 border-r-2 border-sky-500" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-sm shrink-0">{lDone ? "✅" : lessonTypeIcon[lesson.type]}</span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs truncate ${isActive ? "text-white font-semibold" : lDone ? "text-white/35" : "text-white/60"}`}>
                        {lesson.title}
                      </div>
                      <div className="text-[10px] text-white/25">{lesson.duration}m · {lesson.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[#060d1a]">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="text-white/40 hover:text-white transition-colors text-sm p-1.5"
          >
            ☰
          </button>
          <div className="flex items-center gap-1.5 text-xs text-white/35 flex-1 min-w-0">
            <Link href="/dashboard/courses" className="hover:text-white/60 transition-colors">Courses</Link>
            <span>/</span>
            <Link href={`/dashboard/courses/${id}`} className="hover:text-white/60 transition-colors truncate">{course.title}</Link>
            <span>/</span>
            <span className="text-white/55 truncate">{current.lesson.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 hidden sm:inline">
              {lessonTypeIcon[current.lesson.type]} {lessonTypeLabel[current.lesson.type]}
            </span>
            <Link href="/dashboard/tutor"
              className="text-xs text-violet-400 hover:text-violet-300 border border-violet-500/25 rounded-xl px-3 py-1.5 transition-colors shrink-0">
              Ask AI →
            </Link>
          </div>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{lessonTypeIcon[current.lesson.type]}</span>
                <span className="text-xs text-white/35 capitalize">{lessonTypeLabel[current.lesson.type]} · {current.lesson.duration} min</span>
                {done && <span className="text-emerald-400 text-xs font-bold ml-auto">✓ Completed</span>}
              </div>
              <h1 className="text-xl font-bold text-white">{current.lesson.title}</h1>
            </div>

            {/* Open in Notebook banner */}
            {current.lesson.notebookFile && (
              <a
                href={notebookHref(current.lesson.notebookFile)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-amber-500/8 hover:bg-amber-500/15 border border-amber-500/25 rounded-2xl px-5 py-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-2xl shrink-0">
                  🧮
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-amber-300 font-semibold text-sm">Open in Jupyter Notebook</div>
                  <div className="text-amber-300/50 text-xs truncate">{current.lesson.notebookFile}</div>
                </div>
                <span className="text-amber-400/60 group-hover:text-amber-400 transition-colors text-sm shrink-0">↗</span>
              </a>
            )}

            <LessonContent lesson={current.lesson} />
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="shrink-0 border-t border-white/8 bg-[#060d1a] px-4 sm:px-8 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <button
              onClick={() => prev && navigate(prev.mod, prev.lesson)}
              disabled={!prev}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 text-sm transition-all shrink-0"
            >
              ← Previous
            </button>

            <div className="flex-1 text-center">
              {done ? (
                <span className="text-emerald-400 text-sm font-semibold">✓ Lesson complete</span>
              ) : (
                <button
                  onClick={markComplete}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
                >
                  {next ? "Mark Complete & Continue →" : "Mark Complete ✓"}
                </button>
              )}
            </div>

            <button
              onClick={() => next && navigate(next.mod, next.lesson)}
              disabled={!next}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 text-sm transition-all shrink-0"
            >
              Next →
            </button>
          </div>

          {!next && done && (
            <div className="max-w-3xl mx-auto mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-emerald-300 text-sm font-semibold">🎉 Course complete! Certificate earned.</span>
              <div className="flex gap-2">
                {hasCertificate(id) && (
                  <Link
                    href={`/dashboard/certificates/${(course as NonNullable<typeof course>).id}`}
                    className="text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-bold rounded-xl px-3 py-1.5 transition-colors"
                    onClick={() => {
                      const cert = (course as NonNullable<typeof course>);
                      void cert; // will navigate via href
                    }}
                  >
                    🏆 View Certificate
                  </Link>
                )}
                <Link href="/dashboard/certificates" className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-xl px-3 py-1.5 transition-colors">
                  My Certificates →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white/50">Loading lesson…</div>}>
      <LearnPageInner />
    </Suspense>
  );
}
