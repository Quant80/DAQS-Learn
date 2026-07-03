"use client";
import { useState } from "react";
import Link from "next/link";

const ORG_TYPES = [
  { value: "school",      label: "School (K-12)" },
  { value: "university",  label: "University / TVET" },
  { value: "corporate",   label: "Corporate / Business" },
  { value: "government",  label: "Government / Public Sector" },
  { value: "ngo",         label: "NGO / Non-profit" },
  { value: "other",       label: "Other" },
] as const;

const LEARNER_OPTIONS = [
  "1 – 20", "21 – 50", "51 – 100", "101 – 250", "251 – 500", "500+",
];

const BUDGET_OPTIONS = [
  "Under R10,000/mo", "R10,000 – R30,000/mo", "R30,000 – R100,000/mo", "R100,000+/mo", "TBD / Flexible",
];

const TIMELINE_OPTIONS = [
  "ASAP", "Within 1 month", "1 – 3 months", "3 – 6 months", "6+ months",
];

const SERVICES = [
  {
    icon: "🎓",
    title: "Learner Licensing",
    desc: "Bulk access to all 37+ DAQS courses for your learners, with progress tracking and certificates.",
  },
  {
    icon: "📊",
    title: "Admin Dashboard",
    desc: "School or org-wide analytics: enrollment, completion rates, AI usage per learner.",
  },
  {
    icon: "🤖",
    title: "Custom AI Tutor",
    desc: "White-label AI tutor configured for your curriculum, topics, and assessment standards.",
  },
  {
    icon: "📋",
    title: "Curriculum Mapping",
    desc: "Map DAQS courses to CAPS, NQF, or your internal skills framework.",
  },
  {
    icon: "🏆",
    title: "Bulk Certificates",
    desc: "Automated certificate issuance for cohorts, with branded templates on request.",
  },
  {
    icon: "🧑‍💼",
    title: "Dedicated Support",
    desc: "Account manager, onboarding sessions, and priority technical support.",
  },
];

type FormState = {
  orgName: string;
  orgType: typeof ORG_TYPES[number]["value"] | "";
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  learnerCount: string;
  requirements: string;
  budget: string;
  timeline: string;
};

export default function ConsultingPage() {
  const [form, setForm] = useState<FormState>({
    orgName: "", orgType: "", contactName: "", contactEmail: "",
    contactPhone: "", learnerCount: "", requirements: "", budget: "", timeline: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.orgName || !form.orgType || !form.contactName || !form.contactEmail || !form.learnerCount || !form.requirements) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/consulting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setError(data.error ?? "Submission failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-5">
          <div className="text-6xl">🎉</div>
          <h1 className="text-2xl font-bold text-white">Enquiry received!</h1>
          <p className="text-white/55 text-sm leading-relaxed">
            Thank you for reaching out. A member of the DAQS team will contact you within 1 business day.
          </p>
          <Link href="/" className="inline-block bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-white">DAQS Learn</span>
        </Link>
        <Link href="/auth/login" className="text-sm text-white/50 hover:text-white transition-colors">
          Sign in →
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 text-center max-w-3xl mx-auto">
        <div className="inline-block bg-sky-500/15 border border-sky-500/25 rounded-full px-4 py-1 text-xs text-sky-400 font-bold tracking-wider uppercase mb-6">
          For Schools, Universities & Corporates
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
          AI-powered learning<br />
          <span className="text-sky-400">for your organisation</span>
        </h1>
        <p className="text-white/50 text-lg mb-8 leading-relaxed">
          DAQS Learn scales from a single classroom to thousands of learners.
          We handle the technology — you focus on the people.
        </p>
        <a href="#enquiry" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-colors inline-block">
          Request a proposal →
        </a>
      </section>

      {/* Services */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-8">What we offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="font-bold text-white mb-1">{s.title}</div>
              <div className="text-white/45 text-sm leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-6 py-8 max-w-5xl mx-auto">
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { num: "37+", label: "Courses" },
            { num: "10",  label: "Tracks" },
            { num: "4",   label: "AI Providers" },
            { num: "ZA",  label: "South African" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl font-extrabold text-sky-400">{num}</div>
              <div className="text-xs text-white/40 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquiry" className="px-6 py-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Request a proposal</h2>
          <p className="text-white/45 text-sm mt-2">We'll respond within 1 business day</p>
        </div>

        <form onSubmit={submit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          {/* Organisation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Organisation name *</label>
              <input
                value={form.orgName} onChange={(e) => set("orgName", e.target.value)}
                placeholder="e.g. Northgate High School"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Organisation type *</label>
              <select
                value={form.orgType} onChange={(e) => set("orgType", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50"
              >
                <option value="" disabled className="bg-[#1a1a2e]">Select type…</option>
                {ORG_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#1a1a2e]">{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Your name *</label>
              <input
                value={form.contactName} onChange={(e) => set("contactName", e.target.value)}
                placeholder="Full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Email *</label>
              <input
                type="email"
                value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="you@organisation.co.za"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1 block">Phone (optional)</label>
            <input
              type="tel"
              value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)}
              placeholder="+27 XX XXX XXXX"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          {/* Learner count */}
          <div>
            <label className="text-xs text-white/50 mb-2 block">Number of learners *</label>
            <div className="flex flex-wrap gap-2">
              {LEARNER_OPTIONS.map((opt) => (
                <button
                  key={opt} type="button"
                  onClick={() => set("learnerCount", opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    form.learnerCount === opt
                      ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/25"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Requirements & goals *</label>
            <textarea
              value={form.requirements} onChange={(e) => set("requirements", e.target.value)}
              rows={4}
              placeholder="Describe what you need: curriculum alignment, tracks of interest, integration requirements, assessment needs, etc."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50 resize-none"
            />
          </div>

          {/* Budget & timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-2 block">Monthly budget (optional)</label>
              <div className="space-y-1">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt} type="button"
                    onClick={() => set("budget", opt)}
                    className={`block w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      form.budget === opt
                        ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/25"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-2 block">When to start (optional)</label>
              <div className="space-y-1">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt} type="button"
                    onClick={() => set("timeline", opt)}
                    className={`block w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      form.timeline === opt
                        ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/25"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            {status === "loading" ? "Submitting…" : "Submit enquiry →"}
          </button>

          <p className="text-center text-xs text-white/30">
            By submitting, you agree to be contacted by the DAQS team regarding your enquiry.
          </p>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-6 text-center text-xs text-white/25">
        © {new Date().getFullYear()} N³ SmartSolutions · DAQS Learn · learn.daqstech.com
      </footer>
    </div>
  );
}
