import { NextRequest } from "next/server";
import crypto from "crypto";

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID ?? "";
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY ?? "";
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE ?? "";
const IS_SANDBOX = process.env.PAYFAST_SANDBOX === "true";

const PAYFAST_URL = IS_SANDBOX
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

interface PayFastRequest {
  plan: "pro" | "team";
  billing: "monthly" | "annual";
  seats?: number;
  userName: string;
  userEmail: string;
}

export async function POST(req: NextRequest) {
  const { plan, billing, seats = 1, userName, userEmail }: PayFastRequest = await req.json();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const priceZAR =
    plan === "team" ? 149 * seats :
    billing === "annual" ? 1499 : 199;

  const itemName =
    plan === "team"
      ? `DAQS Learn Team Plan (${seats} seats)`
      : billing === "annual"
      ? "DAQS Learn Pro — Annual"
      : "DAQS Learn Pro — Monthly";

  const mPaymentId = `DAQS-${Date.now()}`;

  const params: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${appUrl}/dashboard/billing?status=success&ref=${mPaymentId}`,
    cancel_url: `${appUrl}/dashboard/billing?status=cancelled`,
    notify_url: `${appUrl}/api/payments/payfast/notify`,
    name_first: userName.split(" ")[0] ?? "",
    name_last: userName.split(" ").slice(1).join(" ") || ".",
    email_address: userEmail,
    m_payment_id: mPaymentId,
    amount: priceZAR.toFixed(2),
    item_name: itemName,
  };

  if (PAYFAST_PASSPHRASE) {
    const paramString = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v.trim())}`)
      .join("&") + `&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE.trim())}`;
    params.signature = crypto.createHash("md5").update(paramString).digest("hex");
  } else {
    const paramString = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v.trim())}`)
      .join("&");
    params.signature = crypto.createHash("md5").update(paramString).digest("hex");
  }

  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  return Response.json({
    redirectUrl: `${PAYFAST_URL}?${queryString}`,
    paymentId: mPaymentId,
  });
}
