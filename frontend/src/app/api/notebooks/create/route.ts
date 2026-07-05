import { NextRequest, NextResponse } from "next/server";

// Prefer server-only vars (not baked into public bundle); fall back to NEXT_PUBLIC_ for prod
const JUPYTER_URL   = process.env.NOTEBOOK_API_URL   ?? process.env.NEXT_PUBLIC_NOTEBOOK_URL  ?? "";
const JUPYTER_TOKEN = process.env.NOTEBOOK_API_TOKEN ?? process.env.NEXT_PUBLIC_NOTEBOOK_TOKEN ?? "";

const WORK_DIR = "work";

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
  const { code } = await req.json() as { code: string };

  if (!code || !code.trim()) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  if (!JUPYTER_URL) {
    return NextResponse.json({ error: "JupyterLab is not configured" }, { status: 503 });
  }

  const filename = `tutor-snippet-${Date.now()}.ipynb`;
  const destPath = `${WORK_DIR}/${filename}`;

  try {
    // Ensure the work/ directory exists first
    await fetch(`${JUPYTER_URL}/api/contents/${WORK_DIR}`, {
      method: "PUT",
      headers: { Authorization: `Token ${JUPYTER_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ type: "directory", content: null }),
    });

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
