import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userScopedStorage } from "@/lib/userScopedStorage";
import { api } from "@/lib/api";

export interface Certificate {
  id: string;           // server verification_code, e.g. DAQS-2026-XXXXXXXXXX
  courseId: string;
  courseName: string;
  courseTrack: string;
  courseIcon: string;
  difficulty: string;
  studentName: string;
  studentEmail: string;
  issuedAt: string;     // ISO date string
}

interface ServerCertificate {
  verification_code: string;
  course_id: string;
  course_name: string;
  course_track: string;
  difficulty: string;
  student_name: string;
  issued_at: string;
}

interface Store {
  certificates: Certificate[];
  hydrated: boolean;
  hydrate(courseIcons: Record<string, string>, studentEmail: string): Promise<void>;
  hasCertificate(courseId: string): boolean;
  getCertificate(courseId: string): Certificate | undefined;
  getCertificateById(id: string): Certificate | undefined;
}

export const useCertificates = create<Store>()(
  persist(
    (set, get) => ({
      certificates: [],
      hydrated: false,

      // Certificates are now issued server-side only (see
      // POST /records/courses/{id}/lessons/{lessonId}/complete on the
      // backend), triggered automatically at 100% lesson completion. This
      // just pulls the authoritative list down; localStorage is kept as an
      // offline-first cache, not the source of truth.
      async hydrate(courseIcons, studentEmail) {
        try {
          const certs = await api.get<ServerCertificate[]>("/certificates/mine");
          set({
            certificates: certs.map((c) => ({
              id: c.verification_code,
              courseId: c.course_id,
              courseName: c.course_name,
              courseTrack: c.course_track,
              courseIcon: courseIcons[c.course_id] ?? "🏆",
              difficulty: c.difficulty,
              studentName: c.student_name,
              studentEmail,
              issuedAt: c.issued_at,
            })),
            hydrated: true,
          });
        } catch {
          // Network/backend unavailable — keep whatever's cached locally.
        }
      },

      hasCertificate(courseId) {
        return get().certificates.some((c) => c.courseId === courseId);
      },

      getCertificate(courseId) {
        return get().certificates.find((c) => c.courseId === courseId);
      },

      getCertificateById(id) {
        return get().certificates.find((c) => c.id === id);
      },
    }),
    { name: "daqs-certificates", storage: userScopedStorage(), partialize: (s) => ({ certificates: s.certificates }) }
  )
);
