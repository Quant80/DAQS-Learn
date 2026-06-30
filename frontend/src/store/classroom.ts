import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ClassroomRole = "host" | "student";
export type ClassStatus = "scheduled" | "live" | "ended";

export interface ClassSession {
  id: string;
  title: string;
  description?: string;
  hostName: string;
  hostEmail: string;
  scheduledAt: string;     // ISO
  durationMins: number;
  status: ClassStatus;
  roomId: string;          // used in Jitsi URL: meet.jit.si/DAQS-{roomId}
  track?: string;
  maxParticipants?: number;
  startedAt?: string;
  endedAt?: string;
  participantCount?: number;
}

function makeId(len = 8) {
  return Math.random().toString(36).slice(2, 2 + len).toUpperCase();
}

function makeRoomId(title: string) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug}-${makeId(4)}`;
}

interface ClassroomStore {
  sessions: ClassSession[];
  activeSessionId: string | null;

  scheduleClass(params: {
    title: string;
    description?: string;
    hostName: string;
    hostEmail: string;
    scheduledAt: string;
    durationMins: number;
    track?: string;
    maxParticipants?: number;
  }): ClassSession;

  startClass(id: string): void;
  endClass(id: string, participantCount?: number): void;
  deleteSession(id: string): void;
  joinClass(id: string): void;
  leaveClass(): void;

  getUpcoming(): ClassSession[];
  getLive(): ClassSession[];
  getPast(): ClassSession[];
  getActiveSession(): ClassSession | null;
}

export const useClassroom = create<ClassroomStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      scheduleClass(params) {
        const session: ClassSession = {
          id: makeId(),
          roomId: makeRoomId(params.title),
          status: "scheduled",
          ...params,
        };
        set((s) => ({ sessions: [...s.sessions, session] }));
        return session;
      },

      startClass(id) {
        set((s) => ({
          sessions: s.sessions.map((c) =>
            c.id === id ? { ...c, status: "live", startedAt: new Date().toISOString() } : c
          ),
          activeSessionId: id,
        }));
      },

      endClass(id, participantCount) {
        set((s) => ({
          sessions: s.sessions.map((c) =>
            c.id === id ? { ...c, status: "ended", endedAt: new Date().toISOString(), participantCount } : c
          ),
          activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        }));
      },

      deleteSession(id) {
        set((s) => ({
          sessions: s.sessions.filter((c) => c.id !== id),
          activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        }));
      },

      joinClass(id) {
        set({ activeSessionId: id });
      },

      leaveClass() {
        set({ activeSessionId: null });
      },

      getUpcoming() {
        return get().sessions.filter((c) => c.status === "scheduled").sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
      },

      getLive() {
        return get().sessions.filter((c) => c.status === "live");
      },

      getPast() {
        return get().sessions.filter((c) => c.status === "ended").sort((a, b) => b.endedAt!.localeCompare(a.endedAt!));
      },

      getActiveSession() {
        const { sessions, activeSessionId } = get();
        return sessions.find((c) => c.id === activeSessionId) ?? null;
      },
    }),
    { name: "daqs-classroom" }
  )
);
