import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userScopedStorage } from "@/lib/userScopedStorage";
import { api } from "@/lib/api";

interface CourseProgress {
  courseId: string;
  enrolledAt: string;
  completedLessons: string[]; // lesson IDs
  completedModules: string[]; // module IDs
  completedAt?: string;
  lastLessonId?: string;
  lastModuleId?: string;
}

type PendingSync =
  | { type: "enroll"; courseId: string }
  | { type: "lesson"; courseId: string; lessonId: string; moduleId: string };

interface Store {
  progress: Record<string, CourseProgress>; // keyed by courseId
  pendingSync: PendingSync[];
  enrol(courseId: string): void;
  unenrol(courseId: string): void;
  isEnrolled(courseId: string): boolean;
  completeLesson(courseId: string, lessonId: string, moduleId: string, totalModuleLessons: number): void;
  isLessonComplete(courseId: string, lessonId: string): boolean;
  getCourseProgress(courseId: string): CourseProgress | undefined;
  getProgressPercent(courseId: string, totalLessons: number): number;
  setLastPosition(courseId: string, lessonId: string, moduleId: string): void;
  flushPendingSync(): void;
}

// Local state updates instantly and works offline (the pre-existing
// Firebase-fallback login path means the backend is sometimes genuinely
// unreachable) — the backend calls below are fire-and-forget best-effort
// mirrors, not the source of truth for the UI. Failures queue into
// pendingSync and get retried by flushPendingSync().
function syncEnroll(courseId: string, onFail: () => void) {
  api.post(`/records/courses/${courseId}/enroll`, {}).catch(onFail);
}

function syncLessonComplete(courseId: string, lessonId: string, moduleId: string, onFail: () => void) {
  api.post(`/records/courses/${courseId}/lessons/${lessonId}/complete`, { module_id: moduleId }).catch(onFail);
}

export const useCourseProgress = create<Store>()(
  persist(
    (set, get) => ({
      progress: {},
      pendingSync: [],

      enrol(courseId) {
        if (get().progress[courseId]) return;
        set((s) => ({
          progress: {
            ...s.progress,
            [courseId]: {
              courseId,
              enrolledAt: new Date().toISOString(),
              completedLessons: [],
              completedModules: [],
            },
          },
        }));
        syncEnroll(courseId, () => {
          set((s) => ({ pendingSync: [...s.pendingSync, { type: "enroll", courseId }] }));
        });
      },

      unenrol(courseId) {
        set((s) => {
          const { [courseId]: _, ...rest } = s.progress;
          return { progress: rest };
        });
      },

      isEnrolled(courseId) {
        return !!get().progress[courseId];
      },

      completeLesson(courseId, lessonId, moduleId, totalModuleLessons) {
        set((s) => {
          const cp = s.progress[courseId];
          if (!cp) return s;
          const completedLessons = cp.completedLessons.includes(lessonId)
            ? cp.completedLessons
            : [...cp.completedLessons, lessonId];

          // Check if all module lessons are done
          const moduleCompletedCount = completedLessons.filter((lid) =>
            lid.startsWith(moduleId)
          ).length;
          const completedModules =
            moduleCompletedCount >= totalModuleLessons && !cp.completedModules.includes(moduleId)
              ? [...cp.completedModules, moduleId]
              : cp.completedModules;

          return {
            progress: {
              ...s.progress,
              [courseId]: {
                ...cp,
                completedLessons,
                completedModules,
                lastLessonId: lessonId,
                lastModuleId: moduleId,
              },
            },
          };
        });
        syncLessonComplete(courseId, lessonId, moduleId, () => {
          set((s) => ({ pendingSync: [...s.pendingSync, { type: "lesson", courseId, lessonId, moduleId }] }));
        });
      },

      isLessonComplete(courseId, lessonId) {
        return get().progress[courseId]?.completedLessons.includes(lessonId) ?? false;
      },

      getCourseProgress(courseId) {
        return get().progress[courseId];
      },

      getProgressPercent(courseId, totalLessons) {
        if (totalLessons === 0) return 0;
        const cp = get().progress[courseId];
        if (!cp) return 0;
        return Math.round((cp.completedLessons.length / totalLessons) * 100);
      },

      setLastPosition(courseId, lessonId, moduleId) {
        set((s) => {
          const cp = s.progress[courseId];
          if (!cp) return s;
          return {
            progress: {
              ...s.progress,
              [courseId]: { ...cp, lastLessonId: lessonId, lastModuleId: moduleId },
            },
          };
        });
      },

      flushPendingSync() {
        const pending = get().pendingSync;
        if (pending.length === 0) return;
        set({ pendingSync: [] });
        for (const item of pending) {
          if (item.type === "enroll") {
            syncEnroll(item.courseId, () => {
              set((s) => ({ pendingSync: [...s.pendingSync, item] }));
            });
          } else {
            syncLessonComplete(item.courseId, item.lessonId, item.moduleId, () => {
              set((s) => ({ pendingSync: [...s.pendingSync, item] }));
            });
          }
        }
      },
    }),
    { name: "daqs-course-progress", storage: userScopedStorage() }
  )
);
