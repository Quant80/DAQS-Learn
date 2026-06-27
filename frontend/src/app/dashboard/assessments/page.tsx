"use client";
import Link from "next/link";
import { useState } from "react";
import { assessments, difficultyColor, typeIcon, AssessmentType } from "@/data/assessments";
import { useResultsStore } from "@/store/assessmentResults";

const FILTERS: { label: string; value: AssessmentType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Quizzes", value: "quiz" },
  { label: "Assignments", value: "assignment" },
  { label: "Code Challenges", value: "code_challenge" },
];

export default function AssessmentsPage() {
  const [filter, setFilter] = useState<AssessmentType | "all">("all");
  const getResult = useResultsStore((s) => s.getResult);

  const filtered = filter === "all" ? assessments : assessments.filter((a) => a.type === filter);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Assessments</h1>
        <p className="text-white/50 mt-1 text-sm">Quizzes, assignments, and code challenges — AI-marked instantly</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? "bg-sky-500 text-white"
                : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Assessment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a) => {
          const result = getResult(a.id);
          const totalPoints = a.questions.reduce((sum, q) => sum + q.points, 0);

          return (
            <div key={a.id} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {typeIcon[a.type]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm leading-tight">{a.title}</h3>
                    <p className="text-white/45 text-xs mt-0.5">{a.subject}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold border rounded-full px-2.5 py-1 shrink-0 capitalize ${difficultyColor[a.difficulty]}`}>
                  {a.difficulty}
                </span>
              </div>

              <p className="text-white/55 text-xs leading-relaxed">{a.description}</p>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-xs text-white/40">
                <span>{a.questions.length} questions</span>
                <span>·</span>
                <span>{totalPoints} pts</span>
                {a.time_limit && (
                  <>
                    <span>·</span>
                    <span>{a.time_limit} min</span>
                  </>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {a.tags.map((t) => (
                  <span key={t} className="text-[10px] text-white/35 bg-white/5 rounded px-2 py-0.5">{t}</span>
                ))}
              </div>

              {/* Result or Start */}
              {result ? (
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/8">
                  <div className="flex items-center gap-2">
                    <div className={`text-sm font-bold ${result.percentage >= 70 ? "text-emerald-400" : result.percentage >= 50 ? "text-amber-400" : "text-red-400"}`}>
                      {result.percentage}%
                    </div>
                    <div className="text-white/40 text-xs">{result.totalScore}/{result.maxScore} pts</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/assessments/${a.id}/results`} className="text-xs text-sky-400 hover:text-sky-300 border border-sky-500/20 hover:border-sky-500/40 bg-sky-500/5 rounded-lg px-3 py-1.5 transition-all">
                      View results
                    </Link>
                    <Link href={`/dashboard/assessments/${a.id}`} className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all">
                      Retry
                    </Link>
                  </div>
                </div>
              ) : (
                <Link href={`/dashboard/assessments/${a.id}`} className="mt-auto block text-center bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                  Start assessment
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
