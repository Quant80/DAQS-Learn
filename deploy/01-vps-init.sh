#!/bin/bash
# ============================================================
# DAQS Learn — VPS Initial Setup
# Run as root on a fresh Ubuntu 22.04 LTS Hetzner server
# Usage: bash 01-vps-init.sh yourdomain.com your@email.com
# ============================================================
set -e

DOMAIN="${1:-daqstech.com}"
EMAIL="${2:-trymorencubecon@gmail.com}"
DAQS_USER="daqs"

echo "==> [1/8] System update"
apt-get update -qq && apt-get upgrade -y -qq

echo "==> [2/8] Install essentials"
apt-get install -y -qq \
  curl wget git unzip htop ufw fail2ban \
  nginx certbot python3-certbot-nginx \
  docker.io docker-compose \
  python3 python3-pip python3-venv \
  nodejs npm

echo "==> [3/8] Create DAQS user"
if ! id "$DAQS_USER" &>/dev/null; then
  adduser --disabled-password --gecos "" $DAQS_USER
  usermod -aG sudo,docker $DAQS_USER
fi

echo "==> [4/8] Firewall (UFW)"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 7881/tcp   # LiveKit WebRTC TCP fallback
ufw allow 50000:60000/udp  # LiveKit WebRTC UDP range
echo "y" | ufw enable

# Oracle Cloud blocks ports at the iptables level even after UFW.
# These rules ensure traffic actually reaches the services.
apt-get install -y -qq iptables-persistent netfilter-persistent
iptables -I INPUT -p tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp --dport 443 -j ACCEPT
iptables -I INPUT -p tcp --dport 7881 -j ACCEPT
iptables -I INPUT -p udp --dport 50000:60000 -j ACCEPT
netfilter-persistent save

echo "==> [5/8] Fail2ban"
systemctl enable --now fail2ban

echo "==> [6/8] Docker"
systemctl enable --now docker

echo "==> [7/8] Node.js 20 LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

echo "==> [8/8] Directory structure"
mkdir -p /opt/daqs/{jupyterhub,codeserver,livekit,labs,uploads}
chown -R $DAQS_USER:$DAQS_USER /opt/daqs

echo ""
echo "============================================================"
echo "  VPS init complete!"
echo "  Server IP: $(curl -s ifconfig.me)"
echo ""
echo "  Next step: add these DNS A records to daqstech.com:"
echo "    learn.daqstech.com  →  $(curl -s ifconfig.me)"
echo "    jupyter.daqstech.com →  $(curl -s ifconfig.me)"
echo "    code.daqstech.com   →  $(curl -s ifconfig.me)"
echo "    livekit.daqstech.com →  $(curl -s ifconfig.me)"
echo ""
echo "  Then run: bash 02-nginx-ssl.sh $DOMAIN $EMAIL"
echo "============================================================"
