#!/bin/bash
# ============================================================
# DAQS Learn — code-server (OpenVSCode in browser) — Phase 6
# Each learner gets an isolated workspace
# ============================================================
set -e

DOMAIN="${1:-daqstech.com}"
CS_PASSWORD="${2:-$(openssl rand -hex 16)}"

echo "==> [1/4] Install code-server"
curl -fsSL https://code-server.dev/install.sh | sh

echo "==> [2/4] Configure code-server"
mkdir -p /opt/daqs/codeserver
cat > /opt/daqs/codeserver/config.yaml << EOF
bind-addr: 127.0.0.1:8080
auth: password
password: $CS_PASSWORD
cert: false
user-data-dir: /opt/daqs/codeserver/user-data
extensions-dir: /opt/daqs/codeserver/extensions
EOF

echo "==> [3/4] Pre-install useful VS Code extensions"
# Run code-server once briefly to let it initialize, then install extensions
code-server --config /opt/daqs/codeserver/config.yaml \
  --install-extension ms-python.python \
  --install-extension ms-toolsai.jupyter \
  --install-extension esbenp.prettier-vscode \
  --install-extension bradlc.vscode-tailwindcss \
  --install-extension dbaeumer.vscode-eslint \
  2>/dev/null || true

echo "==> [4/4] Create systemd service"
cat > /etc/systemd/system/codeserver.service << 'EOF'
[Unit]
Description=DAQS code-server
After=network.target

[Service]
Type=simple
User=daqs
WorkingDirectory=/opt/daqs/codeserver
ExecStart=/usr/bin/code-server --config /opt/daqs/codeserver/config.yaml
Restart=always
RestartSec=5
Environment="HOME=/opt/daqs/codeserver"

[Install]
WantedBy=multi-user.target
EOF

mkdir -p /opt/daqs/codeserver/{user-data,extensions,workspace}
chown -R daqs:daqs /opt/daqs/codeserver

systemctl daemon-reload
systemctl enable --now codeserver

echo ""
echo "============================================================"
echo "  code-server is running!"
echo "  URL:      https://code.$DOMAIN"
echo "  Password: $CS_PASSWORD"
echo ""
echo "  Save this password — add it to your .env.local:"
echo "  NEXT_PUBLIC_CODESERVER_URL=https://code.$DOMAIN"
echo "  CODESERVER_PASSWORD=$CS_PASSWORD"
echo "============================================================"
