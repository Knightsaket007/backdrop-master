
export async function fetchEditorState(editorId: string): Promise<EditorPayload | null> {
  // 1️⃣ Check localStorage first
  const backupRaw = localStorage.getItem("unsavedEditorData");
  if (backupRaw) {
    try {
      const parsed = JSON.parse(backupRaw);
      if (parsed?.editorId === editorId && parsed?.backgroundImage) {
        console.log("Restoring from localStorage backup");
        console.log(parsed);
        return parsed;
      }
    } catch (err) {
      console.warn("Invalid local backup, skipping", err);
    }
  }

  // 2️⃣ If no localStorage backup, fetch from DB
  try {
    const res = await fetch("/api/load-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editorId }),
    });

    if (!res.ok) throw new Error("Failed to fetch from DB");

    console.log('res is..', res)

    const data = await res.json();
    console.log("Restored from DB");
    return data;
  } catch (err) {
    console.error("Error fetching editor state:", err);
    return null;
  }
}
