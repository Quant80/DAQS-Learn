"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  plan: "free" | "pro" | "team";
  plan_source: "none" | "paid" | "admin_granted";
  tutor_uses_count: number;
  tutor_unlocked: boolean;
  is_locked: boolean;
  last_login_at: string | null;
  created_at: string;
}

const FREE_TUTOR_LIMIT = 2;

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminUsersPage() {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<AdminUser[]>("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function runAction(userId: number, action: string, body?: unknown) {
    setBusyId(userId);
    try {
      await api.post(`/admin/users/${userId}/${action}`, body ?? {});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>👥</span> Users
        </h1>
        <p className="text-white/45 text-sm mt-1">
          Every account, its plan, AI Tutor usage, and lock status.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-white/8 text-left text-white/40 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Tutor usage</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users === null ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-white/30">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-white/30">No users yet.</td></tr>
            ) : (
              users.map((u) => {
                const usageLabel = u.plan !== "free" || u.tutor_unlocked
                  ? "Unlimited"
                  : `${u.tutor_uses_count}/${FREE_TUTOR_LIMIT}`;
                const busy = busyId === u.id;
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 align-top">
                    <td className="px-4 py-3 text-white font-medium">
                      {u.full_name}
                      {isSelf && <span className="text-white/30 font-normal"> (you)</span>}
                    </td>
                    <td className="px-4 py-3 text-white/60">{u.email}</td>
                    <td className="px-4 py-3 text-white/50 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${
                          u.plan === "free" ? "text-white/50 border-white/15" : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        }`}>
                          {u.plan}
                        </span>
                        {u.plan_source === "admin_granted" && (
                          <span className="text-[10px] text-amber-400/70">(granted)</span>
                        )}
                      </div>
                      <div className="flex gap-1 mt-1.5">
                        {(["free", "pro", "team"] as const).filter((p) => p !== u.plan).map((p) => (
                          <button
                            key={p}
                            disabled={busy}
                            onClick={() => runAction(u.id, "plan", { plan: p })}
                            className="text-[10px] text-sky-400 hover:text-sky-300 border border-sky-500/25 hover:border-sky-500/40 rounded px-1.5 py-0.5 transition-all disabled:opacity-40"
                          >
                            → {p}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">
                      {usageLabel}
                      {u.plan === "free" && !u.tutor_unlocked && (
                        <button
                          disabled={busy}
                          onClick={() => runAction(u.id, "reset-quota")}
                          className="block text-[10px] text-sky-400 hover:text-sky-300 mt-1 disabled:opacity-40"
                        >
                          Reset
                        </button>
                      )}
                      {u.plan === "free" && !u.tutor_unlocked && (
                        <button
                          disabled={busy}
                          onClick={() => runAction(u.id, "unlock-tutor")}
                          className="block text-[10px] text-emerald-400 hover:text-emerald-300 mt-0.5 disabled:opacity-40"
                        >
                          Unlock tutor
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        u.is_locked
                          ? "text-red-400 border-red-500/30 bg-red-500/10"
                          : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                      }`}>
                        {u.is_locked ? "🔒 Locked" : "✓ Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{formatDate(u.last_login_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        disabled={busy || (isSelf && !u.is_locked)}
                        title={isSelf && !u.is_locked ? "You can't lock your own account" : undefined}
                        onClick={() => runAction(u.id, u.is_locked ? "unlock" : "lock")}
                        className="text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 transition-all disabled:opacity-40"
                      >
                        {busy ? "…" : u.is_locked ? "Unlock" : "Lock"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
