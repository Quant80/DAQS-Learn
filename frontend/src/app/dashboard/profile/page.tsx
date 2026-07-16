"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { COUNTRIES } from "@/data/countries";

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  job_title: string | null;
  nationality: string | null;
  race: string | null;
}

const GENDER_OPTIONS = [
  { value: "", label: "— Not specified —" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const RACE_OPTIONS = [
  { value: "", label: "— Not specified —" },
  { value: "african", label: "African" },
  { value: "coloured", label: "Coloured" },
  { value: "indian", label: "Indian" },
  { value: "white", label: "White" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const inputClass =
  "w-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-sky-500/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none transition-all";

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<ProfileData>("/users/me")
      .then((res) => {
        setData({
          first_name: res.first_name ?? "",
          last_name: res.last_name ?? "",
          date_of_birth: res.date_of_birth ?? "",
          gender: res.gender ?? "",
          job_title: res.job_title ?? "",
          nationality: res.nationality ?? "",
          race: res.race ?? "",
        } as ProfileData);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        setStatus("error");
      });
  }, []);

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!data) return;
    setStatus("saving");
    setError("");
    try {
      await api.patch("/users/me/profile", {
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || null,
        job_title: data.job_title || null,
        nationality: data.nationality || null,
        race: data.race || null,
      });
      setStatus("saved");
      setTimeout(() => setStatus("ready"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
      setStatus("error");
    }
  }

  if (status === "loading" || !data) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl">
        <p className="text-white/40 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🧑</span> Profile
        </h1>
        <p className="text-white/45 text-sm mt-1">
          Optional details about you. Everything here is entirely up to you to share —
          leave anything blank if you'd rather not say.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">First name</label>
            <input
              className={inputClass}
              value={data.first_name ?? ""}
              onChange={(e) => update("first_name", e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">Last name</label>
            <input
              className={inputClass}
              value={data.last_name ?? ""}
              onChange={(e) => update("last_name", e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Date of birth</label>
          <input
            type="date"
            className={inputClass}
            value={data.date_of_birth ?? ""}
            onChange={(e) => update("date_of_birth", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Gender</label>
          <select
            className={inputClass}
            value={data.gender ?? ""}
            onChange={(e) => update("gender", e.target.value)}
          >
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#0a1628]">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Job title</label>
          <input
            className={inputClass}
            value={data.job_title ?? ""}
            onChange={(e) => update("job_title", e.target.value)}
            placeholder="e.g. Data Analyst, Student, Teacher"
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Nationality</label>
          <select
            className={inputClass}
            value={data.nationality ?? ""}
            onChange={(e) => update("nationality", e.target.value)}
          >
            <option value="" className="bg-[#0a1628]">— Not specified —</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c} className="bg-[#0a1628]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">
            Race
            <span className="text-white/30 font-normal"> (South African B-BBEE reporting categories, entirely optional)</span>
          </label>
          <select
            className={inputClass}
            value={data.race ?? ""}
            onChange={(e) => update("race", e.target.value)}
          >
            {RACE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#0a1628]">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={save}
            disabled={status === "saving"}
            className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && (
            <span className="text-emerald-400 text-xs font-medium">✓ Saved</span>
          )}
        </div>
      </div>
    </div>
  );
}
