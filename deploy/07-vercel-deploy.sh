#!/bin/bash
# ============================================================
# DAQS Learn — Deploy Next.js frontend to Vercel
# Run this on your LOCAL machine (not the VPS)
# ============================================================
set -e

echo "==> [1/4] Install Vercel CLI"
npm install -g vercel

echo "==> [2/4] Login to Vercel"
vercel login

echo "==> [3/4] Link project (run from frontend/ directory)"
cd "$(dirname "$0")/../frontend"
vercel link

echo "==> [4/4] Deploy to production"
vercel --prod

echo ""
echo "============================================================"
echo "  Deployed to Vercel!"
echo ""
echo "  After deploy, set these environment variables in:"
echo "  https://vercel.com/dashboard → Your Project → Settings → Env Vars"
echo ""
echo "  REQUIRED:"
echo "  ANTHROPIC_API_KEY              (your Gemini/Google AI key — server-side only)"
echo "  NEXT_PUBLIC_APP_URL            https://learn.daqstech.com"
echo "  NEXT_PUBLIC_FIREBASE_*         (from Firebase console)"
echo ""
echo "  VPS SERVICES (fill in after running VPS scripts):"
echo "  NEXT_PUBLIC_JUPYTERHUB_URL     https://jupyter.daqstech.com"
echo "  NEXT_PUBLIC_CODESERVER_URL     https://code.daqstech.com"
echo "  NEXT_PUBLIC_LIVEKIT_URL        wss://livekit.daqstech.com"
echo "  LIVEKIT_API_KEY                (from 05-livekit.sh output)"
echo "  LIVEKIT_API_SECRET             (from 05-livekit.sh output)"
echo "  NEXT_PUBLIC_LABS_API_URL       https://labs.daqstech.com"
echo ""
echo "  PAYMENTS:"
echo "  PAYFAST_MERCHANT_ID"
echo "  PAYFAST_MERCHANT_KEY"
echo "  PAYFAST_PASSPHRASE"
echo "  STRIPE_SECRET_KEY"
echo "  OZOW_SITE_CODE"
echo "  OZOW_PRIVATE_KEY"
echo "  RESEND_API_KEY"
echo ""
echo "  Then add a custom domain in Vercel:"
echo "  learn.daqstech.com → point CNAME to cname.vercel-dns.com"
echo "============================================================"
