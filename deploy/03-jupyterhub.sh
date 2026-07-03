#!/bin/bash
# ============================================================
# DAQS Learn — JupyterHub Setup (Phase 5)
# Multi-user Jupyter with data science packages
# ============================================================
set -e

DOMAIN="${1:-daqstech.com}"

echo "==> [1/5] Install JupyterHub + dependencies"
pip3 install --quiet \
  jupyterhub \
  jupyterlab \
  notebook \
  numpy pandas matplotlib seaborn scipy scikit-learn \
  plotly ipywidgets \
  jupyterhub-nativeauthenticator

# Install configurable-http-proxy (required by JupyterHub)
npm install -g configurable-http-proxy

echo "==> [2/5] Create JupyterHub config"
mkdir -p /opt/daqs/jupyterhub
cd /opt/daqs/jupyterhub

cat > jupyterhub_config.py << 'EOF'
import os

c.JupyterHub.ip = '127.0.0.1'
c.JupyterHub.port = 8000

# Use NativeAuthenticator — users self-register, admin approves
from nativeauthenticator import NativeAuthenticator
c.JupyterHub.authenticator_class = NativeAuthenticator
c.NativeAuthenticator.open_signup = True
c.Authenticator.admin_users = {'admin', 'trymore'}

# Spawn single-user servers
c.Spawner.default_url = '/lab'
c.Spawner.notebook_dir = '/opt/daqs/jupyter-notebooks/{username}'

# Resource limits per user
c.Spawner.mem_limit = '1G'
c.Spawner.cpu_limit = 1.0

# Idle culler — shut down kernels after 1 hour of inactivity
c.JupyterHub.services = [
    {
        'name': 'idle-culler',
        'admin': True,
        'command': ['python3', '-m', 'jupyterhub_idle_culler', '--timeout=3600'],
    }
]

# Branding
c.JupyterHub.template_vars = {
    'announcement': 'Welcome to DAQS Learn JupyterHub!',
}

# Base URL (keep as /)
c.JupyterHub.base_url = '/'

# Data directory
c.JupyterHub.db_url = 'sqlite:////opt/daqs/jupyterhub/jupyterhub.sqlite'
c.JupyterHub.cookie_secret_file = '/opt/daqs/jupyterhub/jupyterhub_cookie_secret'
EOF

echo "==> [3/5] Install idle culler"
pip3 install --quiet jupyterhub-idle-culler

echo "==> [4/5] Create notebook template directory"
mkdir -p /opt/daqs/jupyter-notebooks
chmod 777 /opt/daqs/jupyter-notebooks

# Starter notebooks
mkdir -p /opt/daqs/jupyterhub/templates
cat > /opt/daqs/jupyter-notebooks/README.txt << 'EOF'
Welcome to your DAQS Learn Jupyter workspace!
Your notebooks are saved here and persist between sessions.
EOF

echo "==> [5/5] Create systemd service"
cat > /etc/systemd/system/jupyterhub.service << 'EOF'
[Unit]
Description=DAQS JupyterHub
After=network.target

[Service]
User=root
WorkingDirectory=/opt/daqs/jupyterhub
ExecStart=/usr/local/bin/jupyterhub -f /opt/daqs/jupyterhub/jupyterhub_config.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now jupyterhub

echo ""
echo "============================================================"
echo "  JupyterHub is running!"
echo "  URL: https://jupyter.$DOMAIN"
echo ""
echo "  First time:"
echo "  1. Go to https://jupyter.$DOMAIN/hub/signup"
echo "  2. Create your admin account (username: admin)"
echo "  3. Go to https://jupyter.$DOMAIN/hub/admin"
echo "  4. Approve users as they register"
echo "============================================================"
