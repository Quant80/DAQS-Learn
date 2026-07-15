import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userScopedStorage } from "@/lib/userScopedStorage";

export interface SubjectStats {
  attempts: number;
  totalScore: number;
  maxScore: number;
  scores: number[]; // percentage per attempt
  lastAttempt: string;
}

export interface TutorTopic {
  subject: string;
  count: number;
  lastAsked: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  minutesActive: number;
  assessmentsCompleted: number;
  tutorMessages: number;
}

const ALL_ACHIEVEMENTS = [
  { id: "first_assessment", title: "First Step", description: "Completed your first assessment", icon: "🎯" },
  { id: "five_assessments", title: "Bookworm", description: "Completed 5 assessments", icon: "📚" },
  { id: "perfect_score", title: "Perfect Score", description: "Scored 100% on an assessment", icon: "⭐" },
  { id: "high_achiever", title: "High Achiever", description: "Averaged above 80% across assessments", icon: "🏆" },
  { id: "ai_explorer", title: "AI Explorer", description: "Had 10+ conversations with the AI Tutor", icon: "🤖" },
  { id: "streak_3", title: "On Fire", description: "3-day learning streak", icon: "🔥" },
  { id: "streak_7", title: "Week Warrior", description: "7-day learning streak", icon: "⚡" },
  { id: "all_rounder", title: "All-Rounder", description: "Completed assessments in 3+ subjects", icon: "🌟" },
  { id: "tutor_power", title: "Tutor Power", description: "Sent 50+ messages to the AI Tutor", icon: "💡" },
];

interface LearningProfileState {
  subjectStats: Record<string, SubjectStats>;
  tutorTopics: Record<string, TutorTopic>;
  achievements: Achievement[];
  dailyActivity: DailyActivity[];
  totalTutorMessages: number;
  goalMinutesPerDay: number;
  streak: number;
  lastActiveDate: string;

