# DAQS Learn — VPS Deployment Guide

## Architecture

```
learn.daqstech.com   →  Vercel (Next.js frontend)
jupyter.daqstech.com →  Hetzner VPS (JupyterHub)
code.daqstech.com    →  Hetzner VPS (code-server)
livekit.daqstech.com →  Hetzner VPS (LiveKit WebRTC)
labs.daqstech.com    →  Hetzner VPS (Docker Labs API)
```

## Recommended Hetzner Server

**CPX31** — 4 vCPUs, 8 GB RAM, 80 GB SSD — ~€11/mo
- Location: Helsinki (best latency to South Africa)
- OS: Ubuntu 22.04 LTS

## Step-by-Step Setup

### Step 1 — Provision Hetzner server
1. Go to https://console.hetzner.cloud
2. Create Project → Add Server
3. Select: **Helsinki**, **Ubuntu 22.04**, **CPX31**
4. Add your SSH key
5. Note the server IP address

### Step 2 — SSH in and run init script
```bash
ssh root@YOUR_SERVER_IP
curl -O https://raw.githubusercontent.com/.../01-vps-init.sh
bash 01-vps-init.sh daqstech.com trymorencubecon@gmail.com
```

Or copy scripts manually:
```bash
scp deploy/*.sh root@YOUR_SERVER_IP:/root/
ssh root@YOUR_SERVER_IP
bash 01-vps-init.sh daqstech.com trymorencubecon@gmail.com
```

### Step 3 — Add DNS records
In your domain registrar (where daqstech.com is registered), add these A records:

| Hostname             | Type | Value          |
|----------------------|------|----------------|
| learn.daqstech.com   | A    | YOUR_SERVER_IP |
| jupyter.daqstech.com | A    | YOUR_SERVER_IP |
| code.daqstech.com    | A    | YOUR_SERVER_IP |
| livekit.daqstech.com | A    | YOUR_SERVER_IP |
| labs.daqstech.com    | A    | YOUR_SERVER_IP |

Wait for DNS propagation (5–30 minutes). Check with:
```bash
dig jupyter.daqstech.com
```

### Step 4 — SSL + Nginx
```bash
bash 02-nginx-ssl.sh daqstech.com trymorencubecon@gmail.com
```

### Step 5 — Install services
Run each in order:
```bash
bash 03-jupyterhub.sh daqstech.com
bash 04-codeserver.sh daqstech.com
bash 05-livekit.sh daqstech.com
bash 06-docker-labs.sh daqstech.com
```

Each script prints the env vars to add to Vercel.

### Step 6 — Deploy to Vercel (from your local machine)
```bash
bash 07-vercel-deploy.sh
```

Then in the Vercel dashboard:
1. Settings → Environment Variables → add all the vars from the VPS script outputs
2. Domains → add `learn.daqstech.com`
3. In DNS, add a CNAME: `learn.daqstech.com → cname.vercel-dns.com`

## Service Management on VPS

```bash
# Check status
systemctl status jupyterhub
systemctl status codeserver
systemctl status livekit
systemctl status daqs-labs

# Restart a service
systemctl restart jupyterhub

# View logs
journalctl -u jupyterhub -f
journalctl -u livekit -f
```

## Environment Variables Reference

### Vercel (production)
```
ANTHROPIC_API_KEY=...
NEXT_PUBLIC_APP_URL=https://learn.daqstech.com
NEXT_PUBLIC_JUPYTERHUB_URL=https://jupyter.daqstech.com
NEXT_PUBLIC_CODESERVER_URL=https://code.daqstech.com
NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.daqstech.com
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
NEXT_PUBLIC_LABS_API_URL=https://labs.daqstech.com
PAYFAST_MERCHANT_ID=...
PAYFAST_MERCHANT_KEY=...
PAYFAST_PASSPHRASE=...
STRIPE_SECRET_KEY=...
OZOW_SITE_CODE=...
OZOW_PRIVATE_KEY=...
RESEND_API_KEY=...
```

### Firebase (all NEXT_PUBLIC_)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=daqs-eb2ae
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```
