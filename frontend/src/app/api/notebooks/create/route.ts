import { NextRequest, NextResponse } from "next/server";
import { userWorkspaceDir } from "@/lib/notebookPaths";

// Prefer server-only vars (not baked into public bundle); fall back to NEXT_PUBLIC_ for prod
const JUPYTER_URL   = process.env.NOTEBOOK_API_URL   ?? process.env.NEXT_PUBLIC_NOTEBOOK_URL  ?? "";
const JUPYTER_TOKEN = process.env.NOTEBOOK_API_TOKEN ?? process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";

function buildNotebook(code: string) {
  return {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
      language_info: { name: "python", version: "3.10.0" },
    },
    cells: [
      {
        cell_type: "code",
        id: "tutor-snippet",
        metadata: {},
        execution_count: null,
        outputs: [],
        source: code,
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  const { code, email } = await req.json() as { code: string; email?: string };

  if (!code || !code.trim()) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (!JUPYTER_URL) {
    return NextResponse.json({ error: "JupyterLab is not configured" }, { status: 503 });
  }

  const USER_DIR = userWorkspaceDir(email);
  const WORK_DIR = `${USER_DIR}/work`;
  const filename = `tutor-snippet-${Date.now()}.ipynb`;
  const destPath = `${WORK_DIR}/${filename}`;

  try {
    // Ensure the user's directory exists, then the work/ subdirectory inside
    // it — the contents API doesn't reliably auto-create intermediate
    // parent directories, so both levels are created explicitly in order.
    for (const dir of [USER_DIR, WORK_DIR]) {
      await fetch(`${JUPYTER_URL}/api/contents/${dir}`, {
        method: "PUT",
        headers: { Authorization: `Token ${JUPYTER_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ type: "directory", content: null }),
      });
    }

    // Create the new notebook with the code pre-pasted into a cell
    const res = await fetch(`${JUPYTER_URL}/api/contents/${destPath}`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${JUPYTER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "notebook",
        format: "json",
        content: buildNotebook(code),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `JupyterLab upload failed: ${text}` }, { status: 502 });
    }
  } catch {
    return NextResponse.json(
      { error: `Cannot reach JupyterLab at ${JUPYTER_URL} — is it running?` },
      { status: 503 }
    );
  }

  const labUrl = `${JUPYTER_URL}/lab/tree/${destPath}?token=${JUPYTER_TOKEN}`;
  return NextResponse.json({ url: labUrl });
}
