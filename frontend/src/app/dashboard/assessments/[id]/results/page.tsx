"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getTemplate, getRecommendations, difficultyColors } from "@/data/assessmentTemplates";
import { useSessionStore } from "@/store/assessmentSession";
import { getQuestionsById } from "@/data/questionBank";

function ScoreRing({ percentage }: { percentage: number }) {
  const color = percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444";
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white">{percentage}%</span>
        <span className="text-white/40 text-xs">score</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const session = useSessionStore((s) => s.getSession(id));
  const template = getTemplate(id);
  const [openSolutions, setOpenSolutions] = useState<Set<string>>(new Set());
  const [allSolutionsOpen, setAllSolutionsOpen] = useState(false);

  if (!session?.completedAt || !template) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/50 mb-4">No results found. Complete the assessment first.</p>
        <Link href={`/dashboard/assessments/${id}`} className="text-sky-400 hover:text-sky-300 text-sm">Take the assessment →</Link>
      </div>
    );
  }

  const { percentage, totalScore, maxScore, answers, questions } = session;
  const questionObjects = getQuestionsById(questions.map((q) => q.id));
  const recommendations = getRecommendations(id, percentage);

  const grade =
    percentage >= 80 ? { label: "Excellent", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" } :
    percentage >= 70 ? { label: "Good", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" } :
    percentage >= 50 ? { label: "Satisfactory", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" } :
    { label: "Needs Improvement", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };

  const correct = answers.filter((a) => a.score === questionObjects.find((q) => q.id === a.questionId)?.points).length;

  function toggleSolution(qid: string) {
    setOpenSolutions((prev) => {
      const next = new Set(prev);
      next.has(qid) ? next.delete(qid) : next.add(qid);
      return next;
    });
  }

  function toggleAllSolutions() {
    if (allSolutionsOpen) {
      setOpenSolutions(new Set());
    } else {
      setOpenSolutions(new Set(questionObjects.map((q) => q.id)));
    }
    setAllSolutionsOpen((p) => !p);
  }

  function handleAskTutor() {
    if (!template) return;
    const ctx = {
      title: template.title,
      subject: template.subject,
      difficulty: template.difficulty,
      percentage,
      totalScore,
      maxScore,
      questions: questionObjects.map((q, i) => {
        const ans = answers.find((a) => a.questionId === q.id);
        const earned = ans?.score ?? 0;
        const userAnswerDisplay =
          q.type === "mcq"
            ? (q.options?.[parseInt(ans?.answer ?? "")] ?? "(no answer)")
            : (ans?.answer || "(no answer)");
        const correctAnswerDisplay =
          q.type === "mcq"
            ? (q.options?.[q.correct ?? 0] ?? "")
            : q.solution.answer;
        return {
          number: i + 1,
          question: q.question,
          type: q.type,
          difficulty: q.difficulty,
          userAnswer: userAnswerDisplay,
          correctAnswer: correctAnswerDisplay,
          earned,
          max: q.points,
          explanation: q.solution.explanation,
          concepts: q.solution.concepts,
          feedback: ans?.feedback ?? null,
        };
      }),
    };
    sessionStorage.removeItem("daqs_tutor_messages");
    sessionStorage.setItem("daqs_tutor_assessment", JSON.stringify(ctx));
    router.push("/dashboard/tutor");
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Results</h1>
        <p className="text-white/50 text-sm mt-1">{template.title} · {template.subject} · {template.difficulty}</p>
      </div>

      {/* Score card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing percentage={percentage} />
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className={`inline-flex items-center gap-1.5 text-sm font-bold border rounded-full px-4 py-1.5 ${grade.bg} ${grade.color}`}>
            {grade.label}
          </div>
          <div className="text-white text-xl font-bold">{totalScore} / {maxScore} points</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Correct", value: correct, color: "text-emerald-400" },
              { label: "Partial", value: answers.filter((a) => a.score > 0 && a.score < (questionObjects.find((q) => q.id === a.questionId)?.points ?? 0)).length, color: "text-amber-400" },
              { label: "No score", value: answers.filter((a) => a.score === 0).length, color: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-2.5">
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                <div className="text-white/40 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-white/45 text-sm">
            {percentage >= 80 ? "Outstanding! You have an excellent understanding of this material." :
             percentage >= 60 ? "Good effort! Review the questions below and study the solutions." :
             "Keep practising. Read through all the solutions carefully before your next attempt."}
          </p>
        </div>
      </div>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div className={`rounded-2xl p-5 border ${percentage >= 80 ? "bg-emerald-500/8 border-emerald-500/20" : percentage >= 50 ? "bg-amber-500/8 border-amber-500/20" : "bg-red-500/8 border-red-500/20"}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{percentage >= 80 ? "🚀" : percentage >= 50 ? "📈" : "🔄"}</span>
            <h3 className="text-sm font-bold text-white">
              {percentage >= 80 ? "You're ready for the next level!" : percentage >= 50 ? "Keep building on this" : "Strengthen your foundations"}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.slice(0, 4).map((rec) => {
              const c = difficultyColors[rec.difficulty];
              return (
                <Link key={rec.id} href={`/dashboard/assessments/${rec.id}`}
                  className={`flex items-center gap-3 bg-white/[0.03] border ${c.border} hover:bg-white/[0.07] rounded-xl p-3.5 transition-all group`}>
                  <span className="text-xl shrink-0">{rec.icon}</span>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-semibold group-hover:text-sky-300 transition-colors truncate">{rec.title}</div>
                    <div className={`text-xs capitalize ${c.text}`}>{rec.difficulty} · {rec.questionCount}q</div>
                  </div>
                  <span className="text-white/30 text-xs ml-auto shrink-0">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Solutions header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
          Question Breakdown & Solutions
        </h2>
        <button
          onClick={toggleAllSolutions}
          className="text-xs text-sky-400 hover:text-sky-300 border border-sky-500/25 hover:border-sky-500/40 rounded-xl px-3 py-1.5 transition-all"
        >
          {allSolutionsOpen ? "Hide all solutions" : "📖 Reveal all solutions"}
        </button>
      </div>

      {/* Per-question with solutions */}
      <div className="space-y-4">
        {questionObjects.map((q, i) => {
          const ans = answers.find((a) => a.questionId === q.id);
          const earned = ans?.score ?? 0;
          const max = q.points;
          const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
          const statusColor =
            pct === 100 ? "border-emerald-500/30 bg-emerald-500/5" :
            pct > 0 ? "border-amber-500/30 bg-amber-500/5" :
            "border-red-500/20 bg-red-500/5";
          const badge =
            pct === 100 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
            pct > 0 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
            "text-red-400 bg-red-500/10 border-red-500/20";

          const solutionOpen = openSolutions.has(q.id);

          const userAnswerDisplay = q.type === "mcq"
            ? (q.options?.[parseInt(ans?.answer ?? "")] ?? "(no answer)")
            : (ans?.answer || "(no answer)");

          const correctAnswerDisplay = q.type === "mcq"
            ? (q.options?.[q.correct ?? 0] ?? "")
            : q.solution.answer;

          return (
            <div key={q.id} className={`border rounded-2xl overflow-hidden ${statusColor}`}>
              {/* Question header */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-white/50 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5 capitalize">{q.type.replace("_", " ")}</span>
                        <span className="text-[10px] text-white/30">{q.difficulty}</span>
                      </div>
                      <p className="text-white/85 text-sm leading-relaxed">{q.question}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold border rounded-full px-2.5 py-1 shrink-0 ${badge}`}>{earned}/{max}</span>
                </div>

                {/* MCQ options with highlighting */}
                {q.type === "mcq" && q.options && (
                  <div className="ml-9 space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const selected = parseInt(ans?.answer ?? "") === oi;
                      const isCorrect = oi === q.correct;
                      return (
                        <div key={oi} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                          isCorrect ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" :
                          selected ? "bg-red-500/15 border border-red-500/30 text-red-300" :
                          "border border-white/5 text-white/35"
                        }`}>
                          <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold shrink-0" style={{
                            borderColor: isCorrect ? "#10b981" : selected ? "#ef4444" : "rgba(255,255,255,0.15)"
                          }}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                          {isCorrect && <span className="ml-auto text-emerald-400 shrink-0">✓ Correct</span>}
                          {selected && !isCorrect && <span className="ml-auto text-red-400 shrink-0">✗ Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Short/Code answer display */}
                {q.type !== "mcq" && (
                  <div className="ml-9 space-y-2">
                    <div className="bg-white/5 rounded-xl px-3 py-2.5">
                      <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">Your answer</div>
                      <pre className="text-white/70 text-xs leading-relaxed whitespace-pre-wrap font-mono">{userAnswerDisplay}</pre>
                    </div>
                    {ans?.feedback && (
                      <div className="bg-white/[0.02] rounded-xl px-3 py-2.5 border border-white/5">
                        <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">AI Feedback</div>
                        <p className="text-white/70 text-xs leading-relaxed">{ans.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Solution panel — unlocked after submission */}
              <div className="border-t border-white/8">
                <button
                  onClick={() => toggleSolution(q.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold hover:bg-white/[0.04] transition-colors"
                >
                  <span className="flex items-center gap-2 text-amber-400">
                    <span>📖</span>
                    {solutionOpen ? "Hide solution" : "View solution & explanation"}
                  </span>
                  <span className="text-white/30 text-sm">{solutionOpen ? "▲" : "▼"}</span>
                </button>

                {solutionOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Correct answer */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-2">✓ Correct Answer</div>
                      <pre className="text-emerald-300 text-xs leading-relaxed whitespace-pre-wrap font-mono">{correctAnswerDisplay}</pre>
                    </div>

                    {/* Explanation */}
                    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                      <div className="text-[10px] text-sky-400 uppercase tracking-wider font-bold mb-2">💡 Explanation</div>
                      <p className="text-white/75 text-xs leading-relaxed">{q.solution.explanation}</p>
                    </div>

                    {/* Key concepts */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-white/30">Concepts tested:</span>
                      {q.solution.concepts.map((c) => (
                        <span key={c} className="text-[10px] text-violet-400/80 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href={`/dashboard/assessments/${id}`}
          className="flex-1 min-w-[140px] text-center border border-white/10 hover:border-white/20 text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold transition-all">
          Retry (new questions)
        </Link>
        <Link href="/dashboard/assessments"
          className="flex-1 min-w-[140px] text-center bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-xl text-sm font-bold transition-all">
          All Assessments
        </Link>
        <button
          onClick={handleAskTutor}
          className="flex-1 min-w-[140px] text-center bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 py-3 rounded-xl text-sm font-semibold transition-all">
          Ask AI Tutor
        </button>
      </div>
    </div>
  );
}
