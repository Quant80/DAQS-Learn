"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const ROLES = [
  { value: "student", label: "Student", desc: "I want to learn" },
  { value: "lecturer", label: "Lecturer", desc: "I want to teach" },
  { value: "company", label: "Company", desc: "Training for my team" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<"student" | "lecturer" | "company">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginWithFirebaseUser(firebaseUser: { uid: string; email: string | null; displayName: string | null }, idToken: string) {
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
      // Backend not running — use Firebase data directly for local dev
      setAuth({
        id: 0,
        email: firebaseUser.email ?? "",
        full_name: firebaseUser.displayName ?? fullName,
        role,
      }, idToken);
    }
    router.push("/dashboard");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });
      const idToken = await cred.user.getIdToken();
      await loginWithFirebaseUser(cred.user, idToken);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();
      await loginWithFirebaseUser(cred.user, idToken);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-up failed");
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

              <button
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-white/15 hover:border-white/30 hover:bg-white/5 text-white py-2.5 rounded-xl transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
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
