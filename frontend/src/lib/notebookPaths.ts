/**
 * The Jupyter server backing "Notebook" is one shared instance for the whole
 * platform (single container, single volume, single token) — there is no
 * per-user server. Every user's files must live under their own
 * subdirectory of that shared filesystem or they collide with, and can
 * overwrite, every other student's work.
 *
 * Scoped by email (not user.id) — the Firebase-fallback login path
 * hardcodes id: 0 for every account when the backend token exchange fails,
 * so id can't be trusted as a unique key. Email is always present and
 * unique on both login paths.
 */
export function sanitizeUserKey(email: string): string {
  const cleaned = email.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "_");
  return cleaned || "anon";
}

export function userWorkspaceDir(email: string): string {
  return `users/${sanitizeUserKey(email)}`;
}
