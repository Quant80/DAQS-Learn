import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userScopedStorage } from "@/lib/userScopedStorage";

export type Plan = "free" | "pro" | "team";
export type PaymentProvider = "payfast" | "stripe" | "ozow";
export type SubStatus = "active" | "cancelled" | "expired" | "pending";

export interface Subscription {
  plan: Plan;
  status: SubStatus;
  expiresAt?: string;
  renewsAt?: string;
  provider?: PaymentProvider;
  paymentRef?: string;
  seats?: number; // for team plan
}

export const PLANS = {
  free: {
    id: "free" as Plan,
    name: "Free",
    priceZAR: 0,
    priceUSD: 0,
    period: "forever",
    features: [
      "3 courses",
      "50 AI Tutor messages/month",
      "Basic assessments",
      "Community support",
    ],
    limits: { courses: 3, tutorMessages: 50 },
    badge: "",
    cta: "Current plan",
  },
  pro: {
    id: "pro" as Plan,
    name: "Pro",
    priceZAR: 199,
    priceUSD: 11,
    period: "per month",
    features: [
      "All 37+ courses",
      "Unlimited AI Tutor (Claude, GPT-4, Gemini, DeepSeek)",
      "All assessments + solutions",
      "Certificates on completion",
      "Progress reports & insights",
      "Priority email support",
    ],
    limits: { courses: Infinity, tutorMessages: Infinity },
    badge: "Most popular",
    cta: "Get Pro",
    annualPriceZAR: 1499,
    annualPriceUSD: 84,
  },
  team: {
    id: "team" as Plan,
    name: "Team / School",
    priceZAR: 149,
    priceUSD: 8,
    period: "per seat / month",
    features: [
      "Everything in Pro",
      "5+ seats (min)",
      "Admin dashboard",
      "Student progress reports",
      "Custom curriculum",
      "Dedicated account manager",
      "Bulk certificate issuance",
    ],
    limits: { courses: Infinity, tutorMessages: Infinity },
    badge: "Best for schools",
    cta: "Contact us",
  },
} as const;

interface Store {
  subscription: Subscription;
  setSubscription(sub: Subscription): void;
  activatePro(provider: PaymentProvider, ref: string, months?: number): void;
  isProOrTeam(): boolean;
  canAccessCourse(courseIndex: number): boolean;
}

export const useSubscription = create<Store>()(
  persist(
    (set, get) => ({
      subscription: { plan: "free", status: "active" },

      setSubscription(sub) {
        set({ subscription: sub });
      },

      activatePro(provider, ref, months = 1) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + months);
        set({
          subscription: {
            plan: "pro",
            status: "active",
            provider,
            paymentRef: ref,
            expiresAt: expiresAt.toISOString(),
          },
        });
      },

      isProOrTeam() {
        const { subscription } = get();
        if (subscription.plan === "free") return false;
        if (subscription.status !== "active") return false;
        if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) return false;
        return true;
      },

      canAccessCourse(courseIndex) {
        if (get().isProOrTeam()) return true;
        return courseIndex < PLANS.free.limits.courses;
      },
    }),
    { name: "daqs-subscription", storage: userScopedStorage() }
  )
);
