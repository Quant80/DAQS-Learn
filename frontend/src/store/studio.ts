import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StudioLanguage = "python" | "javascript" | "html" | "css" | "typescript" | "markdown" | "json";

export interface StudioFile {
  id: string;
  name: string;
  language: StudioLanguage;
  content: string;
}

export interface StudioProject {
  id: string;
  name: string;
  /** File names double as paths — "utils/helpers.py" lives in a "utils" folder. */
  files: StudioFile[];
  /** Explicitly-created folder paths, including ones with no files in them yet. */
  folders: string[];
  createdAt: string;
  updatedAt: string;
}

function langFromName(name: string): StudioLanguage {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, StudioLanguage> = {
    py: "python", js: "javascript", ts: "typescript",
    html: "html", css: "css", md: "markdown", json: "json",
  };
  return map[ext] ?? "python";
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

const TEMPLATES: Record<string, Omit<StudioProject, "id" | "createdAt" | "updatedAt" | "folders">> = {
  "python-ds": {
    name: "Python Data Science",
    files: [
      {
        id: "f1", name: "main.py", language: "python",
        content: `import numpy as np

# Create some data
data = np.array([2, 4, 6, 8, 10, 12, 14, 16, 18, 20])

print("Data:", data)
print("Mean:", data.mean())
print("Std:", data.std())
print("Min:", data.min(), "Max:", data.max())

# Simple linear sequence
x = np.linspace(0, 2 * np.pi, 8)
y = np.sin(x)
print("\\nSine values:")
for xi, yi in zip(x, y):
    print(f"  sin({xi:.2f}) = {yi:.4f}")
`,
      },
      {
        id: "f2", name: "utils.py", language: "python",
        content: `def normalise(data):
    """Scale values to [0, 1] range."""
    mn, mx = min(data), max(data)
    return [(x - mn) / (mx - mn) for x in data]

def moving_average(data, window=3):
    """Compute simple moving average."""
    result = []
    for i in range(len(data)):
        start = max(0, i - window + 1)
        result.append(sum(data[start:i+1]) / (i - start + 1))
    return result
`,
      },
      {
        id: "f3", name: "README.md", language: "markdown",
        content: `# Python Data Science Project

A starter project for data science with NumPy.

## Files
- \`main.py\` — entry point, data analysis
- \`utils.py\` — helper functions

## Run
Click **▶ Run** to execute the active Python file.
`,
      },
    ],
  },
  "web-dev": {
    name: "Web Dev Project",
    files: [
      {
        id: "f1", name: "index.html", language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My DAQS Project</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>Hello from DAQS Studio 👋</h1>
    <p>Edit this HTML and click <strong>Preview</strong> to see changes.</p>
    <button onclick="greet()">Click me</button>
    <p id="output"></p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "f2", name: "style.css", language: "css",
        content: `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 600px;
  padding: 2rem;
  background: #1e293b;
  border-radius: 1rem;
  text-align: center;
}

h1 { font-size: 2rem; margin-bottom: 1rem; color: #38bdf8; }
p  { color: #94a3b8; margin-bottom: 1rem; }

button {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

button:hover { background: #38bdf8; }
#output { margin-top: 1rem; color: #34d399; font-weight: bold; }
`,
      },
      {
        id: "f3", name: "script.js", language: "javascript",
        content: `function greet() {
  const names = ["Learner", "Developer", "Data Scientist", "Engineer"];
  const name = names[Math.floor(Math.random() * names.length)];
  document.getElementById("output").textContent = \`Hello, \${name}! 🎉\`;
}
`,
      },
    ],
  },
  blank: {
    name: "Blank Project",
    files: [
      {
        id: "f1", name: "main.py", language: "python",
        content: `# Your code here\nprint("Hello, DAQS!")\n`,
      },
    ],
  },
};

interface StudioStore {
  projects: StudioProject[];
  activeProjectId: string | null;
  openFileIds: string[];
  activeFileId: string | null;

  createProject(templateKey: keyof typeof TEMPLATES): StudioProject;
  deleteProject(id: string): void;
  renameProject(id: string, name: string): void;
  setActiveProject(id: string): void;

  createFile(projectId: string, name: string): StudioFile;
  deleteFile(projectId: string, fileId: string): void;
  renameFile(projectId: string, fileId: string, name: string): void;
  updateFileContent(projectId: string, fileId: string, content: string): void;

  createFolder(projectId: string, path: string): void;
  deleteFolder(projectId: string, path: string): void;
  renameFolder(projectId: string, oldPath: string, newPath: string): void;

  openFile(fileId: string): void;
  closeFile(fileId: string): void;
  setActiveFile(fileId: string): void;

  getActiveProject(): StudioProject | null;
  getActiveFile(): StudioFile | null;
}

export const useStudio = create<StudioStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      openFileIds: [],
      activeFileId: null,

      createProject(templateKey) {
        const tmpl = TEMPLATES[templateKey] ?? TEMPLATES.blank;
        const project: StudioProject = {
          id: makeId(),
          name: tmpl.name,
          files: tmpl.files.map((f) => ({ ...f, id: makeId() })),
          folders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          projects: [...s.projects, project],
          activeProjectId: project.id,
          openFileIds: [project.files[0].id],
          activeFileId: project.files[0].id,
        }));
        return project;
      },

      deleteProject(id) {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? (s.projects.find((p) => p.id !== id)?.id ?? null) : s.activeProjectId,
          openFileIds: [],
          activeFileId: null,
        }));
      },

      renameProject(id, name) {
        set((s) => ({
          projects: s.projects.map((p) => p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p),
        }));
      },

      setActiveProject(id) {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        set({
          activeProjectId: id,
          openFileIds: project.files.slice(0, 1).map((f) => f.id),
          activeFileId: project.files[0]?.id ?? null,
        });
      },

      createFile(projectId, name) {
        const file: StudioFile = { id: makeId(), name, language: langFromName(name), content: "" };
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, files: [...p.files, file], updatedAt: new Date().toISOString() } : p
          ),
          openFileIds: [...new Set([...s.openFileIds, file.id])],
          activeFileId: file.id,
        }));
        return file;
      },

      deleteFile(projectId, fileId) {
        set((s) => {
          const newOpen = s.openFileIds.filter((id) => id !== fileId);
          return {
            projects: s.projects.map((p) =>
              p.id === projectId ? { ...p, files: p.files.filter((f) => f.id !== fileId) } : p
            ),
            openFileIds: newOpen,
            activeFileId: s.activeFileId === fileId ? (newOpen[newOpen.length - 1] ?? null) : s.activeFileId,
          };
        });
      },

      renameFile(projectId, fileId, name) {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, files: p.files.map((f) => f.id === fileId ? { ...f, name, language: langFromName(name) } : f) }
              : p
          ),
        }));
      },

      createFolder(projectId, path) {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId && !(p.folders ?? []).includes(path)
              ? { ...p, folders: [...(p.folders ?? []), path], updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteFolder(projectId, path) {
        set((s) => {
          const project = s.projects.find((p) => p.id === projectId);
          if (!project) return s;
          const removedFileIds = new Set(
            project.files.filter((f) => f.name === path || f.name.startsWith(path + "/")).map((f) => f.id)
          );
          const newOpen = s.openFileIds.filter((id) => !removedFileIds.has(id));
          return {
            projects: s.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    files: p.files.filter((f) => !removedFileIds.has(f.id)),
                    folders: (p.folders ?? []).filter((f) => f !== path && !f.startsWith(path + "/")),
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
            openFileIds: newOpen,
            activeFileId: removedFileIds.has(s.activeFileId ?? "") ? (newOpen[newOpen.length - 1] ?? null) : s.activeFileId,
          };
        });
      },

      renameFolder(projectId, oldPath, newPath) {
        const remap = (name: string) => (name === oldPath ? newPath : name.startsWith(oldPath + "/") ? newPath + name.slice(oldPath.length) : name);
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  files: p.files.map((f) => (f.name === oldPath || f.name.startsWith(oldPath + "/")) ? { ...f, name: remap(f.name) } : f),
                  folders: (p.folders ?? []).map(remap),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateFileContent(projectId, fileId, content) {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, files: p.files.map((f) => f.id === fileId ? { ...f, content } : f), updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      openFile(fileId) {
        set((s) => ({
          openFileIds: [...new Set([...s.openFileIds, fileId])],
          activeFileId: fileId,
        }));
      },

      closeFile(fileId) {
        set((s) => {
          const newOpen = s.openFileIds.filter((id) => id !== fileId);
          return {
            openFileIds: newOpen,
            activeFileId: s.activeFileId === fileId ? (newOpen[newOpen.length - 1] ?? null) : s.activeFileId,
          };
        });
      },

      setActiveFile(fileId) {
        set({ activeFileId: fileId });
      },

      getActiveProject() {
        const { projects, activeProjectId } = get();
        return projects.find((p) => p.id === activeProjectId) ?? null;
      },

      getActiveFile() {
        const project = get().getActiveProject();
        if (!project) return null;
        return project.files.find((f) => f.id === get().activeFileId) ?? null;
      },
    }),
    { name: "daqs-studio" }
  )
);

export { TEMPLATES, langFromName };
