"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTemplate, difficultyColors } from "@/data/assessmentTemplates";
import { getRandomQuestions } from "@/data/questionBank";
import type { BankQuestion } from "@/data/questionBank";
import { useSessionStore } from "@/store/assessmentSession";
import { useLearningProfile } from "@/store/learningProfile";
import { api } from "@/lib/api";

export default function TakeAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const template = getTemplate(id);
  const { setSession, getSession, saveAnswer, completeSession } = useSessionStore();
  const recordAssessment = useLearningProfile((s) => s.recordAssessment);

  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function startAssessment() {
    if (!template) return;
    const randomQs = getRandomQuestions(template.subject, template.difficulty, template.questionCount);
    setQuestions(randomQs);
    setSession(id, randomQs);
    setTimeLeft(template.timeLimit * 60);
    setStarted(true);
  }

  const handleSubmit = useCallback(async () => {
    if (!template || submitting || !questions.length) return;
    setSubmitting(true);

    let totalScore = 0;
    const maxScore = questions.reduce((s, q) => s + q.points, 0);
    const attemptAnswers: { question_id: string; answer: string; score: number; max_score: number }[] = [];

    for (const q of questions) {
      const userAnswer = answers[q.id] ?? "";

      if (q.type === "mcq") {
        const selectedIdx = parseInt(userAnswer);
        const correct = !isNaN(selectedIdx) && selectedIdx === q.correct;
        const pts = correct ? q.points : 0;
        totalScore += pts;
        saveAnswer(id, { questionId: q.id, answer: userAnswer, score: pts, maxScore: q.points });
        attemptAnswers.push({ question_id: q.id, answer: userAnswer, score: pts, max_score: q.points });
      } else {
        if (!userAnswer.trim()) {
          saveAnswer(id, { questionId: q.id, answer: "", score: 0, maxScore: q.points });
          attemptAnswers.push({ question_id: q.id, answer: "", score: 0, max_score: q.points });
          continue;
        }
        try {
          const res = await fetch("/api/assessments/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: q.question,
              answer: userAnswer,
              type: q.type,
              maxPoints: q.points,
            }),
          });
          const { score, feedback } = await res.json();
          totalScore += score;
          saveAnswer(id, { questionId: q.id, answer: userAnswer, score, maxScore: q.points, feedback });
          attemptAnswers.push({ question_id: q.id, answer: userAnswer, score, max_score: q.points });
        } catch {
          saveAnswer(id, { questionId: q.id, answer: userAnswer, score: 0, maxScore: q.points, feedback: "Marking error" });
          attemptAnswers.push({ question_id: q.id, answer: userAnswer, score: 0, max_score: q.points });
        }
      }
    }

    completeSession(id, totalScore, maxScore);
    const pct = Math.round((totalScore / maxScore) * 100);
    recordAssessment(template.subject, pct, totalScore, maxScore);

    const startedAt = getSession(id)?.startedAt ?? new Date().toISOString();
    api.post(`/records/assessments/${id}/attempts`, { started_at: startedAt, answers: attemptAnswers }).catch(() => {
      // Best-effort — the local session/learningProfile records above are
      // already saved regardless, this just mirrors the attempt server-side.
    });

    router.push(`/dashboard/assessments/${id}/results`);
  }, [template, submitting, questions, answers, id, saveAnswer, completeSession, recordAssessment, router, getSession]);

  useEffect(() => {
    if (!started || timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, started, handleSubmit]);

  if (!template) return <div className="p-8 text-white/50">Assessment not found.</div>;

  const c = difficultyColors[template.difficulty];
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!started) {
    const session = getSession(id);
    const prevScore = session?.completedAt ? session.percentage : null;
    return (
      <div className="p-6 lg:p-8 max-w-2xl">
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 text-center space-y-6">
          <div className={`w-16 h-16 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center text-3xl mx-auto`}>
            {template.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{template.title}</h1>
            <p className="text-white/50 text-sm mt-2">{template.description}</p>
          </div>

          {prevScore !== null && (
            <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
              <p className="text-white/50 text-xs">Your previous score: <span className={`font-bold ${prevScore >= 80 ? "text-emerald-400" : prevScore >= 50 ? "text-amber-400" : "text-red-400"}`}>{prevScore}%</span></p>
              <p className="text-white/30 text-xs mt-0.5">Questions are randomised — this will be a fresh attempt</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Questions", value: template.questionCount },
              { label: "Time Limit", value: `${template.timeLimit} min` },
              { label: "Difficulty", value: template.difficulty },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3">
                <div className="text-base font-bold text-white capitalize">{s.value}</div>
                <div className="text-white/40 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {template.tags.map((tag) => (
              <span key={tag} className="text-xs text-white/40 bg-white/5 border border-white/8 rounded-full px-3 py-1">{tag}</span>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-left">
            <p className="text-amber-300/80 text-xs leading-relaxed">
              🔀 <strong>Questions are randomised</strong> from our large question bank — you will get a different set each time you attempt this assessment. Solutions are unlocked after submission.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={startAssessment}
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-all text-sm"
            >
              {prevScore !== null ? "Retake Assessment" : "Start Assessment"}
            </button>
            <button
              onClick={() => router.back()}
              className="w-full border border-white/10 text-white/50 hover:text-white hover:border-white/20 py-3 rounded-xl transition-all text-sm"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return null;
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-[#060d1a] shrink-0">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/60 text-xs">{template.title} · Question {current + 1} of {questions.length}</span>
            {timeLeft !== null && (
              <span className={`text-xs font-mono font-bold ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-white/60"}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            )}
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="shrink-0 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
        >
          {submitting ? "Marking…" : "Submit All"}
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold border rounded-full px-2.5 py-1 capitalize ${c.bg} ${c.border} ${c.text}`}>{q.difficulty}</span>
            <span className="text-xs text-white/35 border border-white/10 rounded-full px-2.5 py-1 capitalize">{q.type.replace("_", " ")}</span>
            <span className="text-xs text-white/35">{q.points} pts</span>
          </div>

          <h2 className="text-lg font-semibold text-white leading-relaxed">{q.question}</h2>

          {/* MCQ */}
          {q.type === "mcq" && q.options && (
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: String(i) }))}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm transition-all ${
                    answers[q.id] === String(i)
                      ? "border-sky-500 bg-sky-500/10 text-white"
                      : "border-white/10 hover:border-white/25 hover:bg-white/5 text-white/75"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border shrink-0 flex items-center justify-center text-xs font-bold ${
                    answers[q.id] === String(i) ? "border-sky-500 bg-sky-500 text-white" : "border-white/20 text-white/40"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Short answer */}
          {q.type === "short_answer" && (
            <textarea
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              placeholder="Write your answer here…"
              rows={7}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-sky-500/50 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none focus:outline-none transition-all leading-relaxed"
            />
          )}

          {/* Code */}
          {q.type === "code" && (
            <div className="bg-[#0a1628] border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/8 bg-white/[0.02]">
                <span className="text-[10px] text-white/30 font-mono">python</span>
                <span className="text-[10px] text-white/20">Write your solution below</span>
              </div>
              <textarea
                value={answers[q.id] ?? (q.starter_code ?? "")}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                rows={14}
                spellCheck={false}
                className="w-full bg-transparent text-emerald-300 text-xs font-mono px-4 py-3 resize-none focus:outline-none leading-relaxed"
              />
            </div>
          )}

          {/* Hint */}
          {q.hint && (
            <div>
              <button
                onClick={() => setShowHint((s) => !s)}
                className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                <span>💡</span>{showHint ? "Hide hint" : "Show hint (–5% on this question)"}
              </button>
              {showHint && (
                <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-300/80">
                  {q.hint}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="shrink-0 px-6 py-4 border-t border-white/8 bg-[#060d1a]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => { setCurrent((c) => c - 1); setShowHint(false); }}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 text-sm transition-all"
          >
            ← Previous
          </button>

          <div className="flex gap-1.5 flex-wrap justify-center">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setShowHint(false); }}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                  i === current ? "bg-sky-500 text-white" :
                  answers[questions[i].id]?.trim() ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                  "bg-white/5 text-white/40 border border-white/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button
              onClick={() => { setCurrent((c) => c + 1); setShowHint(false); }}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-bold transition-all"
            >
              {submitting ? "Marking…" : "Submit ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
