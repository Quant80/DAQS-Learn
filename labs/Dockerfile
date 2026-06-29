# ── DAQS Labs — interactive sandbox environment ────────────────────────────
# Stage 1: grab the ttyd binary from the official image
FROM tsl0922/ttyd:latest AS ttyd-source

# Stage 2: build the full lab environment
FROM python:3.12-slim

# Copy ttyd binary
COPY --from=ttyd-source /usr/local/bin/ttyd /usr/local/bin/ttyd

# System tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl wget vim nano \
    nodejs npm \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python data-science stack
RUN pip install --no-cache-dir \
    numpy pandas matplotlib seaborn scikit-learn \
    requests httpx \
    fastapi "uvicorn[standard]" \
    ipython

# Workspace
WORKDIR /workspace
COPY workspace/ /workspace/

RUN echo 'export PS1="\[\033[0;36m\]daqs-labs\[\033[0m\]:\[\033[0;33m\]\w\[\033[0m\]\$ "' >> /root/.bashrc && \
    echo 'alias ll="ls -lah --color=auto"' >> /root/.bashrc && \
    echo 'echo ""' >> /root/.bashrc && \
    echo 'echo "  Welcome to DAQS Labs  "' >> /root/.bashrc && \
    echo 'echo "  Type: ls  to see available labs"' >> /root/.bashrc && \
    echo 'echo ""' >> /root/.bashrc

EXPOSE 7681

CMD ["ttyd", "--port", "7681", "--writable", "--check-origin", "false", "bash"]
