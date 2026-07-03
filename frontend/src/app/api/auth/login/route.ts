import { NextRequest, NextResponse } from "next/server";

const FIREBASE_API_KEY = process.env.FIREBASE_WEB_API_KEY ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
const BASE = "https://identitytoolkit.googleapis.com/v1/accounts";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const res = await fetch(`${BASE}:signInWithPassword?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const data = await res.json();

  if (!res.ok) {
    const code = data?.error?.message ?? "LOGIN_FAILED";
    const message =
      code.includes("INVALID_PASSWORD") || code.includes("INVALID_LOGIN_CREDENTIALS") || code.includes("INVALID_CREDENTIAL")
        ? "Incorrect email or password."
        : code.includes("EMAIL_NOT_FOUND") || code.includes("USER_NOT_FOUND")
        ? "No account found with this email. Please register first."
        : code.includes("TOO_MANY_ATTEMPTS")
        ? "Too many failed attempts. Please try again later."
        : code.includes("OPERATION_NOT_ALLOWED")
        ? "Email/password sign-in is not enabled. Please contact support."
        : code.includes("USER_DISABLED")
        ? "This account has been disabled."
        : `Login error: ${code}`;
    return NextResponse.json({ error: message }, { status: 401 });
  }

  return NextResponse.json({
    idToken: data.idToken,
    email: data.email,
    displayName: data.displayName ?? "",
    uid: data.localId,
  });
}
