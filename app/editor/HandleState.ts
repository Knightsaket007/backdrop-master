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
  backgroundImage: string | null;
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

export async function saveEditorState(payload: EditorPayload) {
  try {
    const json = JSON.stringify(payload);

    // Optional: store backup
    localStorage.setItem("unsavedEditorData", json);

    await fetch("/api/save-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });

    console.log("Editor state saved to DB");
  } catch (err) {
    console.error("Failed to save editor state:", err);
  }
}

