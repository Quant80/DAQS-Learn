import { NextRequest, NextResponse } from "next/server";

const FIREBASE_API_KEY = process.env.FIREBASE_WEB_API_KEY ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
const BASE = "https://identitytoolkit.googleapis.com/v1/accounts";

export async function POST(req: NextRequest) {
  const { email, password, displayName } = await req.json();

  // Create account
  const signUpRes = await fetch(`${BASE}:signUp?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const signUpData = await signUpRes.json();

  if (!signUpRes.ok) {
    const code = signUpData?.error?.message ?? "SIGN_UP_FAILED";
    const message =
      code.includes("EMAIL_EXISTS")
        ? "An account with this email already exists. Please sign in."
        : code.includes("WEAK_PASSWORD")
        ? "Password must be at least 6 characters."
        : code.includes("INVALID_EMAIL")
        ? "Please enter a valid email address."
        : "Registration failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Set display name
  if (displayName) {
    await fetch(`${BASE}:update?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: signUpData.idToken, displayName }),
    });
  }

  return NextResponse.json({
    idToken: signUpData.idToken,
    email: signUpData.email,
    displayName: displayName ?? "",
    uid: signUpData.localId,
  });
}
