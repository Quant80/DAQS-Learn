import { NextRequest } from "next/server";

const PISTON = "https://emkc.org/api/v2/piston";

// Fetch available runtimes once and cache
let runtimeCache: Array<{ language: string; version: string }> | null = null;

async function getRuntimes() {
  if (runtimeCache) return runtimeCache;
  const res = await fetch(`${PISTON}/runtimes`, { next: { revalidate: 3600 } });
  runtimeCache = await res.json();
  return runtimeCache!;
}

async function resolveVersion(lang: string): Promise<string> {
  try {
    const runtimes = await getRuntimes();
    const match = runtimes.filter((r) => r.language === lang);
    if (!match.length) return "*";
    // prefer highest version
    return match.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0].version;
  } catch {
    return "*";
  }
}

const LANG_MAP: Record<string, string> = {
  python:     "python",
  javascript: "javascript",
  sql:        "python",   // SQL labs use sqlite3 inside Python
  bash:       "bash",
};

export async function POST(req: NextRequest) {
  const { language, code } = await req.json();
  const pistonLang = LANG_MAP[language] ?? "python";
  const version = await resolveVersion(pistonLang);

  const pistonRes = await fetch(`${PISTON}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: pistonLang,
      version,
      files: [{ name: "main.py", content: code }],
      stdin: "",
      args: [],
      run_timeout: 10000,
      compile_timeout: 10000,
    }),
  });

  if (!pistonRes.ok) {
    const text = await pistonRes.text();
    return Response.json({ stdout: "", stderr: `Execution service error (${pistonRes.status}): ${text}`, exitCode: 1 });
  }

  const data = await pistonRes.json();

  // Piston structure: { run: { stdout, stderr, output, code } }
  const compileStderr = data.compile?.stderr ?? "";
  const stdout  = data.run?.stdout  ?? "";
  const stderr  = (compileStderr + (data.run?.stderr ?? "")).trim();
  const output  = data.run?.output  ?? "";   // combined fallback
  const exitCode = data.run?.code ?? 1;

  // Use output (combined) if stdout is empty but output has content
  const finalStdout = stdout || (exitCode === 0 ? output : "");
  const finalStderr = stderr || (exitCode !== 0 ? output : "");

  return Response.json({ stdout: finalStdout, stderr: finalStderr, exitCode });
}
