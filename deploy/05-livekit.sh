#!/bin/bash
# ============================================================
# DAQS Learn — LiveKit Server (Phase 11)
# Self-hosted WebRTC video for Classroom
# ============================================================
set -e

DOMAIN="${1:-daqstech.com}"
LK_API_KEY="${2:-$(openssl rand -hex 12)}"
LK_API_SECRET="${3:-$(openssl rand -hex 32)}"

echo "==> [1/4] Download LiveKit server"
LIVEKIT_VERSION="1.7.2"
ARCH=$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')
wget -q "https://github.com/livekit/livekit/releases/download/v${LIVEKIT_VERSION}/livekit_${LIVEKIT_VERSION}_linux_${ARCH}.tar.gz" \
  -O /tmp/livekit.tar.gz
tar -xzf /tmp/livekit.tar.gz -C /usr/local/bin livekit-server
chmod +x /usr/local/bin/livekit-server

echo "==> [2/4] Generate LiveKit config"
mkdir -p /opt/daqs/livekit
cat > /opt/daqs/livekit/config.yaml << EOF
port: 7880
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 60000
  use_external_ip: true

keys:
  $LK_API_KEY: $LK_API_SECRET

logging:
  level: info

turn:
  enabled: false

redis:
  address: ""
EOF

echo "==> [3/4] Create systemd service"
cat > /etc/systemd/system/livekit.service << EOF
[Unit]
Description=DAQS LiveKit Server
After=network.target

[Service]
Type=simple
User=daqs
WorkingDirectory=/opt/daqs/livekit
ExecStart=/usr/local/bin/livekit-server --config /opt/daqs/livekit/config.yaml
Restart=always
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

chown -R daqs:daqs /opt/daqs/livekit
systemctl daemon-reload
systemctl enable --now livekit

echo "==> [4/4] Install LiveKit CLI (for token generation)"
wget -q "https://github.com/livekit/livekit-cli/releases/latest/download/lk_linux_amd64.tar.gz" \
  -O /tmp/lk.tar.gz
tar -xzf /tmp/lk.tar.gz -C /usr/local/bin lk 2>/dev/null || true
chmod +x /usr/local/bin/lk 2>/dev/null || true

echo ""
echo "============================================================"
echo "  LiveKit is running!"
echo "  WebSocket URL: wss://livekit.$DOMAIN"
echo ""
echo "  Add these to your Vercel environment variables:"
echo "  LIVEKIT_URL=wss://livekit.$DOMAIN"
echo "  LIVEKIT_API_KEY=$LK_API_KEY"
echo "  LIVEKIT_API_SECRET=$LK_API_SECRET"
echo ""
echo "  Also add to .env.local:"
echo "  NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.$DOMAIN"
echo "============================================================"
