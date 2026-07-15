import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userScopedStorage } from "@/lib/userScopedStorage";

export interface NoteMessage {
  role: "user" | "assistant";
  content: string;
  type?: "question_prompt";
  questionMeta?: {
    number: number;
    total: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    earned: number;
    max: number;
    qType: string;
    difficulty: string;
    fullMark: boolean;
  };
}

export type NoteSource = "assessment" | "general";

export interface TutorNote {
  id: string;
  title: string;
  source: NoteSource;
  sourceId: string;
  subject: string;
  moduleLabel: string;
  messages: NoteMessage[];
  percentage?: number;
  savedAt: string;
  pinned: boolean;
}

interface TutorNotesState {
  notes: TutorNote[];
  upsertNote: (note: Omit<TutorNote, "savedAt">) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useTutorNotes = create<TutorNotesState>()(
  persist(
    (set) => ({
      notes: [],

      upsertNote: (note) =>
        set((s) => {
          const exists = s.notes.find((n) => n.id === note.id);
          const updated: TutorNote = { ...note, savedAt: new Date().toISOString() };
          if (exists) {
            return { notes: s.notes.map((n) => (n.id === note.id ? updated : n)) };
          }
          return { notes: [updated, ...s.notes] };
        }),

      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      togglePin: (id) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
        })),
    }),
    { name: "daqs-tutor-notes", storage: userScopedStorage() }
  )
);
