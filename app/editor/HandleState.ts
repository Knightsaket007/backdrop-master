"use client"

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

export function saveEditorState(payload: EditorPayload) {
  try {
    console.log("inside saveeditor")
    const newJson = JSON.stringify(payload);
    const lastJson = localStorage.getItem("unsavedEditorData");

    // Skip if no change in data
    if (lastJson === newJson) return;

    // Store updated data
    localStorage.setItem("unsavedEditorData", newJson);
    localStorage.setItem("hasPendingSave", "true"); // flag for DB flush
  } catch (err) {
    console.error("Failed to save editor state:", err);
  }
}


type flushParams={
  userId:string,
  editorId:string
}

export async function flushEditorBackupToDB({ userId, editorId }:flushParams) {
  const hasPending = localStorage.getItem("hasPendingSave");
  const raw = localStorage.getItem("unsavedEditorData");



  // Only flush if there's something new
  if (!hasPending || !raw) return;

  try {
    await fetch("/api/save-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("Flushed editor state to DB");
    localStorage.removeItem("hasPendingSave"); // mark as saved
  } catch (err) {
    console.warn("Failed to flush editor backup:", err);
  }
}