  recordAssessment: (subject: string, percentage: number, totalScore: number, maxScore: number) => void;
  recordTutorMessage: (subject: string) => void;
  setDailyGoal: (minutes: number) => void;
  addActivity: (minutes: number) => void;
  getAverageScore: () => number;
  getTodayActivity: () => DailyActivity | undefined;
  unlockAchievement: (id: string) => void;
  checkAndUnlockAchievements: () => void;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function detectSubject(message: string): string {
  const m = message.toLowerCase();
  if (m.match(/python|def |import |pandas|numpy|list|dict|loop|function|class/)) return "Python";
  if (m.match(/javascript|typescript|react|html|css|dom|node|npm/)) return "Web Development";
  if (m.match(/sql|database|query|join|table|postgres|mongo/)) return "Databases";
  if (m.match(/machine learning|neural|model|dataset|regression|classification|sklearn/)) return "Machine Learning";
  if (m.match(/data science|statistics|mean|median|variance|distribution|probability/)) return "Data Science";
  if (m.match(/math|algebra|calculus|equation|matrix|vector|derivative|integral/)) return "Mathematics";
  if (m.match(/algorithm|big o|sort|search|tree|graph|complexity/)) return "Algorithms";
  return "General";
}

export const detectSubjectFromMessage = detectSubject;

export const useLearningProfile = create<LearningProfileState>()(
  persist(
    (set, get) => ({
      subjectStats: {},
      tutorTopics: {},
      achievements: [],
      dailyActivity: [],
      totalTutorMessages: 0,
      goalMinutesPerDay: 30,
      streak: 0,
      lastActiveDate: "",

      recordAssessment: (subject, percentage, totalScore, maxScore) => {
        set((s) => {
          const existing = s.subjectStats[subject] ?? { attempts: 0, totalScore: 0, maxScore: 0, scores: [], lastAttempt: "" };
          const updated: SubjectStats = {
            attempts: existing.attempts + 1,
            totalScore: existing.totalScore + totalScore,
            maxScore: existing.maxScore + maxScore,
            scores: [...existing.scores, percentage],
            lastAttempt: new Date().toISOString(),
          };

          const todayStr = today();
          const todayIdx = s.dailyActivity.findIndex((d) => d.date === todayStr);
          const activity = todayIdx >= 0
            ? s.dailyActivity.map((d, i) => i === todayIdx ? { ...d, assessmentsCompleted: d.assessmentsCompleted + 1 } : d)
            : [...s.dailyActivity, { date: todayStr, minutesActive: 0, assessmentsCompleted: 1, tutorMessages: 0 }];

          const lastDate = s.lastActiveDate;
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
          const newStreak = lastDate === yesterdayStr || lastDate === todayStr
            ? lastDate === todayStr ? s.streak : s.streak + 1
            : 1;

          return {
            subjectStats: { ...s.subjectStats, [subject]: updated },
            dailyActivity: activity,
            streak: newStreak,
            lastActiveDate: todayStr,
          };
        });
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      recordTutorMessage: (messageText: string) => {
        const subject = detectSubject(messageText);
        set((s) => {
          const existing = s.tutorTopics[subject] ?? { subject, count: 0, lastAsked: "" };
          const todayStr = today();
          const todayIdx = s.dailyActivity.findIndex((d) => d.date === todayStr);
          const activity = todayIdx >= 0
            ? s.dailyActivity.map((d, i) => i === todayIdx ? { ...d, tutorMessages: d.tutorMessages + 1 } : d)
            : [...s.dailyActivity, { date: todayStr, minutesActive: 0, assessmentsCompleted: 0, tutorMessages: 1 }];
          return {
            tutorTopics: { ...s.tutorTopics, [subject]: { ...existing, count: existing.count + 1, lastAsked: new Date().toISOString() } },
            totalTutorMessages: s.totalTutorMessages + 1,
            dailyActivity: activity,
            lastActiveDate: todayStr,
          };
        });
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      setDailyGoal: (minutes) => set({ goalMinutesPerDay: minutes }),

      addActivity: (minutes) => {
        set((s) => {
          const todayStr = today();
          const todayIdx = s.dailyActivity.findIndex((d) => d.date === todayStr);
          const activity = todayIdx >= 0
            ? s.dailyActivity.map((d, i) => i === todayIdx ? { ...d, minutesActive: d.minutesActive + minutes } : d)
            : [...s.dailyActivity, { date: todayStr, minutesActive: minutes, assessmentsCompleted: 0, tutorMessages: 0 }];
          return { dailyActivity: activity };
        });
      },

      getAverageScore: () => {
        const stats = Object.values(get().subjectStats);
        if (!stats.length) return 0;
        const allScores = stats.flatMap((s) => s.scores);
        return allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
      },

      getTodayActivity: () => get().dailyActivity.find((d) => d.date === today()),

      unlockAchievement: (id) => {
        set((s) => {
          if (s.achievements.find((a) => a.id === id)) return s;
          const def = ALL_ACHIEVEMENTS.find((a) => a.id === id);
          if (!def) return s;
          return { achievements: [...s.achievements, { ...def, earnedAt: new Date().toISOString() }] };
        });
      },

      checkAndUnlockAchievements: () => {
        const { subjectStats, totalTutorMessages, achievements, streak, unlockAchievement, getAverageScore } = get();
        const earned = new Set(achievements.map((a) => a.id));
        const totalAssessments = Object.values(subjectStats).reduce((s, v) => s + v.attempts, 0);
        const allScores = Object.values(subjectStats).flatMap((v) => v.scores);
        const subjects = Object.keys(subjectStats).length;

        if (!earned.has("first_assessment") && totalAssessments >= 1) unlockAchievement("first_assessment");
        if (!earned.has("five_assessments") && totalAssessments >= 5) unlockAchievement("five_assessments");
        if (!earned.has("perfect_score") && allScores.includes(100)) unlockAchievement("perfect_score");
        if (!earned.has("high_achiever") && getAverageScore() >= 80 && totalAssessments >= 3) unlockAchievement("high_achiever");
        if (!earned.has("ai_explorer") && totalTutorMessages >= 10) unlockAchievement("ai_explorer");
        if (!earned.has("tutor_power") && totalTutorMessages >= 50) unlockAchievement("tutor_power");
        if (!earned.has("streak_3") && streak >= 3) unlockAchievement("streak_3");
        if (!earned.has("streak_7") && streak >= 7) unlockAchievement("streak_7");
        if (!earned.has("all_rounder") && subjects >= 3) unlockAchievement("all_rounder");
      },
    }),
    { name: "daqs-learning-profile", storage: userScopedStorage() }
  )
);
