"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  LiveKitRoom, VideoConference, useRoomContext,
  useTracks, VideoTrack, RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomEvent, DisconnectReason, Track } from "livekit-client";
import type { TrackReference, TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { useClassroom } from "@/store/classroom";
import { useAuthStore } from "@/store/auth";
import type { ClassSession } from "@/store/classroom";

const Whiteboard = dynamic(() => import("@/components/TldrawWrapper"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02] text-white/30 text-sm">
      Loading whiteboard…
    </div>
  ),
});

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? "wss://livekit.daqstech.com";

function DisconnectHandler({ onLeave }: { onLeave: () => void }) {
  const room = useRoomContext();
  const cb = useCallback((reason?: DisconnectReason) => {
    if (
      reason === DisconnectReason.CLIENT_INITIATED ||
      reason === DisconnectReason.ROOM_CLOSED ||
      reason === DisconnectReason.PARTICIPANT_REMOVED
    ) {
      onLeave();
    }
  }, [onLeave]);

  useEffect(() => {
    room.on(RoomEvent.Disconnected, cb);
    return () => { room.off(RoomEvent.Disconnected, cb); };
  }, [room, cb]);

  return null;
}

// Sync the shared document URL to all participants via LiveKit data channel
function DocSync({ isHost, docUrl, onDocUrl }: {
  isHost: boolean;
  docUrl: string;
  onDocUrl: (url: string) => void;
}) {
  const room = useRoomContext();
  const onDocUrlRef = useRef(onDocUrl);
  useEffect(() => { onDocUrlRef.current = onDocUrl; });

  // Host broadcasts URL whenever it changes
  useEffect(() => {
    if (!isHost) return;
    const data = new TextEncoder().encode(JSON.stringify({ type: "daqs_doc", url: docUrl }));
    room.localParticipant.publishData(data, { reliable: true }).catch(() => {});
  }, [docUrl, isHost, room]);

  // All participants receive URL from host
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (payload: Uint8Array, ..._args: any[]) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        if (msg.type === "daqs_doc") onDocUrlRef.current(msg.url ?? "");
      } catch {}
    };
    room.on(RoomEvent.DataReceived, handler);
    return () => { room.off(RoomEvent.DataReceived, handler); };
  }, [room]);

  return null;
}

