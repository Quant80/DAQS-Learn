#!/bin/bash
# ============================================================
# DAQS Learn — Nginx reverse proxy + Let's Encrypt SSL
# Run AFTER DNS records have propagated (check: dig jupyter.daqstech.com)
# Usage: bash 02-nginx-ssl.sh daqstech.com your@email.com
# ============================================================
set -e

DOMAIN="${1:-daqstech.com}"
EMAIL="${2:-trymorencubecon@gmail.com}"

# ── Write Nginx config ─────────────────────────────────────
cat > /etc/nginx/sites-available/daqs << EOF
# ── JupyterHub ──────────────────────────────────────────────
server {
    listen 80;
    server_name jupyter.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support (needed for Jupyter kernels)
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}

# ── code-server (OpenVSCode) ─────────────────────────────────
server {
    listen 80;
    server_name code.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}

# ── LiveKit ──────────────────────────────────────────────────
server {
    listen 80;
    server_name livekit.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:7880;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}

# ── Docker Labs API ──────────────────────────────────────────
server {
    listen 80;
    server_name labs.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120;
    }
}
EOF

ln -sf /etc/nginx/sites-available/daqs /etc/nginx/sites-enabled/daqs
nginx -t && systemctl reload nginx

echo "==> Obtaining SSL certificates..."
certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  -d "jupyter.$DOMAIN" \
  -d "code.$DOMAIN" \
  -d "livekit.$DOMAIN" \
  -d "labs.$DOMAIN"

echo ""
echo "============================================================"
echo "  SSL certificates issued!"
echo "  Services will be available at:"
echo "    https://jupyter.$DOMAIN   (JupyterHub)"
echo "    https://code.$DOMAIN      (code-server)"
echo "    https://livekit.$DOMAIN   (LiveKit)"
echo "    https://labs.$DOMAIN      (Docker Labs)"
echo ""
echo "  Next: run 03-jupyterhub.sh, 04-codeserver.sh, etc."
echo "============================================================"
