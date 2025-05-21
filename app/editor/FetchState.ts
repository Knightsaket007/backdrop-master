
export async function fetchEditorState(editorId: string): Promise<EditorPayload | null> {
//  console.log("Editor id..", editorId);
  try {
    const res = await fetch("/api/load-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editorId }),
    });

    if (!res.ok) throw new Error("Failed to fetch from DB");

    console.log('res is..', res)

    const data = await res.json();
    console.log("Restored from DB", data);
    return data;
  } catch (err) {
    console.error("Error fetching editor state:", err);
    return null;
  }
}
