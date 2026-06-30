"use client";
import { useEffect, useState } from "react";
import { Tldraw, type Editor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const WS_URL = process.env.NEXT_PUBLIC_WHITEBOARD_URL ?? "wss://whiteboard.daqstech.com";

export default function TldrawWrapper({ roomId, transparent = false }: { roomId: string; transparent?: boolean }) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "synced" | "offline">("connecting");

  function onMount(e: Editor) {
    e.user.updateUserPreferences({ colorScheme: "dark" });
    setEditor(e);
  }

  useEffect(() => {
    if (!editor) return;

    const doc = new Y.Doc();
    let provider: InstanceType<typeof WebsocketProvider>;
    let applying = false;
    let timer: ReturnType<typeof setTimeout>;

    try {
      provider = new WebsocketProvider(WS_URL, `classroom-${roomId}`, doc);

      provider.on("sync", (isSynced: boolean) => {
        setSyncStatus(isSynced ? "synced" : "connecting");
        if (isSynced) {
          const snap = doc.getMap<string>("tldraw").get("snapshot");
          if (snap) {
            applying = true;
            try { editor.loadSnapshot(JSON.parse(snap)); } catch {}
            applying = false;
          }
        }
      });

      provider.on("status", ({ status }: { status: string }) => {
        if (status === "disconnected") setSyncStatus("offline");
      });

      // Push local changes to Yjs (debounced 250 ms)
      const cleanupListen = editor.store.listen(
        () => {
          if (applying) return;
          clearTimeout(timer);
          timer = setTimeout(() => {
            const snap = JSON.stringify(editor.getSnapshot());
            doc.transact(() => doc.getMap<string>("tldraw").set("snapshot", snap));
          }, 250);
        },
        { source: "user" }
      );

      // Apply remote changes
      doc.getMap<string>("tldraw").observe((event) => {
        if (event.transaction.local || applying) return;
        const snap = doc.getMap<string>("tldraw").get("snapshot");
        if (!snap) return;
        applying = true;
        try { editor.loadSnapshot(JSON.parse(snap)); } catch {}
        applying = false;
      });

      return () => {
        clearTimeout(timer);
        cleanupListen();
        provider.destroy();
        doc.destroy();
      };
    } catch {
      setSyncStatus("offline");
      doc.destroy();
    }
  }, [editor, roomId]);

  return (
    <div className="absolute inset-0" style={{ background: transparent ? "transparent" : undefined }}>
      {transparent && (
        <style>{`.tl-background { display: none !important; } .tl-canvas { background: transparent !important; }`}</style>
      )}
      {/* Sync status badge */}
      <div className="absolute top-2 right-2 z-10 pointer-events-none">
        {syncStatus === "connecting" && (
          <span className="text-[10px] text-white/30 bg-black/50 px-2 py-1 rounded-full">
            Connecting sync…
          </span>
        )}
        {syncStatus === "synced" && (
          <span className="text-[10px] text-violet-400/70 bg-black/50 px-2 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Live sync
          </span>
        )}
        {syncStatus === "offline" && (
          <span className="text-[10px] text-amber-400/60 bg-black/50 px-2 py-1 rounded-full">
            Offline — local only
          </span>
        )}
      </div>

      <Tldraw
        persistenceKey={`daqs-classroom-${roomId}`}
        autoFocus={false}
        onMount={onMount}
      />
    </div>
  );
}
