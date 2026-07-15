import { createJSONStorage, type StateStorage } from "zustand/middleware";

/**
 * Every other persisted store keys its localStorage entry off of a fixed
 * string name, shared by every account that ever logs into this browser.
 * `user.id` isn't safe to key off instead — the Firebase-fallback login path
 * hardcodes `id: 0` for every user when the backend token exchange fails, so
 * accounts would still collide. Email is always present and unique on both
 * login paths, so it's what we scope on.
 */
function currentUserSuffix(): string {
  if (typeof window === "undefined") return "anon";
  try {
    const raw = window.localStorage.getItem("daqs-auth");
    if (!raw) return "anon";
    const email = JSON.parse(raw)?.state?.user?.email;
    return email ? String(email).toLowerCase() : "anon";
  } catch {
    return "anon";
  }
}

const scopedStateStorage: StateStorage = {
  getItem: (name) => window.localStorage.getItem(`${name}::${currentUserSuffix()}`),
  setItem: (name, value) => window.localStorage.setItem(`${name}::${currentUserSuffix()}`, value),
  removeItem: (name) => window.localStorage.removeItem(`${name}::${currentUserSuffix()}`),
};

/** Pass as the `storage` option to zustand's `persist()` for any per-student store. */
export const userScopedStorage = () => createJSONStorage(() => scopedStateStorage);
