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
  getItem: (name) => {
    const scopedKey = `${name}::${currentUserSuffix()}`;
    const existing = window.localStorage.getItem(scopedKey);
    if (existing !== null) return existing;

    // One-time migration for accounts that used this app before storage
    // became per-user: whoever is logged in the first time each store is
    // read after this update inherits the old shared data instead of
    // appearing to have lost it. The legacy key is deleted immediately
    // after, so it can only ever migrate to one account, not leak forward
    // into the next different account that logs into this browser.
    const legacy = window.localStorage.getItem(name);
    if (legacy !== null) {
      window.localStorage.setItem(scopedKey, legacy);
      window.localStorage.removeItem(name);
      return legacy;
    }
    return null;
  },
  setItem: (name, value) => window.localStorage.setItem(`${name}::${currentUserSuffix()}`, value),
  removeItem: (name) => window.localStorage.removeItem(`${name}::${currentUserSuffix()}`),
};

/** Pass as the `storage` option to zustand's `persist()` for any per-student store. */
export const userScopedStorage = () => createJSONStorage(() => scopedStateStorage);
