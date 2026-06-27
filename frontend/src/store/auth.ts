import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: "student" | "lecturer" | "admin" | "company" | "parent";
  avatar_url?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("daqs_token", token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem("daqs_token");
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: "daqs-auth" }
  )
);
