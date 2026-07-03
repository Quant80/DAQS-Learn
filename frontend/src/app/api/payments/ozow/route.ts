import { NextRequest } from "next/server";
import crypto from "crypto";

// Ozow — South African instant EFT (bank transfer)
const OZOW_SITE_CODE    = process.env.OZOW_SITE_CODE    ?? "";
const OZOW_PRIVATE_KEY  = process.env.OZOW_PRIVATE_KEY  ?? "";
const OZOW_API_KEY      = process.env.OZOW_API_KEY      ?? "";
const IS_SANDBOX = process.env.OZOW_SANDBOX === "true";

interface OzowRequest {
  plan: "pro" | "team";
  billing: "monthly" | "annual";
  seats?: number;
  userName: string;
  userEmail: string;
}

export async function POST(req: NextRequest) {
  if (!OZOW_SITE_CODE) {
    return Response.json({ error: "Ozow not configured" }, { status: 503 });
  }

  const { plan, billing, seats = 1, userName, userEmail }: OzowRequest = await req.json();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const amountZAR =
    plan === "team" ? (149 * seats).toFixed(2) :
    billing === "annual" ? "1499.00" : "199.00";

  const transactionRef = `DAQS-${Date.now()}`;

  // Build the hash: SiteCode + CountryCode + CurrencyCode + Amount + TransactionReference + BankRef + CancelUrl + ErrorUrl + SuccessUrl + IsTest + PrivateKey
  const isTest = IS_SANDBOX ? "true" : "false";
  const successUrl = `${appUrl}/dashboard/billing?status=success&provider=ozow&ref=${transactionRef}`;
  const cancelUrl  = `${appUrl}/dashboard/billing?status=cancelled`;
  const errorUrl   = `${appUrl}/dashboard/billing?status=error`;
  const bankRef    = transactionRef;

  const hashInput = [
    OZOW_SITE_CODE, "ZA", "ZAR", amountZAR,
    transactionRef, bankRef, cancelUrl, errorUrl, successUrl, isTest, OZOW_PRIVATE_KEY,
  ].join("").toLowerCase();

  const hashCheck = crypto.createHash("sha512").update(hashInput).digest("hex");

  const ozowUrl = IS_SANDBOX
    ? "https://pay.ozow.com/"
    : "https://pay.ozow.com/";

  const params = new URLSearchParams({
    SiteCode: OZOW_SITE_CODE,
    CountryCode: "ZA",
    CurrencyCode: "ZAR",
    Amount: amountZAR,
    TransactionReference: transactionRef,
    BankReference: bankRef,
    Customer: userEmail,
    CancelUrl: cancelUrl,
    ErrorUrl: errorUrl,
    SuccessUrl: successUrl,
    IsTest: isTest,
    HashCheck: hashCheck,
  });

  return Response.json({
    redirectUrl: `${ozowUrl}?${params.toString()}`,
    paymentId: transactionRef,
  });
}
