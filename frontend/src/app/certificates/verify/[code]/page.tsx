"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

interface VerifyResult {
  valid: boolean;
  revoked: boolean;
  course_name: string | null;
  difficulty: string | null;
  student_name: string | null;
  issued_at: string | null;
}

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = typeof params.code === "string" ? params.code : "";
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    fetch(`${API_BASE}/certificates/verify/${encodeURIComponent(code)}`)
      .then((res) => res.json())
      .then(setResult)
      .catch(() => setError("Couldn't reach the verification service — try again shortly."));
  }, [code]);

  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center gap-2.5">
          <Image src="/Logo_small.png" alt="DAQS" width={32} height={32} className="rounded-lg" />
          <span className="text-white font-bold text-lg">DAQS Learn</span>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {!error && !result && (
            <p className="text-white/40 text-sm">Verifying…</p>
          )}

          {result && result.valid && (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-2xl mx-auto">
                ✓
              </div>
              <div>
                <p className="text-emerald-400 font-bold text-sm">Certificate Verified</p>
                <p className="text-white font-semibold text-lg mt-2">{result.course_name}</p>
                <p className="text-white/40 text-xs capitalize mt-1">{result.difficulty} level</p>
              </div>
              <div className="border-t border-white/8 pt-4 text-sm">
                <p className="text-white/60">Awarded to</p>
                <p className="text-white font-medium">{result.student_name}</p>
                <p className="text-white/40 text-xs mt-1">
                  {result.issued_at && new Date(result.issued_at).toLocaleDateString("en-ZA", { dateStyle: "long" })}
                </p>
              </div>
              <p className="text-white/25 text-[10px] font-mono pt-2">{code}</p>
            </div>
          )}

          {result && !result.valid && !result.revoked && (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center text-2xl mx-auto">
                ✕
              </div>
              <p className="text-red-400 font-bold text-sm">Invalid Certificate Code</p>
              <p className="text-white/40 text-xs">This code doesn't match any certificate on record.</p>
            </div>
          )}

          {result && result.revoked && (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-2xl mx-auto">
                ⚠
              </div>
              <p className="text-amber-400 font-bold text-sm">Certificate Revoked</p>
              <p className="text-white/40 text-xs">This certificate is no longer valid.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
