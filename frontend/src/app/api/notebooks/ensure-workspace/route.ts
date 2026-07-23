import { NextRequest, NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { userWorkspaceDir } from "@/lib/notebookPaths";
import { courses } from "@/data/courses";
import { canAccessPythonCourse } from "@/lib/pythonCourseTiers";

// Prefer server-only vars (not baked into public bundle); fall back to NEXT_PUBLIC_ for prod
const JUPYTER_URL   = process.env.NOTEBOOK_API_URL   ?? process.env.NEXT_PUBLIC_NOTEBOOK_URL  ?? "";
const JUPYTER_TOKEN = process.env.NOTEBOOK_API_TOKEN ?? process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// Files not tied to any course lesson (general intro material) — always
// included regardless of plan/promo status.
const ALWAYS_FREE_FILES = new Set(["00_introduction.ipynb"]);

// python-fundamentals.ipynb isn't referenced by any lesson's notebookFile
// (it's a standalone overview notebook) but its name makes the intended
// course obvious — gate it the same as the course it's named after.
const FILENAME_COURSE_OVERRIDES: Record<string, string> = {
  "python-fundamentals.ipynb": "python-fundamentals",
};

/** filename -> course ids that reference it via notebookFile, built from
 * the same catalog the course pages already use — single source of truth,
 * no separate list to keep in sync by hand. */
function buildNotebookCourseMap(): Record<string, Set<string>> {
  const map: Record<string, Set<string>> = {};
  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (!lesson.notebookFile) continue;
        (map[lesson.notebookFile] ??= new Set()).add(course.id);
      }
    }
  }
  return map;
}

/**
 * Ensures this user has their own directory on the shared Jupyter server,
 * seeded with the starter course notebooks they actually have access to
 * (see pythonCourseTiers.ts) — Beginner/Intermediate notebook content
 * shouldn't be reachable through the raw Jupyter workspace for a student
 * who's locked out of the corresponding course on the Courses pages.
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string };
  const authHeader = req.headers.get("authorization");

  if (!email || !authHeader) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (!JUPYTER_URL) {
    return NextResponse.json({ error: "JupyterLab is not configured" }, { status: 503 });
  }

  // Authoritative entitlement check — never trust client-supplied plan
  // state for what gets copied into the workspace.
  let plan = "free";
  let planExpiresAt: string | null = null;
  let pythonPromoGranted = false;
  try {
    const meRes = await fetch(`${API_BASE}/users/me`, { headers: { Authorization: authHeader } });
    if (!meRes.ok) return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    const me = await meRes.json() as { plan: string; plan_expires_at: string | null; python_promo_granted: boolean };
    plan = me.plan;
    planExpiresAt = me.plan_expires_at;
    pythonPromoGranted = me.python_promo_granted;
  } catch {
    // Backend unreachable — fail closed on gated content (see below), but
    // still let the student use their workspace for whatever's already free.
  }

  const USER_DIR = userWorkspaceDir(email);

  async function ensureDir(path: string) {
    const res = await fetch(`${JUPYTER_URL}/api/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `Token ${JUPYTER_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ type: "directory", content: null }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Failed to create directory "${path}": ${res.status} ${body}`);
    }
  }

  try {
    // Jupyter's contents API doesn't auto-create intermediate directories,
    // so the shared "users" root must exist before a per-user subdir under it.
    await ensureDir("users");
    await ensureDir(USER_DIR);

    const notebooksSrcDir = join(process.cwd(), "public", "notebooks");
    const allFiles = readdirSync(notebooksSrcDir).filter((f) => f.endsWith(".ipynb"));
    const notebookCourseMap = buildNotebookCourseMap();

    const starterFiles = allFiles.filter((filename) => {
      if (ALWAYS_FREE_FILES.has(filename)) return true;
      const courseIds = notebookCourseMap[filename]
        ?? (FILENAME_COURSE_OVERRIDES[filename] ? new Set([FILENAME_COURSE_OVERRIDES[filename]]) : undefined);
      if (!courseIds || courseIds.size === 0) return true; // unmapped files stay free (no known gate to apply)
      // Accessible if entitled to ANY course that references this file —
      // e.g. 07_functions.ipynb is used by both Beginner and Advanced.
      return [...courseIds].some((courseId) => canAccessPythonCourse(courseId, { plan, planExpiresAt, pythonPromoGranted }));
    });

    await Promise.all(
      starterFiles.map(async (filename) => {
        const destPath = `${USER_DIR}/${filename}`;
        const existing = await fetch(`${JUPYTER_URL}/api/contents/${destPath}`, {
          headers: { Authorization: `Token ${JUPYTER_TOKEN}` },
        });
        if (existing.status !== 404) return; // already has their own copy

        let raw = readFileSync(join(notebooksSrcDir, filename), "utf-8");
        if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1); // strip BOM, breaks JSON.parse
        const notebookObj = JSON.parse(raw);

        const putRes = await fetch(`${JUPYTER_URL}/api/contents/${destPath}`, {
          method: "PUT",
          headers: { Authorization: `Token ${JUPYTER_TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ type: "notebook", format: "json", content: notebookObj }),
        });
        if (!putRes.ok) {
          const body = await putRes.text().catch(() => "");
          throw new Error(`Failed to create "${destPath}": ${putRes.status} ${body}`);
        }
      })
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : `Cannot reach JupyterLab at ${JUPYTER_URL}` },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, path: USER_DIR });
}
