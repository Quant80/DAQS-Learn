import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userScopedStorage } from "@/lib/userScopedStorage";

export interface Certificate {
  id: string;           // DAQS-2025-XXXXX
  courseId: string;
  courseName: string;
  courseTrack: string;
  courseIcon: string;
  difficulty: string;
  studentName: string;
  studentEmail: string;
  issuedAt: string;     // ISO date string
}

interface Store {
  certificates: Certificate[];
  issue(cert: Omit<Certificate, "id" | "issuedAt">): Certificate;
  hasCertificate(courseId: string): boolean;
  getCertificate(courseId: string): Certificate | undefined;
  getCertificateById(id: string): Certificate | undefined;
}

function generateId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DAQS-${year}-${rand}`;
}

export const useCertificates = create<Store>()(
  persist(
    (set, get) => ({
      certificates: [],

      issue(cert) {
        const existing = get().certificates.find((c) => c.courseId === cert.courseId);
        if (existing) return existing;

        const newCert: Certificate = {
          ...cert,
          id: generateId(),
          issuedAt: new Date().toISOString(),
        };
        set((s) => ({ certificates: [...s.certificates, newCert] }));
        return newCert;
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
    { name: "daqs-certificates", storage: userScopedStorage() }
  )
);
