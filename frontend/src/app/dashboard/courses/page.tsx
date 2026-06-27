"use client";
export default function CoursesPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <p className="text-white/40 mt-1 text-sm">Your enrolled courses will appear here</p>
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-lg font-semibold text-white mb-2">No courses yet</h2>
        <p className="text-white/40 text-sm max-w-sm mx-auto">
          Course management is coming in Phase 10. Once launched, browse and enrol in courses here.
        </p>
        <div className="inline-block mt-6 text-xs text-sky-400 border border-sky-500/20 bg-sky-500/10 rounded-full px-4 py-1.5">
          Coming in Phase 10 — LMS
        </div>
      </div>
    </div>
  );
}
