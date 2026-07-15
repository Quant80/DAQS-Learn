"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface AdminAccessRequest {
  id: number;
  status: "pending" | "approved" | "denied";
  created_at: string;
  resolved_at: string | null;
  user_id: number;
  user_email: string;
  user_full_name: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

const STATUS_STYLE: Record<AdminAccessRequest["status"], string> = {
  pending: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  approved: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  denied: "text-red-400 border-red-500/30 bg-red-500/10",
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminAccessRequest[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<AdminAccessRequest[]>("/admin/requests");
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function resolve(id: number, action: "approve" | "deny") {
    setBusyId(id);
    try {
      await api.post(`/admin/requests/${id}/${action}`, {});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  const pending = requests?.filter((r) => r.status === "pending") ?? [];
  const resolved = requests?.filter((r) => r.status !== "pending") ?? [];

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📨</span> AI Tutor Access Requests
        </h1>
        <p className="text-white/45 text-sm mt-1">
          Students who used up their free trial and asked for continued access.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">Pending ({pending.length})</h2>
        {requests === null ? (
          <p className="text-white/30 text-sm">Loading…</p>
        ) : pending.length === 0 ? (
          <p className="text-white/30 text-sm">Nothing pending.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((r) => (
              <div key={r.id} className="bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-white font-semibold text-sm">{r.user_full_name}</p>
                  <p className="text-white/40 text-xs">{r.user_email} · requested {formatDate(r.created_at)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={busyId === r.id}
                    onClick={() => resolve(r.id, "approve")}
                    className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40"
                  >
                    Approve
                  </button>
                  <button
                    disabled={busyId === r.id}
                    onClick={() => resolve(r.id, "deny")}
                    className="text-xs font-semibold text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {resolved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">Resolved</h2>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            {resolved.map((r) => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white/70 text-sm">{r.user_full_name}</p>
                  <p className="text-white/30 text-xs">{r.user_email}</p>
                </div>
                <span className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full border ${STATUS_STYLE[r.status]}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
