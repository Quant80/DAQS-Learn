import { NextRequest } from "next/server";
import crypto from "crypto";

const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE ?? "";

// PayFast ITN (Instant Transaction Notification) webhook
export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const data: Record<string, string> = {};
  params.forEach((value, key) => { data[key] = value; });

  // Verify signature
  const receivedSig = data["signature"];
  delete data["signature"];

  const paramString = Object.entries(data)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim())}`)
    .join("&") + (PAYFAST_PASSPHRASE ? `&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE.trim())}` : "");

  const computedSig = crypto.createHash("md5").update(paramString).digest("hex");

  if (computedSig !== receivedSig) {
    console.error("PayFast ITN signature mismatch");
    return new Response("Invalid signature", { status: 400 });
  }

  const paymentStatus = data["payment_status"];
  const mPaymentId = data["m_payment_id"];
  const amountGross = data["amount_gross"];

  if (paymentStatus === "COMPLETE") {
    // In production: update your database here
    // For now we log — the client activates via the return_url redirect
    console.log(`PayFast payment COMPLETE: ${mPaymentId} — R${amountGross}`);
  }

  return new Response("OK", { status: 200 });
}
