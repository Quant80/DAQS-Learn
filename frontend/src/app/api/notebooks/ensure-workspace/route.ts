import { NextRequest, NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { userWorkspaceDir } from "@/lib/notebookPaths";

// Prefer server-only vars (not baked into public bundle); fall back to NEXT_PUBLIC_ for prod
const JUPYTER_URL   = process.env.NOTEBOOK_API_URL   ?? process.env.NEXT_PUBLIC_NOTEBOOK_URL  ?? "";
const JUPYTER_TOKEN = process.env.NOTEBOOK_API_TOKEN ?? process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";

/**
 * Ensures this user has their own directory on the shared Jupyter server,
 * seeded with the starter course notebooks on first visit. Called before
 * the main Notebook page links into JupyterLab, so every student lands in
 * their own isolated space instead of the server's shared root.
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string };

  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (!JUPYTER_URL) {
    return NextResponse.json({ error: "JupyterLab is not configured" }, { status: 503 });
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
    const starterFiles = readdirSync(notebooksSrcDir).filter((f) => f.endsWith(".ipynb"));

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
