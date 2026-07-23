"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { courses } from "@/data/courses";

interface StudentListItem {
  id: number;
  email: string;
  full_name: string;
  role: string;
  plan: string;
  is_locked: boolean;
  last_login_at: string | null;
  created_at: string;
  enrollments_count: number;
  certificates_count: number;
}

interface StudentProfile {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  job_title: string | null;
  nationality: string | null;
  race: string | null;
}

interface StudentEnrollment {
  course_id: string;
  course_title: string;
  status: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percent: number;
}

interface StudentAttempt {
  template_id: string;
  template_title: string;
  completed_at: string | null;
  total_score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
}

interface StudentCertificate {
  verification_code: string;
  course_name: string;
  issued_at: string;
  revoked: boolean;
}

interface StudentCourseUnlock {
  course_id: string;
  course_title: string;
  granted_at: string;
  expires_at: string | null;
}

interface StudentDetail {
  id: number;
  email: string;
  full_name: string;
  role: string;
  plan: string;
  plan_source: string;
  is_locked: boolean;
  last_login_at: string | null;
  created_at: string;
  profile: StudentProfile;
  enrollments: StudentEnrollment[];
  attempts: StudentAttempt[];
  certificates: StudentCertificate[];
  unlocked_courses: StudentCourseUnlock[];
}

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

const PROFILE_FIELD_LABELS: { key: keyof StudentProfile; label: string }[] = [
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
  { key: "date_of_birth", label: "Date of birth" },
  { key: "gender", label: "Gender" },
  { key: "job_title", label: "Job title" },
  { key: "nationality", label: "Nationality" },
  { key: "race", label: "Race" },
];

