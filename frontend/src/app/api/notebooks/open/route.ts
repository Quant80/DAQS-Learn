import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Prefer server-only vars (not baked into public bundle); fall back to NEXT_PUBLIC_ for prod
const JUPYTER_URL   = process.env.NOTEBOOK_API_URL   ?? process.env.NEXT_PUBLIC_NOTEBOOK_URL  ?? "";
const JUPYTER_TOKEN = process.env.NOTEBOOK_API_TOKEN ?? process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";

export async function POST(req: NextRequest) {
  const { filename } = await req.json() as { filename: string };

  if (!filename || filename.includes("..") || !filename.endsWith(".ipynb")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  if (!JUPYTER_URL) {
    return NextResponse.json({ error: "JupyterLab is not configured" }, { status: 503 });
  }

  // Read notebook from Next.js public/notebooks/ directory (server-side, no CORS)
  let notebookContent: unknown;
  try {
    const filePath = join(process.cwd(), "public", "notebooks", filename);
    notebookContent = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return NextResponse.json({ error: "Notebook file not found" }, { status: 404 });
  }

  // Upload to JupyterLab via Contents API (server-side fetch = no browser CORS)
  // Send as "text" format (raw JSON string) — works across all Jupyter versions
  const destPath = `daqs-notebooks/${filename}`;
  try {
    // Ensure the daqs-notebooks directory exists first
    await fetch(`${JUPYTER_URL}/api/contents/daqs-notebooks`, {
      method: "PUT",
      headers: { Authorization: `Token ${JUPYTER_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ type: "directory", content: null }),
    });

    // Upload the notebook as JSON — content must be the parsed notebook object
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
  } catch (err) {
    return NextResponse.json(
      { error: `Cannot reach JupyterLab at ${JUPYTER_URL} — is it running?` },
      { status: 503 }
    );
  }

  // Return the direct URL to open the notebook in JupyterLab
  const labUrl = `${JUPYTER_URL}/lab/tree/${destPath}?token=${JUPYTER_TOKEN}`;
  return NextResponse.json({ url: labUrl });
}
