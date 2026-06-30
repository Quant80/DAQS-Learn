# Lab 03 — Persisting Data with Volumes

## Goal
Understand why container filesystems are throwaway by default, and how
volumes fix that.

## Part A — Prove data doesn't survive without a volume

```
docker run -d --name no-volume alpine sh -c "echo 'hello' > /data.txt && sleep 3600"
docker exec no-volume cat /data.txt   # works — file is there
docker rm -f no-volume
docker run -d --name no-volume-2 alpine sh -c "sleep 3600"
docker exec no-volume-2 cat /data.txt  # fails — different container, no file
docker rm -f no-volume-2
```

## Part B — Use a named volume to persist data

1. Create a volume:
   ```
   docker volume create daqs-data
   ```
2. Run a container that writes to it:
   ```
   docker run --rm -v daqs-data:/data alpine sh -c "echo 'persisted!' > /data/note.txt"
   ```
3. Run a *different* container, same volume:
   ```
   docker run --rm -v daqs-data:/data alpine cat /data/note.txt
   ```
4. You should see `persisted!` — the data survived because it lives in
   the volume, not the container.

## Verify
```
docker volume ls | grep daqs-data
```

## Cleanup
```
docker volume rm daqs-data
```

## Stretch goal
Bind-mount the current directory into a container instead of a named
volume: `docker run --rm -v "$(pwd)":/workspace alpine ls /workspace` —
notice it shows your actual lab files.
