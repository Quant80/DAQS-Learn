# Lab 01 — Write Your First Dockerfile

## Goal
Containerize a tiny Python app: write a `Dockerfile`, build an image, and run it.

## Files here
- `app.py` — a small script that prints a greeting
- `Dockerfile` — **incomplete**, has TODOs for you to fill in

## Steps

1. Open `Dockerfile` and complete the TODOs (use `nano Dockerfile` or `vim Dockerfile`)
2. Build the image:
   ```
   docker build -t daqs-hello .
   ```
3. Run a container from it:
   ```
   docker run --rm daqs-hello
   ```
4. You should see: `Hello from inside a container, DAQS learner!`

## Verify
```
docker images | grep daqs-hello
```
Should list your built image.

## Stretch goal
Change `app.py` to accept a name as an argument and print a personalized
greeting. Rebuild and run with `docker run --rm daqs-hello YourName`.
