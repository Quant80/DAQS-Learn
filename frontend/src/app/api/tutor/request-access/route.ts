import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.TUTOR_ACCESS_NOTIFY_EMAIL ?? "Ncube.T@daqstech.com";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE}/tutor/request-access`, {
    method: "POST",
    headers: { Authorization: authHeader },
  });

  if (!backendRes.ok) {
    const text = await backendRes.text();
    return NextResponse.json({ error: `Could not create request: ${text}` }, { status: backendRes.status });
  }

  const data = await backendRes.json() as { token: string; user: { email: string; full_name: string } };
  const approveUrl = `${API_BASE}/admin/requests/approve-by-token?token=${data.token}`;

  const emailHtml = `
    <h2>AI Tutor Access Request — DAQS Learn</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Student</td><td style="padding:8px;border:1px solid #ddd;">${data.user.full_name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Email</td><td style="padding:8px;border:1px solid #ddd;">${data.user.email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Reason</td><td style="padding:8px;border:1px solid #ddd;">Used up their 2 free AI Tutor questions and is requesting more access.</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="${approveUrl}" style="background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Approve unlimited AI Tutor access →</a>
    </p>
    <p style="margin-top:16px;font-size:12px;color:#666;">Or review it from the Admin → Requests panel in DAQS Learn.</p>
  `;

  if (RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DAQS Learn <noreply@daqstech.com>",
          to: [NOTIFY_EMAIL],
          subject: `AI Tutor access request: ${data.user.full_name}`,
          html: emailHtml,
        }),
      });
    } catch (e) {
      console.error("Failed to send access-request email:", e);
    }
  } else {
    console.log("AI Tutor access request received (no RESEND_API_KEY):", data);
  }

  return NextResponse.json({ success: true });
}
