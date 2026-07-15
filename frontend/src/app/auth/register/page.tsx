"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ROLES = [
  { value: "student", label: "Student", desc: "I want to learn" },
  { value: "lecturer", label: "Lecturer", desc: "I want to teach" },
  { value: "company", label: "Company", desc: "Training for my team" },
] as const;

export default function RegisterPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<"student" | "lecturer" | "company">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function afterFirebaseAuth(uid: string, userEmail: string, displayName: string, idToken: string) {
    try {
      const res = await api.post<{
        access_token: string;
        user_id: number;
        email: string;
        full_name: string;
        role: "student" | "lecturer" | "admin" | "company" | "parent";
      }>("/auth/firebase", { id_token: idToken });
      setAuth({ id: res.user_id, email: res.email, full_name: res.full_name, role: res.role }, res.access_token);
    } catch {
      setAuth({ id: 0, email: userEmail, full_name: displayName || userEmail, role }, idToken);
    }
    // Hard navigation, not router.push — every per-account zustand store
    // needs to re-hydrate from this user's scoped storage key rather than
    // keep whichever account's in-memory state happened to be mounted.
    window.location.href = "/dashboard";
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await afterFirebaseAuth(result.user.uid, result.user.email ?? "", result.user.displayName ?? "", idToken);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code !== "auth/popup-closed-by-user") {
        setError(e.message ?? "Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: fullName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed"); return; }
      await afterFirebaseAuth(data.uid, data.email, data.displayName, data.idToken);
    } catch {
      setError("Network error — please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/Logo_small.png" alt="DAQS" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold text-white">DAQS Learn</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/50 text-sm mt-1">Start learning in minutes</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {step === "role" && (
            <div className="space-y-3">
              <p className="text-white/70 text-sm font-medium">I am a...</p>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                    role === r.value
                      ? "border-sky-500 bg-sky-500/10 text-white"
                      : "border-white/10 hover:border-white/25 text-white/70"
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{r.label}</div>
                    <div className="text-xs text-white/40 mt-0.5">{r.desc}</div>
                  </div>
                  {role === r.value && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                </button>
              ))}
              <button
                onClick={() => setStep("details")}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm mt-2"
              >
                Continue
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-3">
              <button
                onClick={() => setStep("role")}
                className="text-white/40 hover:text-white/70 text-xs transition-colors flex items-center gap-1"
              >
                ← Back
              </button>

              {/* Google sign-up */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-800 font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-white/10" />
                <span className="text-white/25 text-xs">or fill in details</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-sky-500/50 focus:bg-white/8 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-sky-500/50 focus:bg-white/8 transition-all"
                />
                <input
                  type="password"
                  placeholder="Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-sky-500/50 focus:bg-white/8 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-sky-400 hover:text-sky-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
