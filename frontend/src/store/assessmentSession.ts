import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BankQuestion } from "@/data/questionBank";

interface SessionAnswer {
  questionId: string;
  answer: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

interface AssessmentSession {
  templateId: string;
  questions: BankQuestion[];
  answers: SessionAnswer[];
  startedAt: string;
  completedAt?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
}

interface Store {
  sessions: Record<string, AssessmentSession>; // keyed by templateId
  setSession(templateId: string, questions: BankQuestion[]): void;
  getSession(templateId: string): AssessmentSession | undefined;
  saveAnswer(templateId: string, answer: SessionAnswer): void;
  completeSession(templateId: string, totalScore: number, maxScore: number): void;
  clearSession(templateId: string): void;
}

export const useSessionStore = create<Store>()(
  persist(
    (set, get) => ({
      sessions: {},

      setSession(templateId, questions) {
        set((s) => ({
          sessions: {
            ...s.sessions,
            [templateId]: {
              templateId,
              questions,
              answers: [],
              startedAt: new Date().toISOString(),
              totalScore: 0,
              maxScore: questions.reduce((sum, q) => sum + q.points, 0),
              percentage: 0,
            },
          },
        }));
      },

      getSession(templateId) {
        return get().sessions[templateId];
      },

      saveAnswer(templateId, answer) {
        set((s) => {
          const session = s.sessions[templateId];
          if (!session) return s;
          const existing = session.answers.filter((a) => a.questionId !== answer.questionId);
          return {
            sessions: {
              ...s.sessions,
              [templateId]: { ...session, answers: [...existing, answer] },
            },
          };
        });
      },

      completeSession(templateId, totalScore, maxScore) {
        set((s) => {
          const session = s.sessions[templateId];
          if (!session) return s;
          return {
            sessions: {
              ...s.sessions,
              [templateId]: {
                ...session,
                completedAt: new Date().toISOString(),
                totalScore,
                maxScore,
                percentage: Math.round((totalScore / maxScore) * 100),
              },
            },
          };
        });
      },

      clearSession(templateId) {
        set((s) => {
          const { [templateId]: _, ...rest } = s.sessions;
          return { sessions: rest };
        });
      },
    }),
    { name: "daqs-assessment-sessions" }
  )
);
