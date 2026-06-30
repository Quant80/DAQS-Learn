import { NextRequest } from "next/server";
import Stripe from "stripe";

interface StripeRequest {
  plan: "pro" | "team";
  billing: "monthly" | "annual";
  seats?: number;
  userEmail: string;
  userName: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-06-24.dahlia",
  });

  const PRICE_IDS: Record<string, string> = {
    "pro-monthly":  process.env.STRIPE_PRICE_PRO_MONTHLY  ?? "",
    "pro-annual":   process.env.STRIPE_PRICE_PRO_ANNUAL   ?? "",
    "team-monthly": process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "",
  };

  const { plan, billing, seats = 1, userEmail, userName }: StripeRequest = await req.json();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const priceKey = plan === "team" ? "team-monthly" : `pro-${billing}`;
  const priceId = PRICE_IDS[priceKey];

  try {
    if (priceId) {
      // Use configured Stripe Price IDs (production)
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: userEmail,
        line_items: [{ price: priceId, quantity: plan === "team" ? seats : 1 }],
        success_url: `${appUrl}/dashboard/billing?status=success&provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/dashboard/billing?status=cancelled`,
        metadata: { plan, billing, seats: String(seats), userName },
      });
      return Response.json({ redirectUrl: session.url });
    } else {
      // Fallback: create an ad-hoc price (sandbox / no price IDs configured)
      const priceZAR =
        plan === "team" ? 149 * seats * 100 :
        billing === "annual" ? 149900 : 19900; // cents

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: userEmail,
        line_items: [{
          price_data: {
            currency: "zar",
            product_data: {
              name: plan === "team"
                ? `DAQS Learn Team (${seats} seats)`
                : billing === "annual" ? "DAQS Learn Pro — Annual" : "DAQS Learn Pro — Monthly",
              description: "Full access to all courses, AI Tutor, and certificates",
            },
            unit_amount: priceZAR,
          },
          quantity: 1,
        }],
        success_url: `${appUrl}/dashboard/billing?status=success&provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/dashboard/billing?status=cancelled`,
        metadata: { plan, billing, seats: String(seats), userName },
      });
      return Response.json({ redirectUrl: session.url });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
