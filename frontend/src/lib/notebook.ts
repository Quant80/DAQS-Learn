import { useAuthStore } from "@/store/auth";

/** Creates a new notebook in the user's own JupyterLab work/ folder pre-populated with `code`, then opens it in a new tab. */
export async function openCodeInNotebook(code: string) {
  const email = useAuthStore.getState().user?.email;
  if (!email) {
    alert("Please sign in to open the notebook.");
    return;
  }

  const win = window.open("about:blank", "_blank");
  try {
    const res = await fetch("/api/notebooks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, email }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error ?? "Failed to create notebook");
    if (win) win.location.href = data.url;
  } catch (err) {
    if (win) win.close();
    alert(err instanceof Error ? err.message : "Could not open notebook");
  }
}
