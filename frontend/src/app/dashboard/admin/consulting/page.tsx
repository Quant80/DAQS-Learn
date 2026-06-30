"use client";
import { useState } from "react";

// In production this would fetch from a database.
// For now it shows a placeholder + link to the form.
export default function AdminConsultingPage() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = `${window.location.origin}/consulting`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Consulting Enquiries</h1>
        <p className="text-white/45 text-sm mt-1">Corporate and school client enquiries</p>
      </div>

      {/* Public form link */}
      <div className="bg-sky-500/8 border border-sky-500/20 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sky-300 font-semibold text-sm">Public enquiry form</div>
          <div className="text-white/40 text-xs mt-0.5">/consulting</div>
        </div>
        <div className="flex gap-2">
          <a
            href="/consulting"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Open form ↗
          </a>
          <button
            onClick={copyLink}
            className="text-xs bg-white/8 hover:bg-white/12 border border-white/10 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </div>

      {/* DB not connected notice */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 text-center space-y-3">
        <div className="text-4xl">📥</div>
        <h2 className="text-white font-bold">Enquiries go to your email</h2>
        <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
          When a client submits the form at <strong className="text-white">/consulting</strong>, a notification
          email is sent to <strong className="text-white">trymorencubecon@gmail.com</strong>.
        </p>
        <p className="text-white/30 text-xs">
          To display enquiries here, connect a database (Supabase / PlanetScale) and update{" "}
          <code className="bg-white/8 px-1 rounded">/api/consulting</code> to persist records.
        </p>
      </div>

      {/* Setup checklist */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Setup checklist</h3>
        {[
          { done: true,  text: "Public /consulting page created" },
          { done: true,  text: "POST /api/consulting route with email notification" },
          { done: false, text: "Add RESEND_API_KEY to .env.local (optional — enables email sending)" },
          { done: false, text: "Add CONSULTING_NOTIFY_EMAIL to .env.local (defaults to trymorencubecon@gmail.com)" },
          { done: false, text: "Connect database to store and display enquiries here" },
        ].map(({ done, text }) => (
          <div key={text} className="flex items-start gap-3 text-sm">
            <span className={done ? "text-emerald-400" : "text-white/20"}>
              {done ? "✓" : "○"}
            </span>
            <span className={done ? "text-white/70" : "text-white/35"}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
