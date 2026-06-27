import { create } from "zustand";

export interface AnswerResult {
  questionId: string;
  question: string;
  userAnswer: string;
  score: number;
  maxPoints: number;
  feedback: string;
  correct?: boolean;
}

export interface AssessmentResult {
  assessmentId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  answers: AnswerResult[];
  completedAt: string;
  timeTaken?: number;
}

interface ResultsStore {
  results: Record<string, AssessmentResult>;
  setResult: (result: AssessmentResult) => void;
  getResult: (id: string) => AssessmentResult | undefined;
}

export const useResultsStore = create<ResultsStore>((set, get) => ({
  results: {},
  setResult: (result) =>
    set((s) => ({ results: { ...s.results, [result.assessmentId]: result } })),
  getResult: (id) => get().results[id],
}));
