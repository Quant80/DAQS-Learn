import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userScopedStorage } from "@/lib/userScopedStorage";

interface CourseProgress {
  courseId: string;
  enrolledAt: string;
  completedLessons: string[]; // lesson IDs
  completedModules: string[]; // module IDs
  completedAt?: string;
  lastLessonId?: string;
  lastModuleId?: string;
}

interface Store {
  progress: Record<string, CourseProgress>; // keyed by courseId
  enrol(courseId: string): void;
  unenrol(courseId: string): void;
  isEnrolled(courseId: string): boolean;
  completeLesson(courseId: string, lessonId: string, moduleId: string, totalModuleLessons: number): void;
  isLessonComplete(courseId: string, lessonId: string): boolean;
  getCourseProgress(courseId: string): CourseProgress | undefined;
  getProgressPercent(courseId: string, totalLessons: number): number;
  setLastPosition(courseId: string, lessonId: string, moduleId: string): void;
}

export const useCourseProgress = create<Store>()(
  persist(
    (set, get) => ({
      progress: {},

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
    }),
    { name: "daqs-course-progress", storage: userScopedStorage() }
  )
);
