#!/bin/bash
# ============================================================
# DAQS Learn — Docker Labs API (Phase 7)
# Isolated Python containers per learner session
# ============================================================
set -e

DOMAIN="${1:-daqstech.com}"

echo "==> [1/4] Pull Python Docker image"
docker pull python:3.11-slim

echo "==> [2/4] Build DAQS Labs Docker image (with data science packages)"
mkdir -p /opt/daqs/labs
cat > /opt/daqs/labs/Dockerfile << 'EOF'
FROM python:3.11-slim

RUN pip install --no-cache-dir \
    numpy pandas matplotlib seaborn scipy scikit-learn \
    plotly ipython jupyterlab \
    requests beautifulsoup4 \
    sqlalchemy

WORKDIR /workspace
ENV PYTHONUNBUFFERED=1
EOF

docker build -t daqs-lab /opt/daqs/labs/

echo "==> [3/4] Create Labs API server (FastAPI)"
pip3 install --quiet fastapi uvicorn python-multipart

cat > /opt/daqs/labs/api.py << 'PYEOF'
"""
DAQS Docker Labs API
POST /run  { language, code }  → { output, error, exitCode }
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio, subprocess, tempfile, os, uuid

app = FastAPI(title="DAQS Labs API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

class RunRequest(BaseModel):
    language: str
    code: str

LANG_MAP = {
    "python": ("python3", ".py"),
    "javascript": ("node", ".js"),
    "typescript": ("npx ts-node", ".ts"),
    "bash": ("bash", ".sh"),
}

TIMEOUT = 15  # seconds per run

@app.post("/run")
async def run_code(req: RunRequest):
    lang = req.language.lower()
    if lang not in LANG_MAP:
        raise HTTPException(400, f"Unsupported language: {lang}")

    cmd_prefix, ext = LANG_MAP[lang]
    fname = f"/tmp/daqs_{uuid.uuid4().hex}{ext}"

    try:
        with open(fname, "w") as f:
            f.write(req.code)

        result = subprocess.run(
            ["docker", "run", "--rm",
             "--memory", "256m",
             "--cpus", "0.5",
             "--network", "none",
             "--read-only",
             "--tmpfs", "/tmp:size=10m",
             "-v", f"{fname}:/workspace/code{ext}:ro",
             "daqs-lab",
             *cmd_prefix.split(), f"/workspace/code{ext}"],
            capture_output=True,
            text=True,
            timeout=TIMEOUT,
        )
        return {
            "output": result.stdout[:8000],
            "error": result.stderr[:2000] if result.returncode != 0 else "",
            "exitCode": result.returncode,
        }
    except subprocess.TimeoutExpired:
        return {"output": "", "error": f"Execution timed out after {TIMEOUT}s", "exitCode": 1}
    finally:
        try: os.unlink(fname)
        except: pass

@app.get("/health")
def health(): return {"ok": True}
PYEOF

echo "==> [4/4] Create systemd service"
cat > /etc/systemd/system/daqs-labs.service << 'EOF'
[Unit]
Description=DAQS Docker Labs API
After=network.target docker.service

[Service]
Type=simple
User=daqs
WorkingDirectory=/opt/daqs/labs
ExecStart=/usr/local/bin/uvicorn api:app --host 127.0.0.1 --port 9000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now daqs-labs

echo ""
echo "============================================================"
echo "  Docker Labs API is running on port 9000!"
echo "  Public URL: https://labs.$DOMAIN/run"
echo ""
echo "  Add to .env.local:"
echo "  NEXT_PUBLIC_LABS_API_URL=https://labs.$DOMAIN"
echo "============================================================"
