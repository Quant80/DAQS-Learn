"use client";
import { useEffect, useState } from "react";
import { Tldraw, type Editor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const WS_URL = process.env.NEXT_PUBLIC_WHITEBOARD_URL ?? "wss://whiteboard.daqstech.com";

export default function TldrawWrapper({
  roomId,
  transparent = false,
  onEditorReady,
}: {
  roomId: string;
  transparent?: boolean;
  onEditorReady?: (editor: Editor) => void;
}) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "synced" | "local">("local");

  function onMount(e: Editor) {
    e.user.updateUserPreferences({ colorScheme: "dark" });
    setEditor(e);
    onEditorReady?.(e);
  }

  useEffect(() => {
    if (!editor) return;
    const hasServer = !!process.env.NEXT_PUBLIC_WHITEBOARD_URL;
    if (!hasServer) return;

    const doc = new Y.Doc();
    let provider: InstanceType<typeof WebsocketProvider> | null = null;
    let applying = false;
    let debounce: ReturnType<typeof setTimeout>;
    let cleanupListen: (() => void) | undefined;

    const giveUpTimer = setTimeout(() => {
      setSyncStatus("local");
      try { provider?.destroy(); } catch {}
      doc.destroy();
    }, 5000);

    try {
      setSyncStatus("connecting");
      provider = new WebsocketProvider(WS_URL, `classroom-${roomId}`, doc, { connect: true });

      provider.on("sync", (isSynced: boolean) => {
        if (!isSynced) return;
        clearTimeout(giveUpTimer);
        setSyncStatus("synced");
        const snap = doc.getMap<string>("tldraw").get("snapshot");
        if (snap) {
          applying = true;
          try { editor.loadSnapshot(JSON.parse(snap)); } catch {}
          applying = false;
        }
      });

      provider.on("status", ({ status }: { status: string }) => {
        if (status === "disconnected") setSyncStatus("local");
      });

      cleanupListen = editor.store.listen(
        () => {
          if (applying) return;
          clearTimeout(debounce);
          debounce = setTimeout(() => {
            const snap = JSON.stringify(editor.getSnapshot());
            doc.transact(() => doc.getMap<string>("tldraw").set("snapshot", snap));
          }, 300);
        },
        { source: "user" }
      );

      doc.getMap<string>("tldraw").observe((event) => {
        if (event.transaction.local || applying) return;
        const snap = doc.getMap<string>("tldraw").get("snapshot");
        if (!snap) return;
        applying = true;
        try { editor.loadSnapshot(JSON.parse(snap)); } catch {}
        applying = false;
      });

    } catch {
      clearTimeout(giveUpTimer);
      setSyncStatus("local");
      doc.destroy();
    }

    return () => {
      clearTimeout(giveUpTimer);
      clearTimeout(debounce);
      cleanupListen?.();
      try { provider?.destroy(); } catch {}
      doc.destroy();
    };
  }, [editor, roomId]);

  return (
    <div className="absolute inset-0" style={{ background: transparent ? "transparent" : undefined }}>
      {transparent && (
        <style>{`
          .tl-background { display: none !important; }
          .tl-canvas { background: transparent !important; }
          .tl-container { pointer-events: auto !important; }
          .tlui-toolbar, .tlui-panel, .tlui-menu-zone, .tlui-help-menu { pointer-events: auto !important; }
        `}</style>
      )}

      <Tldraw
        persistenceKey={`daqs-classroom-${roomId}`}
        autoFocus={false}
        onMount={onMount}
      />

      {/* Sync badge — top-right, pointer-events-none so it never blocks drawing */}
      <div className="absolute top-2 right-2 z-20 pointer-events-none">
        {syncStatus === "connecting" && (
          <span className="text-[10px] text-white/40 bg-black/50 px-2 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
            Connecting…
          </span>
        )}
        {syncStatus === "synced" && (
          <span className="text-[10px] text-violet-400/70 bg-black/50 px-2 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Live sync
          </span>
        )}
        {syncStatus === "local" && (
          <span className="text-[10px] text-white/25 bg-black/40 px-2 py-1 rounded-full">
            Local
          </span>
        )}
      </div>
    </div>
  );
}