function StudentDetailDrawer({ userId, onClose }: { userId: number; onClose: () => void }) {
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [error, setError] = useState("");
  const [unlockCourseId, setUnlockCourseId] = useState(courses[0]?.id ?? "");
  const [unlockDays, setUnlockDays] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .get<StudentDetail>(`/admin/students/${userId}`)
      .then(setDetail)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  async function grantUnlock() {
    setBusy(true);
    try {
      await api.post(`/admin/students/${userId}/unlock-course`, {
        course_id: unlockCourseId,
        days: unlockDays ? Number(unlockDays) : null,
      });
      setUnlockDays("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlock course");
    } finally {
      setBusy(false);
    }
  }

  async function revokeUnlock(courseId: string) {
    setBusy(true);
    try {
      await api.post(`/admin/students/${userId}/lock-course`, { course_id: courseId });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke unlock");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#070f20] border-l border-white/10 h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Student Record</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-sm">✕ Close</button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!detail && !error && <p className="text-white/40 text-sm">Loading…</p>}

        {detail && (
          <>
            <div>
              <p className="text-white font-semibold">{detail.full_name}</p>
              <p className="text-white/45 text-sm">{detail.email}</p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-white/50 capitalize border border-white/10 rounded-full px-2 py-0.5">{detail.role}</span>
                <span className="text-emerald-400 capitalize border border-emerald-500/30 bg-emerald-500/10 rounded-full px-2 py-0.5">{detail.plan}</span>
                {detail.is_locked && <span className="text-red-400 border border-red-500/30 bg-red-500/10 rounded-full px-2 py-0.5">🔒 Locked</span>}
              </div>
              <p className="text-white/30 text-xs mt-2">Last login: {formatDate(detail.last_login_at)}</p>
            </div>

            <section>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                Profile <span className="text-white/25 font-normal normal-case">(optional, self-reported)</span>
              </h3>
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                {PROFILE_FIELD_LABELS.map(({ key, label }) => (
                  <div key={key}>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">{label}</div>
                    <div className="text-white/70">{detail.profile[key] ?? "—"}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                Enrollments ({detail.enrollments.length})
              </h3>
              {detail.enrollments.length === 0 ? (
                <p className="text-white/30 text-sm">No courses enrolled.</p>
              ) : (
                <div className="space-y-2">
                  {detail.enrollments.map((e) => (
                    <div key={e.course_id} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{e.course_title}</span>
                        <span className="text-xs text-white/50 capitalize">{e.status}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${e.progress_percent}%` }} />
                        </div>
                        <span className="text-xs text-white/40 shrink-0">{e.progress_percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                Assessment attempts ({detail.attempts.length})
              </h3>
              {detail.attempts.length === 0 ? (
                <p className="text-white/30 text-sm">No assessments taken.</p>
              ) : (
                <div className="space-y-2">
                  {detail.attempts.map((a, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">{a.template_title}</div>
                        <div className="text-white/30 text-xs">{formatDate(a.completed_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-semibold">{a.percentage}%</div>
                        <div className={`text-xs font-semibold ${a.passed ? "text-emerald-400" : "text-red-400"}`}>
                          {a.passed ? "Pass" : "Fail"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                Certificates ({detail.certificates.length})
              </h3>
              {detail.certificates.length === 0 ? (
                <p className="text-white/30 text-sm">No certificates earned yet.</p>
              ) : (
                <div className="space-y-2">
                  {detail.certificates.map((c) => (
                    <div key={c.verification_code} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                      <div className="text-white text-sm font-medium">{c.course_name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-white/30 text-[10px] font-mono">{c.verification_code}</span>
                        <span className="text-white/40 text-xs">{formatDate(c.issued_at)}</span>
                      </div>
                      {c.revoked && <span className="text-red-400 text-xs font-semibold">Revoked</span>}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                Course Unlocks <span className="text-white/25 font-normal normal-case">(admin-granted, bypasses plan/promo)</span>
              </h3>
              {detail.unlocked_courses.length === 0 ? (
                <p className="text-white/30 text-sm mb-3">No individual course unlocks.</p>
              ) : (
                <div className="space-y-2 mb-3">
                  {detail.unlocked_courses.map((u) => (
                    <div key={u.course_id} className="bg-white/[0.03] border border-white/8 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">{u.course_title}</div>
                        <div className="text-white/30 text-xs">
                          {u.expires_at ? `Expires ${formatDate(u.expires_at)}` : "Permanent"}
                        </div>
                      </div>
                      <button
                        disabled={busy}
                        onClick={() => revokeUnlock(u.course_id)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/40 rounded-lg px-2.5 py-1 transition-all disabled:opacity-40"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3 flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1">Course</label>
                  <select
                    value={unlockCourseId}
                    onChange={(e) => setUnlockCourseId(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0a1628]">{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1">Days</label>
                  <input
                    type="number"
                    min={1}
                    value={unlockDays}
                    onChange={(e) => setUnlockDays(e.target.value)}
                    placeholder="Forever"
                    className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-white/25 focus:outline-none"
                  />
                </div>
                <button
                  disabled={busy}
                  onClick={grantUnlock}
                  className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40"
                >
                  Unlock
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentListItem[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const load = useCallback(async (q: string) => {
    try {
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await api.get<StudentListItem[]>(`/admin/students${params}`);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(query), 300);
    return () => clearTimeout(timeout);
  }, [query, load]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🎓</span> Student Records
        </h1>
        <p className="text-white/45 text-sm mt-1">
          Courses taken, completion status, marks, and certificates for every student.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email…"
        className="w-full max-w-sm bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-sky-500/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none transition-all"
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-white/8 text-left text-white/40 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Enrollments</th>
              <th className="px-4 py-3 font-medium">Certificates</th>
              <th className="px-4 py-3 font-medium">Last login</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {students === null ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30">Loading…</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30">No students found.</td></tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium">{s.full_name}</td>
                  <td className="px-4 py-3 text-white/60">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${
                      s.plan === "free" ? "text-white/50 border-white/15" : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    }`}>
                      {s.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{s.enrollments_count}</td>
                  <td className="px-4 py-3 text-white/60">{s.certificates_count}</td>
                  <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{formatDate(s.last_login_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      s.is_locked
                        ? "text-red-400 border-red-500/30 bg-red-500/10"
                        : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    }`}>
                      {s.is_locked ? "🔒 Locked" : "✓ Active"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedId !== null && (
        <StudentDetailDrawer userId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