// Renders inside LiveKitRoom — detects screen share and activates whiteboard overlay automatically
function ClassroomVideoArea({ roomId, visible }: { roomId: string; visible: boolean }) {
  const allScreenTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }]
  );
  const screenTracks = (allScreenTracks as TrackReferenceOrPlaceholder[]).filter(
    (t): t is TrackReference => "publication" in t
  );

  const allCamTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: false }]
  );
  const camTracks = (allCamTracks as TrackReferenceOrPlaceholder[]).filter(
    (t): t is TrackReference => "publication" in t
  );

  const hasScreenShare = screenTracks.length > 0;
  const [annotationsOn, setAnnotationsOn] = useState(true);

  return (
    <div
      className="flex-1 min-h-0 relative"
      style={{ display: visible ? undefined : "none" }}
    >
      <RoomAudioRenderer />

      {hasScreenShare ? (
        /* ── Screen-share + annotation overlay ── */
        <div className="absolute inset-0 bg-black flex flex-col">
          {/* Screen share video as background */}
          <div className="flex-1 min-h-0 relative">
            <VideoTrack
              trackRef={screenTracks[0]}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            {/* Whiteboard annotation layer */}
            {annotationsOn && (
              <div className="absolute inset-0 z-10">
                <Whiteboard roomId={roomId} transparent />
              </div>
            )}

            {/* Annotation toggle */}
            <button
              onClick={() => setAnnotationsOn((v) => !v)}
              className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 text-[11px] px-3 py-1 rounded-full border transition-all ${
                annotationsOn
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-black/50 border-white/15 text-white/40 hover:text-white"
              }`}
            >
              ✏️ {annotationsOn ? "Annotations on — click to hide" : "Annotations off — click to draw"}
            </button>

            {/* Floating webcam tiles */}
            {camTracks.length > 0 && (
              <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
                {camTracks.slice(0, 5).map((track) => (
                  <div
                    key={track.participant.identity}
                    className="w-28 rounded-lg overflow-hidden border border-white/15 bg-black shadow-lg"
                  >
                    <VideoTrack
                      trackRef={track}
                      style={{ width: "100%", height: "80px", objectFit: "cover" }}
                    />
                    <div className="text-white/50 text-[9px] text-center py-0.5 bg-black/60 truncate px-1">
                      {track.participant.name ?? track.participant.identity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Normal video grid ── */
        <div data-lk-theme="default" style={{ height: "100%" }}>
          <VideoConference />
        </div>
      )}
    </div>
  );
}

const TRACKS = [
  "Python", "Data Science", "Machine Learning", "Deep Learning",
  "AI & LLMs", "Agentic AI", "Web Development", "Data Engineering",
  "Mathematics", "Career & Ethics", "General",
];

const DURATIONS = [30, 45, 60, 90, 120];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return "Starting now";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return `in ${Math.floor(h / 24)}d`;
  if (h > 0) return `in ${h}h ${m}m`;
  return `in ${m}m`;
}

// ── Live room ──────────────────────────────────────────────────────────────────
function LiveRoom({ session, onLeave }: { session: ClassSession; onLeave: () => void }) {
  const { endClass } = useClassroom();
  const user = useAuthStore((s) => s.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"video" | "whiteboard" | "document">("video");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [docInputUrl, setDocInputUrl] = useState("");
  const [docUploading, setDocUploading] = useState(false);
  const [docUploadError, setDocUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHost = user?.email === session.hostEmail;

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  useEffect(() => {
    const participantName = user?.full_name ?? user?.email ?? "Learner";
    const hostFlag = !!isHost;
    fetch("/api/classroom/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName: session.roomId, participantName, isHost: hostFlag }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.token) setToken(d.token);
        else setError(d.error ?? "Failed to get room token");
        setConnecting(false);
      })
      .catch(() => {
        setError("Could not reach LiveKit server — check your connection");
        setConnecting(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.roomId]);

  async function uploadFile(file: File) {
    setDocUploading(true);
    setDocUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/classroom/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setDocUrl(data.url);
    } catch (e: unknown) {
      setDocUploadError((e as Error).message ?? "Upload failed");
    } finally {
      setDocUploading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(session.roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleEnd() {
    endClass(session.id);
    onLeave();
  }

  // Fixed overlay that escapes the dashboard sidebar — gives true full viewport
  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col bg-[#09090f]">
      {/* Toolbar */}
      <div className="h-10 bg-[#0d0d16] border-b border-white/8 flex items-center px-3 gap-2 shrink-0">
        <button onClick={onLeave} className="text-white/40 hover:text-white text-xs transition-colors shrink-0">
          ← Back
        </button>
        <div className="w-px h-4 bg-white/10 shrink-0" />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-white font-semibold text-xs truncate max-w-[100px] sm:max-w-[200px]">{session.title}</span>
          <span className="text-[9px] text-red-400 font-bold bg-red-500/15 border border-red-500/25 px-1.5 py-0.5 rounded-full shrink-0">LIVE</span>
        </div>

        {/* View tabs */}
        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5 mx-1.5 shrink-0">
          <button
            onClick={() => setView("video")}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
              view === "video" ? "bg-sky-500/20 text-sky-300" : "text-white/40 hover:text-white"
            }`}
          >
            📹 Video
          </button>
          <button
            onClick={() => setView("whiteboard")}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
              view === "whiteboard" ? "bg-violet-500/20 text-violet-300" : "text-white/40 hover:text-white"
            }`}
          >
            ✏️ Board
          </button>
          <button
            onClick={() => setView("document")}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
              view === "document" ? "bg-amber-500/20 text-amber-300" : "text-white/40 hover:text-white"
            }`}
          >
            📄 Docs
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="text-white/40 hover:text-white border border-white/10 rounded-lg px-2 py-1 transition-colors"
          >
            {isFullscreen ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 1H1v4M8 1h4v4M5 12H1V8M8 12h4V8" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 5V1h4M8 1h4v4M12 8v4H8M5 12H1V8" />
              </svg>
            )}
          </button>

          {/* Jitsi fallback */}
          <a
            href={`https://meet.jit.si/DAQS-${session.roomId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Jitsi Meet"
            className="text-[11px] text-white/30 hover:text-white/60 border border-white/8 hover:border-white/20 rounded-lg px-2 py-1 transition-colors hidden sm:flex items-center gap-1"
          >
            🎥 Jitsi
          </a>
          <button
            onClick={copyLink}
            className="text-[11px] text-white/50 hover:text-white border border-white/10 rounded-lg px-2.5 py-1 transition-colors"
          >
            🔗 {copied ? "Copied!" : "Invite"}
          </button>
          {isHost && (
            <button
              onClick={handleEnd}
              className="text-[11px] text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 rounded-lg px-2.5 py-1 transition-colors"
            >
              End class
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {connecting ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              Connecting to DAQS LiveKit…
            </div>
            <div className="text-white/20 text-xs">{LIVEKIT_URL}</div>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm px-6">
            <div className="text-4xl">⚠️</div>
            <div className="text-red-400 text-sm font-semibold">{error}</div>
            <p className="text-white/30 text-xs leading-relaxed">
              Make sure the LiveKit server is running at {LIVEKIT_URL} and your API key is correct.
            </p>
            <button onClick={onLeave} className="text-white/50 hover:text-white text-xs transition-colors">
              ← Back to classroom
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* LiveKit room — always mounted; ClassroomVideoArea shows/hides based on view */}
          <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={LIVEKIT_URL}
            style={{ display: "contents" }}
          >
            <DisconnectHandler onLeave={onLeave} />
            <DocSync isHost={isHost} docUrl={docUrl} onDocUrl={setDocUrl} />
            <ClassroomVideoArea roomId={session.roomId} visible={view === "video"} />
          </LiveKitRoom>

          {/* Whiteboard */}
          {view === "whiteboard" && (
            <div className="flex-1 min-h-0 relative overflow-hidden">
              {isHost && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-violet-500/10 border border-violet-500/25 text-violet-300/70 text-[10px] px-3 py-1 rounded-full pointer-events-none">
                  Students see and can draw on this board in real time
                </div>
              )}
              <Whiteboard roomId={session.roomId} />
            </div>
          )}

          {/* Document / PDF */}
          {view === "document" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.ppt,.pptx,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file);
                  e.target.value = "";
                }}
              />

              {isHost && !docUrl && (
                <div className="shrink-0 space-y-2 px-3 py-2.5 border-b border-white/10 bg-[#0d0d16]">
                  {/* Upload row */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={docUploading}
                      className="flex items-center gap-2 bg-violet-500/15 hover:bg-violet-500/25 disabled:opacity-50 border border-violet-500/30 text-violet-300 text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                      {docUploading ? (
                        <>
                          <span className="w-3 h-3 border border-violet-400/50 border-t-violet-400 rounded-full animate-spin" />
                          Uploading…
                        </>
                      ) : (
                        <>📁 Upload PDF / PPT</>
                      )}
                    </button>
                    <span className="text-white/20 text-xs">or paste a URL</span>
                    <input
                      value={docInputUrl}
                      onChange={(e) => setDocInputUrl(e.target.value)}
                      placeholder="https://…  (Google Slides embed, PDF link)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-sky-500/50"
                      onKeyDown={(e) => { if (e.key === "Enter" && docInputUrl.trim()) setDocUrl(docInputUrl.trim()); }}
                    />
                    <button
                      onClick={() => docInputUrl.trim() && setDocUrl(docInputUrl.trim())}
                      disabled={!docInputUrl.trim()}
                      className="bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-white text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                      Share →
                    </button>
                  </div>
                  {docUploadError && (
                    <p className="text-red-400 text-[11px]">{docUploadError}</p>
                  )}
                </div>
              )}

              {docUrl ? (
                <div className="flex-1 min-h-0 relative">
                  {isHost && (
                    <button
                      onClick={() => { setDocUrl(""); setDocInputUrl(""); setDocUploadError(""); }}
                      className="absolute top-2 right-2 z-10 text-[11px] text-white/40 hover:text-white bg-black/60 hover:bg-black/80 px-2.5 py-1 rounded-full transition-colors"
                    >
                      Change document
                    </button>
                  )}
                  <iframe
                    src={docUrl}
                    className="w-full h-full border-0"
                    allow="fullscreen"
                    title="Shared document"
                  />
                </div>
              ) : !isHost ? (
                <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                  Waiting for host to share a document…
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-3 max-w-sm">
                    <div className="text-4xl">📄</div>
                    <p className="text-white/50 text-sm font-medium">Share a document with students</p>
                    <p className="text-white/25 text-xs leading-relaxed">
                      Upload a PDF or PowerPoint directly, or paste a public URL.<br />
                      For Google Slides: File → Share → Publish to web → copy the embed link.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={docUploading}
                      className="bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 text-sm px-5 py-2.5 rounded-xl transition-colors"
                    >
                      📁 Upload PDF or PowerPoint
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Schedule modal ─────────────────────────────────────────────────────────────
function ScheduleModal({ onClose }: { onClose: () => void }) {
  const { scheduleClass, startClass } = useClassroom();
  const user = useAuthStore((s) => s.user);

  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
  const defaultDt = new Date(now.getTime() + 24 * 3600000).toISOString().slice(0, 16);

  const [form, setForm] = useState({
    title: "", description: "", scheduledAt: defaultDt,
    durationMins: 60, track: "General", maxParticipants: 30, startNow: false,
  });

  function set(k: string, v: unknown) { setForm((f) => ({ ...f, [k]: v })); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !form.title.trim()) return;
    const session = scheduleClass({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      hostName: user.full_name ?? user.email ?? "Host",
      hostEmail: user.email ?? "",
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      durationMins: form.durationMins,
      track: form.track,
      maxParticipants: form.maxParticipants,
    });
    if (form.startNow) startClass(session.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        className="bg-[#111118] border border-white/12 rounded-2xl p-6 w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-bold text-base">Schedule a class</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Class title *</label>
            <input
              required value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Introduction to Pandas"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1 block">Description (optional)</label>
            <textarea
              value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={2} placeholder="What will be covered?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Date & time</label>
              <input
                type="datetime-local" value={form.scheduledAt}
                onChange={(e) => set("scheduledAt", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Duration</label>
              <select
                value={form.durationMins} onChange={(e) => set("durationMins", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d} className="bg-[#111118]">{d} min</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Track</label>
              <select
                value={form.track} onChange={(e) => set("track", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
              >
                {TRACKS.map((t) => (
                  <option key={t} value={t} className="bg-[#111118]">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Max participants</label>
              <input
                type="number" min={2} max={500} value={form.maxParticipants}
                onChange={(e) => set("maxParticipants", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox" checked={form.startNow}
              onChange={(e) => set("startNow", e.target.checked)}
              className="w-4 h-4 rounded accent-sky-500"
            />
            <span className="text-white/70 text-sm">Start immediately</span>
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="submit"
            className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
            {form.startNow ? "Schedule & Start →" : "Schedule class"}
          </button>
          <button type="button" onClick={onClose}
            className="px-4 text-white/40 hover:text-white border border-white/10 rounded-xl text-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Session card ───────────────────────────────────────────────────────────────
function SessionCard({ session, onJoin, onStart, onDelete }: {
  session: ClassSession;
  onJoin: () => void;
  onStart: () => void;
  onDelete: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const isHost = user?.email === session.hostEmail;

  return (
    <div className={`bg-white/[0.03] border rounded-2xl p-5 flex gap-4 items-start ${
      session.status === "live" ? "border-red-500/30 bg-red-500/5" : "border-white/8"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
        session.status === "live" ? "bg-red-500/20" :
        session.status === "ended" ? "bg-white/5" : "bg-sky-500/15"
      }`}>
        {session.status === "live" ? "📡" : session.status === "ended" ? "📼" : "📅"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-white font-semibold text-sm">{session.title}</span>
          {session.status === "live" && (
            <span className="text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE
            </span>
          )}
        </div>

        {session.description && (
          <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{session.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-white/35">
          <span>🗓 {formatDate(session.scheduledAt)} · {formatTime(session.scheduledAt)}</span>
          <span>⏱ {session.durationMins} min</span>
          {session.track && <span>📚 {session.track}</span>}
          <span>👤 {session.hostName}</span>
          {session.status === "scheduled" && <span className="text-sky-400 font-semibold">{timeUntil(session.scheduledAt)}</span>}
          {session.status === "ended" && session.participantCount && <span>👥 {session.participantCount} joined</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        {session.status === "live" && (
          <button onClick={onJoin}
            className="bg-red-500 hover:bg-red-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors">
            Join →
          </button>
        )}
        {session.status === "scheduled" && isHost && (
          <button onClick={onStart}
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors">
            Start →
          </button>
        )}
        {session.status === "scheduled" && !isHost && (
          <div className="text-xs text-white/30 text-center px-2">Waiting for host</div>
        )}
        {isHost && session.status !== "live" && (
          <button onClick={onDelete}
            className="text-white/25 hover:text-red-400 text-xs transition-colors text-center">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

// ── Join by room ID ────────────────────────────────────────────────────────────
function QuickJoin({ onJoin }: { onJoin: (roomId: string, title: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={val} onChange={(e) => setVal(e.target.value)}
        placeholder="Paste Room ID…"
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/50"
      />
      <button
        onClick={() => {
          if (!val.trim()) return;
          onJoin(val.trim(), "Guest Room");
          setVal("");
        }}
        className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors shrink-0"
      >
        Join →
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ClassroomPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { activeSessionId, scheduleClass, startClass, endClass, deleteSession, joinClass, leaveClass, getUpcoming, getLive, getPast, getActiveSession } = useClassroom();
  const user = useAuthStore((s) => s.user);
  const [showSchedule, setShowSchedule] = useState(false);
  const [guestSession, setGuestSession] = useState<ClassSession | null>(null);

  void activeSessionId;

  if (!mounted) return null;

  const activeSession = guestSession ?? getActiveSession();

  if (activeSession) {
    return (
      <LiveRoom
        session={activeSession}
        onLeave={() => { leaveClass(); setGuestSession(null); }}
      />
    );
  }

  const live = getLive();
  const upcoming = getUpcoming();
  const past = getPast();

  function handleQuickJoin(roomId: string, title: string) {
    setGuestSession({
      id: "guest",
      title: title || "Guest Room",
      hostName: "Unknown",
      hostEmail: "",
      roomId,
      scheduledAt: new Date().toISOString(),
      durationMins: 60,
      status: "live",
    });
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-8">
      {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Classroom</h1>
          <p className="text-white/45 text-sm mt-1">Live virtual classes powered by self-hosted LiveKit</p>
        </div>
        <button
          onClick={() => setShowSchedule(true)}
          className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          + Schedule class
        </button>
      </div>

      {/* LiveKit status */}
      <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-emerald-300 text-xs font-semibold">DAQS LiveKit Server — Live on VPS</span>
          <span className="text-white/25 text-xs ml-2">{LIVEKIT_URL} · v1.13.2 · Oracle Cloud ARM</span>
        </div>
      </div>

      {/* Quick join */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 space-y-2">
        <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">Quick join</div>
        <p className="text-white/25 text-[11px]">Paste a Room ID shared by your host to join directly.</p>
        <QuickJoin onJoin={handleQuickJoin} />
      </div>

      {/* Live now */}
      {live.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live now
          </h2>
          {live.map((s) => (
            <SessionCard
              key={s.id} session={s}
              onJoin={() => joinClass(s.id)}
              onStart={() => startClass(s.id)}
              onDelete={() => deleteSession(s.id)}
            />
          ))}
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Upcoming</h2>
          {upcoming.map((s) => (
            <SessionCard
              key={s.id} session={s}
              onJoin={() => joinClass(s.id)}
              onStart={() => { startClass(s.id); joinClass(s.id); }}
              onDelete={() => deleteSession(s.id)}
            />
          ))}
        </section>
      )}

      {/* Empty state */}
      {live.length === 0 && upcoming.length === 0 && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-12 text-center space-y-4">
          <div className="text-5xl">📡</div>
          <h3 className="text-white font-bold text-lg">No classes scheduled</h3>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            Schedule a live class and share the Room ID with your students. Video, audio, whiteboard, and document sharing — all powered by your own LiveKit server.
          </p>
          <button
            onClick={() => setShowSchedule(true)}
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Schedule your first class →
          </button>
        </div>
      )}

      {/* Past classes */}
      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Past classes</h2>
          {past.slice(0, 5).map((s) => (
            <SessionCard
              key={s.id} session={s}
              onJoin={() => {}}
              onStart={() => {}}
              onDelete={() => deleteSession(s.id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
