"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getAssessment } from "@/data/assessments";
import { useResultsStore } from "@/store/assessmentResults";
import { useLearningProfile } from "@/store/learningProfile";

function ScoreRing({ percentage }: { percentage: number }) {
  const color =
    percentage >= 80 ? "#10b981" :
    percentage >= 60 ? "#f59e0b" :
    "#ef4444";
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white">{percentage}%</span>
        <span className="text-white/40 text-xs">score</span>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from "react";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const result = useResultsStore((s) => s.getResult(id));
  const assessment = getAssessment(id);
  const recordAssessment = useLearningProfile((s) => s.recordAssessment);

  useEffect(() => {
    if (result && assessment) {
      recordAssessment(assessment.subject, result.percentage, result.totalScore, result.maxScore);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result || !assessment) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/50 mb-4">No results found for this assessment.</p>
        <Link href={`/dashboard/assessments/${id}`} className="text-sky-400 hover:text-sky-300 text-sm">
          Take the assessment →
        </Link>
      </div>
    );
  }

  const grade =
    result.percentage >= 80 ? { label: "Excellent", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" } :
    result.percentage >= 70 ? { label: "Good", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" } :
    result.percentage >= 50 ? { label: "Satisfactory", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" } :
    { label: "Needs Improvement", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Results</h1>
        <p className="text-white/50 text-sm mt-1">{assessment.title}</p>
      </div>

      {/* Score card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing percentage={result.percentage} />
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className={`inline-flex items-center gap-1.5 text-sm font-bold border rounded-full px-4 py-1.5 ${grade.bg} ${grade.color}`}>
            {grade.label}
          </div>
          <div className="text-white text-lg font-bold">
            {result.totalScore} / {result.maxScore} points
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Correct", value: result.answers.filter((a) => a.correct === true).length, color: "text-emerald-400" },
              { label: "Partial", value: result.answers.filter((a) => a.correct === undefined && a.score > 0).length, color: "text-amber-400" },
              { label: "Incorrect", value: result.answers.filter((a) => !a.score).length, color: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-2.5">
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                <div className="text-white/40 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-white/45 text-sm">
            {result.percentage >= 80
              ? "Outstanding work! You have a strong grasp of the material."
              : result.percentage >= 60
              ? "Good effort! Review the questions you missed to strengthen your understanding."
              : "Keep practising. Review the feedback below and try again when you're ready."}
          </p>
        </div>
      </div>

      {/* Per-question breakdown */}
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Answer Breakdown</h2>
      <div className="space-y-3">
        {result.answers.map((a, i) => {
          const pct = a.maxPoints > 0 ? Math.round((a.score / a.maxPoints) * 100) : 0;
          const statusColor =
            pct === 100 ? "border-emerald-500/30 bg-emerald-500/5" :
            pct > 0 ? "border-amber-500/30 bg-amber-500/5" :
            "border-red-500/20 bg-red-500/5";
          const badge =
            pct === 100 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
            pct > 0 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
            "text-red-400 bg-red-500/10 border-red-500/20";

          return (
            <div key={a.questionId} className={`border rounded-2xl p-4 space-y-3 ${statusColor}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 text-white/50 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  <p className="text-white/85 text-sm leading-relaxed">{a.question}</p>
                </div>
                <span className={`text-xs font-bold border rounded-full px-2.5 py-1 shrink-0 ${badge}`}>
                  {a.score}/{a.maxPoints}
                </span>
              </div>

              <div className="ml-9 space-y-2">
                <div className="bg-white/5 rounded-xl px-3 py-2.5">
                  <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">Your answer</div>
                  <p className="text-white/75 text-xs leading-relaxed font-mono whitespace-pre-wrap">{a.userAnswer}</p>
                </div>
                <div className="bg-white/[0.02] rounded-xl px-3 py-2.5 border border-white/5">
                  <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">AI Feedback</div>
                  <p className="text-white/70 text-xs leading-relaxed">{a.feedback}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <Link
          href={`/dashboard/assessments/${id}`}
          className="flex-1 text-center border border-white/10 hover:border-white/20 text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold transition-all"
        >
          Retry assessment
        </Link>
        <Link
          href="/dashboard/assessments"
          className="flex-1 text-center bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-xl text-sm font-bold transition-all"
        >
          All assessments
        </Link>
        <Link
          href="/dashboard/tutor"
          className="flex-1 text-center bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 py-3 rounded-xl text-sm font-semibold transition-all"
        >
          Ask AI Tutor
        </Link>
      </div>
    </div>
  );
}
