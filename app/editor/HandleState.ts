export interface Sticker {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
}

export interface TextItem {
  id: number;
  content: string;
  fontFamily: string;
  size: string;
  bold: boolean;
  italic: boolean;
  color: string;
  top?: string;
  left?: string;
  rotate?: number;
  width?: string;
  height?: string;
  shadow?: (string | number)[];
  hasShadow?: boolean;
  textImage?: string;
  gradient: (string | number)[];
  isgradient: boolean;
}

export interface EditorPayload {
  userId: string;
  plan: string;
  editorId: string;
  backgroundImage: string;
  bgremovedImage?: string;
  imgWidth: number;
  imgHeight: number;
  brushColor?: string;
  brushSize?: number;
  showFilters?: string;
  colorArray?: string[];
  texts?: TextItem[];
  stickers?: Sticker[];
}

export function saveEditorState(payload: EditorPayload) {
  if (!payload.backgroundImage) return;

  const json = JSON.stringify(payload);

  //=-=-=-=- Save to localStorage as backup (cold start recovery)-0===-=-//
  localStorage.setItem("unsavedEditorData", json);

  const success = navigator.sendBeacon("/api/save-editor", json);

  if (!success) {
    console.warn("sendBeacon failed, using fallback");
    fetch("/api/save-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
      keepalive: true,
    }).catch((err) => {
      console.warn("Fallback fetch failed:", err);
    });
  }
}

export async function flushEditorBackup() {
  const raw = localStorage.getItem("unsavedEditorData");
  if (!raw) return;

  try {
    await fetch("/api/save-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      keepalive: true,
    });
    localStorage.removeItem("unsavedEditorData");
    console.log("Recovered and flushed unsaved editor state");
  } catch (err) {
    console.warn("Failed to flush editor backup:", err);
  }
}
