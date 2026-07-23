import { api } from "@/lib/api";
import { useSubscription, type Plan } from "@/store/subscription";

/**
 * Pulls the authoritative plan (free/pro/team) from the backend and mirrors
 * it into the local subscription store, so admin-granted or paid plans are
 * reflected everywhere that already reads useSubscription (course gating,
 * "Pro" badges, etc.) without needing to touch that existing logic.
 *
 * Only call this right after a real backend login succeeds — it silently
 * no-ops on failure, since the id:0 Firebase-only fallback path has no
 * valid backend session for /users/me to authenticate against.
 */
export async function syncPlanFromServer() {
  try {
    const me = await api.get<{ plan: Plan; python_promo_granted: boolean; unlocked_course_ids: string[] }>("/users/me");
    useSubscription.getState().setSubscription({ plan: me.plan, status: "active" });
    useSubscription.getState().setPythonPromoGranted(me.python_promo_granted);
    useSubscription.getState().setUnlockedCourseIds(me.unlocked_course_ids ?? []);
  } catch {
    // Backend unreachable or session invalid — leave the local plan as-is.
  }
}
