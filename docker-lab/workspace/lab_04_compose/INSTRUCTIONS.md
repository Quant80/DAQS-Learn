# Lab 04 — Multi-Container Apps with docker-compose

## Goal
Run a small two-service app (a web server + Redis counter) with one command.

## Files here
- `docker-compose.yml` — defines both services
- `app.py` — a tiny web app that counts visits using Redis
- `Dockerfile` — builds the web app image

## Steps

1. Start everything:
   ```
   docker-compose up --build -d
   ```
2. Check both services are running:
   ```
   docker-compose ps
   ```
3. Hit the web app from inside the lab (no host networking here, so use the
   container's own network):
   ```
   docker run --rm --network lab_04_compose_default curlimages/curl curl http://web:5000
   ```
   Run it a few times — the counter should increase each time.
4. View logs from both services:
   ```
   docker-compose logs
   ```
5. Tear it down:
   ```
   docker-compose down
   ```

## Verify
After `docker-compose down`, `docker-compose ps` should show no running services.

## Stretch goal
Add a third service to `docker-compose.yml` — anything you like (try
`adminer` for a database UI, or another `alpine` sidecar) — and wire it
into the same network.
