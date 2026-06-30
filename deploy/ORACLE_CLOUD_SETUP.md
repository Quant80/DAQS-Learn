# Oracle Cloud Always Free — DAQS Learn Setup Guide

## What you get (free forever)
- 4 ARM cores (Ampere A1)
- 24 GB RAM
- 200 GB SSD
- 10 TB outbound traffic/month

This runs JupyterHub, code-server, LiveKit, and Docker Labs comfortably.

---

## Step 1 — Create Oracle Cloud account

1. Go to https://cloud.oracle.com
2. Click **Start for free**
3. Sign up — use `trymorencubecon@gmail.com`
4. A credit card is required for **identity verification only** — you will NOT be charged
5. Choose your home region: **South Africa (Johannesburg)** if available, otherwise **Germany (Frankfurt)** or **UK (London)** for best SA latency
6. Complete email verification and phone verification

---

## Step 2 — Create the VM instance

1. In the Oracle Cloud console, go to **Compute → Instances → Create Instance**
2. Change the following:
   - **Name:** `daqs-learn-server`
   - **Image:** Click "Change Image" → select **Ubuntu 22.04** (Canonical)
   - **Shape:** Click "Change Shape" → select:
     - Shape series: **Ampere** (ARM)
     - Shape: **VM.Standard.A1.Flex**
     - OCPUs: **4**
     - Memory: **24 GB**
   - **SSH keys:** Upload your public SSH key OR download the generated key pair
3. Click **Create**

Wait ~2 minutes for the instance to reach **Running** state.

Note the **Public IP address** from the instance details page.

---

## Step 3 — Open ports in Oracle Cloud firewall

Oracle Cloud has TWO layers of firewall. You must open ports in BOTH:

### Layer 1 — Security List (in the console)
1. Go to **Networking → Virtual Cloud Networks → your VCN → Security Lists → Default Security List**
2. Click **Add Ingress Rules** and add these rules:

| Source CIDR | Protocol | Port Range | Description          |
|-------------|----------|------------|----------------------|
| 0.0.0.0/0   | TCP      | 80         | HTTP                 |
| 0.0.0.0/0   | TCP      | 443        | HTTPS                |
| 0.0.0.0/0   | TCP      | 7881       | LiveKit WebRTC TCP   |
| 0.0.0.0/0   | UDP      | 50000-60000| LiveKit WebRTC UDP   |

### Layer 2 — iptables on the VM (done automatically by the init script below)

---

## Step 4 — SSH into the server

```bash
ssh ubuntu@YOUR_INSTANCE_IP
```

(Default user on Oracle Cloud Ubuntu is `ubuntu`, not `root`)

---

## Step 5 — Run the DAQS init script

Copy the scripts to your server first (run from your local machine in the deploy/ folder):

```bash
scp *.sh ubuntu@YOUR_INSTANCE_IP:~/
```

Then SSH in and run:

```bash
ssh ubuntu@YOUR_INSTANCE_IP
sudo bash 01-vps-init.sh daqstech.com trymorencubecon@gmail.com
```

---

## Step 6 — Add DNS records

In your domain registrar (where daqstech.com DNS is managed), add A records:

| Hostname             | Type | Value              |
|----------------------|------|--------------------|
| jupyter.daqstech.com | A    | YOUR_INSTANCE_IP   |
| code.daqstech.com    | A    | YOUR_INSTANCE_IP   |
| livekit.daqstech.com | A    | YOUR_INSTANCE_IP   |
| labs.daqstech.com    | A    | YOUR_INSTANCE_IP   |

Check propagation (wait 5–30 min then run):
```bash
dig jupyter.daqstech.com +short
# Should return YOUR_INSTANCE_IP
```

---

## Step 7 — SSL + Nginx

```bash
sudo bash 02-nginx-ssl.sh daqstech.com trymorencubecon@gmail.com
```

---

## Step 8 — Install services (run one by one)

```bash
sudo bash 03-jupyterhub.sh daqstech.com
sudo bash 04-codeserver.sh daqstech.com
sudo bash 05-livekit.sh daqstech.com
sudo bash 06-docker-labs.sh daqstech.com
```

Each script prints env vars to add to Vercel.

---

## Step 9 — Deploy frontend to Vercel

Run from your local machine (in the frontend/ folder):
```bash
bash ../deploy/07-vercel-deploy.sh
```

Then in Vercel dashboard:
- Settings → Environment Variables → paste all vars from the script outputs
- Domains → add `learn.daqstech.com`
- Add CNAME in DNS: `learn.daqstech.com → cname.vercel-dns.com`

---

## Troubleshooting

**Can't SSH in?**
- Make sure port 22 is open in Security List (it usually is by default)
- Use the key you downloaded/uploaded at instance creation

**Services not reachable after nginx + SSL?**
- Oracle Cloud iptables blocks ports by default. The init script handles this, but if not:
  ```bash
  sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
  sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
  sudo netfilter-persistent save
  ```

**DNS not resolving?**
- Wait up to 30 minutes
- Check with: `dig jupyter.daqstech.com @8.8.8.8`
