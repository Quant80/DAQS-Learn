/**
 * Python course access tiers — shared between client code (store/subscription.ts)
 * and server-side Next.js route handlers (api/notebooks/ensure-workspace), so
 * kept free of any browser-only dependency (no zustand/localStorage imports).
 * Mirrors backend/app/services/promo.py's PYTHON_PROMO_COURSE_IDS.
 */

// Free for the first 100 sign-ups, or with a Pro/Team plan.
export const PYTHON_PROMO_COURSE_IDS = ["python-fundamentals", "python-intermediate"];

// Pro/Team plan only — no promo path.
export const PYTHON_PRO_ONLY_COURSE_IDS = ["python-advanced"];

export function isPlanProOrTeam(plan: string, planExpiresAt: string | null | undefined): boolean {
  if (plan === "free") return false;
  if (planExpiresAt && new Date(planExpiresAt) < new Date()) return false;
  return true;
}

/** Server-safe mirror of store/subscription.ts's canAccessCourse — takes
 * plan state as plain values (from the backend's /users/me) instead of
 * reading the zustand store, so it works in Next.js route handlers too. */
export function canAccessPythonCourse(
  courseId: string,
  opts: { plan: string; planExpiresAt?: string | null; pythonPromoGranted: boolean }
): boolean {
  const isPro = isPlanProOrTeam(opts.plan, opts.planExpiresAt);
  if (PYTHON_PRO_ONLY_COURSE_IDS.includes(courseId)) return isPro;
  if (!PYTHON_PROMO_COURSE_IDS.includes(courseId)) return true;
  return isPro || opts.pythonPromoGranted;
}
