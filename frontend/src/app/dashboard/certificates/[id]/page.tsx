"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useRef, useState } from "react";
import { useCertificates } from "@/store/certificates";

const trackLabel: Record<string, string> = {
  python: "Python Programming",
  "data-science": "Data Science",
  "machine-learning": "Machine Learning",
  "deep-learning": "Deep Learning",
  "ai-llm": "AI & Large Language Models",
  "agentic-ai": "Agentic AI",
  "web-dev": "Web Development",
  "data-engineering": "Data Engineering",
  mathematics: "Mathematics",
  career: "Career & Ethics",
};

const trackGradient: Record<string, { from: string; to: string; accent: string; border: string }> = {
  python:             { from: "#0c4a6e", to: "#082f49", accent: "#38bdf8", border: "#0ea5e9" },
  "data-science":     { from: "#3b0764", to: "#1e1b4b", accent: "#a78bfa", border: "#8b5cf6" },
  "machine-learning": { from: "#451a03", to: "#1c0a00", accent: "#fbbf24", border: "#f59e0b" },
  "deep-learning":    { from: "#4c0519", to: "#1f0a0a", accent: "#fb7185", border: "#f43f5e" },
  "ai-llm":           { from: "#052e16", to: "#022c22", accent: "#34d399", border: "#10b981" },
  "agentic-ai":       { from: "#431407", to: "#1c0a00", accent: "#fb923c", border: "#f97316" },
  "web-dev":          { from: "#083344", to: "#082f49", accent: "#22d3ee", border: "#06b6d4" },
  "data-engineering": { from: "#1a2e05", to: "#0a1500", accent: "#a3e635", border: "#84cc16" },
  mathematics:        { from: "#1e1b4b", to: "#0a0820", accent: "#818cf8", border: "#6366f1" },
  career:             { from: "#500724", to: "#1f0a14", accent: "#f472b6", border: "#ec4899" },
};

