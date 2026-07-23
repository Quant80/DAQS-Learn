import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { userWorkspaceDir } from "@/lib/notebookPaths";
import { courses } from "@/data/courses";
import { canAccessPythonCourse } from "@/lib/pythonCourseTiers";

// Prefer server-only vars (not baked into public bundle); fall back to NEXT_PUBLIC_ for prod
const JUPYTER_URL   = process.env.NOTEBOOK_API_URL   ?? process.env.NEXT_PUBLIC_NOTEBOOK_URL  ?? "";
const JUPYTER_TOKEN = process.env.NOTEBOOK_API_TOKEN ?? process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const ALWAYS_FREE_FILES = new Set(["00_introduction.ipynb"]);
const FILENAME_COURSE_OVERRIDES: Record<string, string> = {
  "python-fundamentals.ipynb": "python-fundamentals",
};

function courseIdsForFile(filename: string): string[] {
  const ids = new Set<string>();
  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.notebookFile === filename) ids.add(course.id);
      }
    }
  }
  if (ids.size === 0 && FILENAME_COURSE_OVERRIDES[filename]) ids.add(FILENAME_COURSE_OVERRIDES[filename]);
  return [...ids];
}

export async function POST(req: NextRequest) {
  const { filename, email } = await req.json() as { filename: string; email?: string };
  const authHeader = req.headers.get("authorization");

  if (!filename || filename.includes("..") || !filename.endsWith(".ipynb")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  if (!email || !authHeader) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (!JUPYTER_URL) {
    return NextResponse.json({ error: "JupyterLab is not configured" }, { status: 503 });
  }

  if (!ALWAYS_FREE_FILES.has(filename)) {
    const gatingCourseIds = courseIdsForFile(filename);
    if (gatingCourseIds.length > 0) {
      let plan = "free";
      let planExpiresAt: string | null = null;
      let pythonPromoGranted = false;
      try {
        const meRes = await fetch(`${API_BASE}/users/me`, { headers: { Authorization: authHeader } });
        if (!meRes.ok) return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        const me = await meRes.json() as { plan: string; plan_expires_at: string | null; python_promo_granted: boolean };
        plan = me.plan; planExpiresAt = me.plan_expires_at; pythonPromoGranted = me.python_promo_granted;
      } catch {
        return NextResponse.json({ error: "Could not verify access — try again shortly" }, { status: 503 });
      }
      const allowed = gatingCourseIds.some((courseId) =>
        canAccessPythonCourse(courseId, { plan, planExpiresAt, pythonPromoGranted })
      );
      if (!allowed) {
        return NextResponse.json({ error: "This notebook requires a Pro plan or an active promo spot" }, { status: 403 });
      }
    }
  }

  // Read notebook from Next.js public/notebooks/ directory (server-side, no CORS)
  try {
    JSON.parse(readFileSync(join(process.cwd(), "public", "notebooks", filename), "utf-8"));
  } catch {
    return NextResponse.json({ error: "Notebook file not found" }, { status: 404 });
  }

  // Upload to JupyterLab via Contents API (server-side fetch = no browser CORS),
  // into this user's own subdirectory so it never collides with another
  // student's copy of the same course notebook.
  const USER_DIR = userWorkspaceDir(email);
  const notebooksDir = `${USER_DIR}/daqs-notebooks`;
  const destPath = `${notebooksDir}/${filename}`;
  try {
    // Ensure the user's directory exists, then the daqs-notebooks/ subdirectory
    for (const dir of [USER_DIR, notebooksDir]) {
      await fetch(`${JUPYTER_URL}/api/contents/${dir}`, {
        method: "PUT",
        headers: { Authorization: `Token ${JUPYTER_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ type: "directory", content: null }),
      });
    }

    // Only seed a fresh copy if the student doesn't already have one — an
    // unconditional overwrite here would wipe out their prior progress on
    // this notebook every time they reopen it.
    const existing = await fetch(`${JUPYTER_URL}/api/contents/${destPath}`, {
      headers: { Authorization: `Token ${JUPYTER_TOKEN}` },
    });

    if (existing.status === 404) {
      const rawString = readFileSync(join(process.cwd(), "public", "notebooks", filename), "utf-8");
      const notebookObj = JSON.parse(rawString);
      const res = await fetch(`${JUPYTER_URL}/api/contents/${destPath}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${JUPYTER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "notebook",
          format: "json",
          content: notebookObj,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: `JupyterLab upload failed: ${text}` }, { status: 502 });
      }
    } else if (!existing.ok) {
      return NextResponse.json({ error: "Could not reach JupyterLab" }, { status: 502 });
    }
  } catch {
    return NextResponse.json(
      { error: `Cannot reach JupyterLab at ${JUPYTER_URL} — is it running?` },
      { status: 503 }
    );
  }

  // Return the direct URL to open the notebook in JupyterLab
  const labUrl = `${JUPYTER_URL}/lab/tree/${destPath}?token=${JUPYTER_TOKEN}`;
  return NextResponse.json({ url: labUrl });
}
