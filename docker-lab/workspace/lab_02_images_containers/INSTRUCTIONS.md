# Lab 02 — Managing Images & Containers

## Goal
Learn the core Docker commands for inspecting and controlling containers.

## Steps

1. Pull a small image:
   ```
   docker pull alpine:latest
   ```
2. Run it in the background, keeping it alive:
   ```
   docker run -d --name daqs-alpine alpine sleep 3600
   ```
3. List running containers:
   ```
   docker ps
   ```
4. Run a command *inside* the running container:
   ```
   docker exec daqs-alpine echo "I am alive"
   ```
5. Open an interactive shell inside it:
   ```
   docker exec -it daqs-alpine sh
   ```
   (type `exit` to leave)
6. View its logs:
   ```
   docker logs daqs-alpine
   ```
7. Stop and remove it:
   ```
   docker stop daqs-alpine
   docker rm daqs-alpine
   ```

## Verify
```
docker ps -a | grep daqs-alpine
```
Should return nothing — the container is gone.

## Stretch goal
Run three containers at once with different `--name` values, list them all
with `docker ps`, then stop and remove all three in a single command using
`docker rm -f $(docker ps -aq)`.