function CertificateDisplay({ cert, forPrint = false }: {
  cert: { id: string; courseName: string; courseTrack: string; courseIcon: string; difficulty: string; studentName: string; studentEmail: string; issuedAt: string };
  forPrint?: boolean;
}) {
  const grad = trackGradient[cert.courseTrack] ?? trackGradient["python"];
  const date = new Date(cert.issuedAt).toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });
  const trackName = trackLabel[cert.courseTrack] ?? cert.courseTrack;

  return (
    <div
      id="certificate-render"
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: forPrint ? "1122px" : "100%",
        aspectRatio: "1.414 / 1",
        background: `linear-gradient(135deg, ${grad.from} 0%, ${grad.to} 100%)`,
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Border frame */}
      <div className="absolute inset-3 rounded-xl border-2 opacity-30" style={{ borderColor: grad.accent }} />
      <div className="absolute inset-4 rounded-xl border opacity-15" style={{ borderColor: grad.accent }} />

      {/* Corner ornaments */}
      {[
        "top-5 left-5", "top-5 right-5", "bottom-5 left-5", "bottom-5 right-5"
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 opacity-40`} style={{ color: grad.accent }}>
          <svg viewBox="0 0 32 32" fill="currentColor">
            <path d="M0 0 L8 0 L8 2 L2 2 L2 8 L0 8 Z" />
            <path d="M32 0 L24 0 L24 2 L30 2 L30 8 L32 8 Z" transform="scale(-1,1) translate(-32,0)" />
            <path d="M0 32 L8 32 L8 30 L2 30 L2 24 L0 24 Z" transform="scale(1,-1) translate(0,-32)" />
            <path d="M32 32 L24 32 L24 30 L30 30 L30 24 L32 24 Z" transform="scale(-1,-1) translate(-32,-32)" />
          </svg>
        </div>
      ))}

      {/* Decorative background circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5" style={{ background: grad.accent }} />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-5" style={{ background: grad.accent }} />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between px-12 py-10 text-center">
        {/* Top: logo + org */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">{cert.courseIcon}</div>
          <div className="text-left">
            <div className="font-bold text-white text-lg leading-tight tracking-wide">DAQS Learn</div>
            <div className="text-xs tracking-[0.2em] uppercase opacity-50" style={{ color: grad.accent }}>
              Digital Academy of Quantitative Sciences
            </div>
          </div>
        </div>

        {/* Middle: main content */}
        <div className="space-y-3">
          <div className="text-xs tracking-[0.3em] uppercase font-bold opacity-60" style={{ color: grad.accent }}>
            Certificate of Completion
          </div>

          <div className="text-[10px] tracking-widest uppercase opacity-40 text-white">This certifies that</div>

          <div className="text-4xl font-bold text-white" style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.01em" }}>
            {cert.studentName}
          </div>

          <div className="text-[10px] tracking-widest uppercase opacity-40 text-white">has successfully completed</div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">{cert.courseName}</div>
            <div className="text-sm opacity-60 text-white capitalize">
              {trackName} · {cert.difficulty} Level
            </div>
          </div>
        </div>

        {/* Bottom: date + ID + signature line */}
        <div className="w-full flex items-end justify-between">
          <div className="text-left">
            <div className="w-32 h-px mb-1 opacity-30" style={{ background: grad.accent }} />
            <div className="text-xs text-white opacity-50">Date of Issue</div>
            <div className="text-sm font-semibold text-white mt-0.5">{date}</div>
          </div>

          <div className="text-center">
            <div className="text-xs font-mono opacity-40 text-white mb-1">{cert.id}</div>
            <div className="text-[9px] opacity-30 text-white tracking-wider uppercase">Verification ID</div>
          </div>

          <div className="text-right">
            <div className="w-32 h-px mb-1 ml-auto opacity-30" style={{ background: grad.accent }} />
            <div className="text-xs text-white opacity-50">Authorised by</div>
            <div className="text-sm font-semibold text-white mt-0.5">DAQS Learn</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCertificateById } = useCertificates();
  const cert = getCertificateById(id);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!cert) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/50 mb-4">Certificate not found.</p>
        <Link href="/dashboard/certificates" className="text-sky-400 hover:text-sky-300 text-sm">
          ← Back to certificates
        </Link>
      </div>
    );
  }

  async function downloadPDF() {
    setDownloading(true);
    try {
      const element = document.getElementById("certificate-render");
      if (!element) return;

      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DAQS-Certificate-${cert!.id}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  async function copyLink() {
    setSharing(true);
    await navigator.clipboard.writeText(
      `${window.location.origin}/dashboard/certificates/${cert!.id}`
    );
    setTimeout(() => setSharing(false), 2000);
  }

  const date = new Date(cert.issuedAt).toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/35">
        <Link href="/dashboard/certificates" className="hover:text-white/60 transition-colors">Certificates</Link>
        <span>/</span>
        <span className="text-white/50">{cert.id}</span>
      </div>

      {/* Certificate display */}
      <div ref={certRef}>
        <CertificateDisplay cert={cert} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all"
        >
          {downloading ? (
            <><span className="animate-spin text-base">⏳</span> Generating PDF…</>
          ) : (
            <><span>⬇️</span> Download PDF</>
          )}
        </button>

        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
        >
          <span>{sharing ? "✓" : "🔗"}</span>
          {sharing ? "Link copied!" : "Copy link"}
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-white/60 hover:text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
        >
          <span>🖨️</span> Print
        </button>

        <Link href="/dashboard/courses"
          className="flex items-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 font-semibold text-sm px-5 py-3 rounded-xl transition-all">
          <span>📚</span> Continue learning
        </Link>
      </div>

      {/* Certificate details */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Certificate Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Certificate ID",  value: cert.id, mono: true },
            { label: "Issued to",       value: cert.studentName },
            { label: "Course",          value: cert.courseName },
            { label: "Track",           value: (trackLabel[cert.courseTrack] ?? cert.courseTrack) },
            { label: "Level",           value: cert.difficulty.charAt(0).toUpperCase() + cert.difficulty.slice(1) },
            { label: "Date issued",     value: date },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{label}</div>
              <div className={`text-white/80 text-sm ${mono ? "font-mono" : "font-medium"}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
