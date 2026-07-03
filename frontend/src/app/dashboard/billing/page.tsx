"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useSubscription, PLANS } from "@/store/subscription";
import type { Plan, PaymentProvider } from "@/store/subscription";

const PAYMENT_METHODS: Array<{ id: "payfast" | "ozow" | "stripe"; label: string; icon: string; desc: string; popular?: boolean }> = [
  { id: "payfast", label: "PayFast", icon: "🇿🇦", desc: "Card, EFT, SnapScan, Mobicred", popular: true },
  { id: "ozow",    label: "Ozow",    icon: "🏦", desc: "Instant EFT — all SA banks" },
  { id: "stripe",  label: "Stripe",  icon: "💳", desc: "International card payments" },
];

function BillingInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { subscription, activatePro, isProOrTeam } = useSubscription();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"payfast" | "ozow" | "stripe">("payfast");
  const [seats, setSeats] = useState(5);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Handle return from payment gateway
  useEffect(() => {
    const status = searchParams.get("status");
    const provider = searchParams.get("provider") as PaymentProvider | null;
    const ref = searchParams.get("ref") ?? searchParams.get("session_id") ?? "unknown";
    if (status === "success") {
      activatePro(provider ?? "payfast", ref, billing === "annual" ? 12 : 1);
      setToast({ type: "success", msg: "🎉 Payment successful! Your Pro plan is now active." });
    } else if (status === "cancelled") {
      setToast({ type: "error", msg: "Payment was cancelled. You can try again anytime." });
    } else if (status === "error") {
      setToast({ type: "error", msg: "Payment failed. Please try a different method." });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCheckout() {
    if (!selectedPlan || selectedPlan === "free" || !user) return;
    setLoading(true);
    try {
      const endpoint = `/api/payments/${paymentMethod}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          billing,
          seats: selectedPlan === "team" ? seats : 1,
          userName: user.full_name ?? user.email ?? "Learner",
          userEmail: user.email ?? "",
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setToast({ type: "error", msg: data.error ?? "Could not initiate payment." });
      }
    } catch {
      setToast({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const isPro = mounted && isProOrTeam();
  const expiresAt = subscription.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm rounded-2xl px-5 py-4 text-sm font-semibold shadow-2xl flex items-start gap-3 ${
          toast.type === "success"
            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            : "bg-red-500/20 border border-red-500/40 text-red-300"
        }`}>
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 shrink-0">✕</button>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Plans & Billing</h1>
        <p className="text-white/45 text-sm mt-1">Unlock full access to DAQS Learn</p>
      </div>

      {/* Current plan banner */}
      <div className={`rounded-2xl p-5 border flex items-center justify-between flex-wrap gap-4 ${
        isPro
          ? "bg-amber-500/10 border-amber-500/25"
          : "bg-white/[0.03] border-white/8"
      }`}>
        <div>
          <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Current plan</div>
          <div className="text-white font-bold text-lg capitalize">{subscription.plan} {isPro ? "✓" : ""}</div>
          {expiresAt && <div className="text-white/45 text-xs mt-0.5">Renews / expires {expiresAt}</div>}
          {subscription.provider && <div className="text-white/35 text-xs mt-0.5 capitalize">via {subscription.provider}</div>}
        </div>
        {isPro && (
          <div className="text-xs text-amber-400 bg-amber-500/15 border border-amber-500/25 rounded-xl px-4 py-2 font-bold">
            Full access active
          </div>
        )}
        {!isPro && (
          <div className="text-xs text-white/40">
            3 courses · 50 AI messages/month
          </div>
        )}
      </div>

      {/* Billing toggle */}
      {!isPro && (
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${billing === "monthly" ? "text-white" : "text-white/40"}`}>Monthly</span>
          <button
            onClick={() => setBilling((b) => b === "monthly" ? "annual" : "monthly")}
            className={`relative w-12 h-6 rounded-full transition-colors ${billing === "annual" ? "bg-amber-500" : "bg-white/15"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billing === "annual" ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
          <span className={`text-sm ${billing === "annual" ? "text-white" : "text-white/40"}`}>
            Annual <span className="text-emerald-400 text-xs font-bold ml-1">Save 37%</span>
          </span>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Object.values(PLANS).map((plan) => {
          const isFreeCurrentPlan = subscription.plan === "free" && plan.id === "free";
          const isProCurrentPlan  = isPro && subscription.plan === plan.id;
          const isCurrentPlan     = isFreeCurrentPlan || isProCurrentPlan;
          const isFree            = plan.id === "free";
          const isSelected        = selectedPlan === plan.id;
          const annualPrice       = "annualPriceZAR" in plan ? plan.annualPriceZAR : null;
          const displayPrice =
            isFree ? "R0" :
            plan.id === "team" ? `R${plan.priceZAR}/seat` :
            billing === "annual" && annualPrice ? `R${annualPrice}/yr` :
            `R${plan.priceZAR}/mo`;

          return (
            <div
              key={plan.id}
              onClick={() => !isFree && !isCurrentPlan && setSelectedPlan(plan.id)}
              className={`relative rounded-2xl p-6 border transition-all flex flex-col ${
                plan.id === "pro"
                  ? "border-amber-500/40 bg-amber-500/8"
                  : isSelected
                  ? "border-sky-500/50 bg-sky-500/8"
                  : isCurrentPlan
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 cursor-pointer"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    plan.id === "pro" ? "bg-amber-500 text-black" : "bg-sky-500 text-white"
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-2 py-0.5">
                  Current plan
                </div>
              )}
              {isSelected && !isCurrentPlan && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs">✓</div>
              )}

              <div className="mb-4">
                <div className="text-white font-bold text-lg">{plan.name}</div>
                <div className="text-3xl font-extrabold text-white mt-1">{displayPrice}</div>
                {isFree && (
                  <div className="text-xs text-emerald-400 font-semibold mt-0.5">No credit card required</div>
                )}
                {plan.id === "pro" && billing === "annual" && annualPrice && (
                  <div className="text-xs text-white/40 mt-0.5">was R{plan.priceZAR * 12}/yr</div>
                )}
                <div className="text-white/40 text-xs mt-0.5">{plan.period}</div>
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/65">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA button inside each card */}
              {isFree ? (
                isCurrentPlan ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-2.5 rounded-xl border border-white/15 text-white/60 text-xs font-semibold hover:border-white/25 hover:text-white/80 transition-all"
                  >
                    Continue with Free →
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-all"
                  >
                    Start for free — no card needed
                  </button>
                )
              ) : plan.id === "team" ? (
                <>
                  {isSelected && (
                    <div className="mb-3">
                      <label className="text-xs text-white/50 mb-1 block">Number of seats</label>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setSeats((s) => Math.max(5, s - 1)); }}
                          className="w-8 h-8 rounded-lg bg-white/8 text-white font-bold hover:bg-white/15 transition-colors">−</button>
                        <span className="text-white font-bold text-sm w-8 text-center">{seats}</span>
                        <button onClick={(e) => { e.stopPropagation(); setSeats((s) => s + 1); }}
                          className="w-8 h-8 rounded-lg bg-white/8 text-white font-bold hover:bg-white/15 transition-colors">+</button>
                        <span className="text-white/40 text-xs">= R{149 * seats}/mo</span>
                      </div>
                      <div className="text-[10px] text-white/30 mt-1">Minimum 5 seats</div>
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan("team"); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-sky-500 text-white"
                        : "border border-sky-500/40 text-sky-400 hover:bg-sky-500/10"
                    }`}
                  >
                    {isCurrentPlan ? "Current plan" : isSelected ? "Continue below ↓" : "Choose Team"}
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan("pro"); }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrentPlan
                      ? "border border-amber-500/40 text-amber-400 cursor-default"
                      : isSelected
                      ? "bg-amber-500 text-black"
                      : "border border-amber-500/60 text-amber-400 hover:bg-amber-500/15"
                  }`}
                >
                  {isCurrentPlan ? "Current plan" : isSelected ? "Continue below ↓" : "Get Pro — R199/mo"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment method + checkout */}
      {selectedPlan && selectedPlan !== "free" && !isPro && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Choose payment method</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`relative text-left p-4 rounded-xl border transition-all ${
                  paymentMethod === method.id
                    ? "border-sky-500/50 bg-sky-500/8"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                {method.popular && (
                  <span className="absolute -top-2 right-3 text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
                <div className="text-2xl mb-1">{method.icon}</div>
                <div className="text-white text-sm font-semibold">{method.label}</div>
                <div className="text-white/40 text-xs mt-0.5">{method.desc}</div>
              </button>
            ))}
          </div>

          <div className="bg-sky-500/8 border border-sky-500/20 rounded-xl p-4 text-xs text-sky-300/80">
            🔒 All payments are processed securely. DAQS Learn never stores your card details.
            {paymentMethod === "payfast" && " PayFast is a PCI DSS compliant South African payment gateway."}
            {paymentMethod === "ozow" && " Ozow uses bank-level security for instant EFT payments."}
            {paymentMethod === "stripe" && " Stripe is used by millions of businesses worldwide."}
          </div>

          {/* Order summary */}
          {(() => {
            const planLabel = selectedPlan === "pro" ? "Pro" : "Team";
            const billingLabel = billing === "annual" ? "Annual" : "Monthly";
            const amount =
              selectedPlan === "team"
                ? 149 * seats
                : selectedPlan === "pro" && billing === "annual"
                ? 1499
                : 199;
            const period = selectedPlan === "team" ? "/month" : billing === "annual" ? "/year" : "/month";
            const savings =
              selectedPlan === "pro" && billing === "annual"
                ? `Save R${199 * 12 - 1499} vs monthly`
                : selectedPlan === "team"
                ? `${seats} seats × R149`
                : null;

            return (
              <div className="bg-white/[0.04] border border-white/12 rounded-xl p-4 space-y-3">
                <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Order summary</div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">{planLabel} plan · {billingLabel}</span>
                  <span className="text-white font-bold text-sm">R{amount.toLocaleString()}{period}</span>
                </div>
                {savings && (
                  <div className="flex items-center justify-between text-emerald-400 text-xs">
                    <span>{savings}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-white font-bold text-sm">Total due today</span>
                  <span className="text-white font-extrabold text-xl">R{amount.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-400 active:bg-sky-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading
                    ? "Redirecting to payment…"
                    : `Pay R${amount.toLocaleString()} with ${PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}`}
                </button>
                <p className="text-center text-[10px] text-white/30">
                  You will be redirected to {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label} to complete payment securely.
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Feature comparison */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-bold text-white">What's included</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-white/50 text-xs font-semibold w-1/2">Feature</th>
                <th className="text-center px-3 py-3 text-white/50 text-xs font-semibold">Free</th>
                <th className="text-center px-3 py-3 text-amber-400 text-xs font-semibold">Pro</th>
                <th className="text-center px-3 py-3 text-sky-400 text-xs font-semibold">Team</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Courses", "3", "All 37+", "All 37+"],
                ["AI Tutor", "50 msgs/mo", "Unlimited", "Unlimited"],
                ["AI Providers", "Claude only", "Claude + GPT-4 + DeepSeek + Gemini", "All providers"],
                ["Assessments", "Basic", "All + solutions", "All + solutions"],
                ["Certificates", "✗", "✓", "✓"],
                ["Progress reports", "Basic", "AI-powered", "AI-powered"],
                ["Admin dashboard", "✗", "✗", "✓"],
                ["Bulk certificates", "✗", "✗", "✓"],
                ["Support", "Community", "Priority email", "Dedicated manager"],
              ].map(([feature, free, pro, team]) => (
                <tr key={feature} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white/70">{feature}</td>
                  <td className="text-center px-3 py-3 text-white/40 text-xs">{free}</td>
                  <td className="text-center px-3 py-3 text-amber-300/80 text-xs">{pro}</td>
                  <td className="text-center px-3 py-3 text-sky-300/80 text-xs">{team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white/50">Loading…</div>}>
      <BillingInner />
    </Suspense>
  );
}
