# ── DAQS Docker Lab — isolated Docker-in-Docker sandbox ────────────────────
# Docker CLI only (no daemon here). Talks to the docker-lab-dind service over
# DOCKER_HOST — a nested, throwaway daemon, never the host's real socket.
FROM tsl0922/ttyd:latest AS ttyd-source

FROM docker:27-cli

RUN apk add --no-cache bash git curl nano vim docker-compose

COPY --from=ttyd-source /usr/bin/ttyd /usr/local/bin/ttyd

WORKDIR /workspace
COPY workspace/ /workspace/

RUN echo 'export PS1="\[\033[0;34m\]docker-lab\[\033[0m\]:\[\033[0;33m\]\w\[\033[0m\]\$ "' >> /root/.bashrc && \
    echo 'alias ll="ls -lah"' >> /root/.bashrc && \
    echo 'echo ""' >> /root/.bashrc && \
    echo 'echo "  Welcome to DAQS Docker Lab"' >> /root/.bashrc && \
    echo 'echo "  This is a real, isolated Docker environment."' >> /root/.bashrc && \
    echo 'echo "  Type: ls  to see available labs"' >> /root/.bashrc && \
    echo 'echo ""' >> /root/.bashrc

EXPOSE 7682
CMD ["ttyd", "--port", "7682", "--writable", "bash"]
