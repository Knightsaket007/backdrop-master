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

const GUEST_DB_NAME = 'backdrop-master-guest';
const GUEST_IMAGE_KEY = 'background-image';
const GUEST_REMOVED_IMAGE_KEY = 'background-removed-image';
let lastGuestImageSaved: string | null = null;
let lastGuestRemovedImageSaved: string | null = null;

function openGuestDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('Browser storage is unavailable.'));
      return;
    }
    const request = indexedDB.open(GUEST_DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('assets')) {
        request.result.createObjectStore('assets');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open browser storage.'));
  });
}

async function storeGuestAsset(key: string, image: string | null) {
  const db = await openGuestDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('assets', 'readwrite');
    const store = transaction.objectStore('assets');
    if (image) store.put(image, key);
    else store.delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Could not save guest image.'));
    transaction.onabort = () => reject(transaction.error || new Error('Could not save guest image.'));
  }).finally(() => db.close());
}

export async function loadGuestEditorState(): Promise<Partial<EditorPayload> | null> {
  const raw = localStorage.getItem('guestEditorState');
  if (!raw) return null;
  const payload = JSON.parse(raw) as Partial<EditorPayload> & {
    hasLocalBackgroundImage?: boolean;
    hasLocalRemovedImage?: boolean;
  };
  if (payload.hasLocalBackgroundImage || payload.hasLocalRemovedImage) {
    try {
      const db = await openGuestDatabase();
      const images = await new Promise<{ background?: string; removed?: string }>((resolve, reject) => {
        const store = db.transaction('assets', 'readonly').objectStore('assets');
        const backgroundRequest = store.get(GUEST_IMAGE_KEY);
        const removedRequest = store.get(GUEST_REMOVED_IMAGE_KEY);
        const result: { background?: string; removed?: string } = {};
        backgroundRequest.onsuccess = () => { result.background = backgroundRequest.result as string | undefined; };
        removedRequest.onsuccess = () => { result.removed = removedRequest.result as string | undefined; };
        let completed = 0;
        const finish = () => { if (++completed === 2) resolve(result); };
        backgroundRequest.onerror = removedRequest.onerror = () => reject(backgroundRequest.error || removedRequest.error);
        backgroundRequest.addEventListener('success', finish, { once: true });
        removedRequest.addEventListener('success', finish, { once: true });
      }).finally(() => db.close());
      if (payload.hasLocalBackgroundImage) payload.backgroundImage = images.background ?? null;
      if (payload.hasLocalRemovedImage) payload.bgremovedImage = images.removed ?? '';
      lastGuestImageSaved = images.background ?? null;
      lastGuestRemovedImageSaved = images.removed ?? null;
    } catch (error) {
      console.warn('Could not restore the guest image from browser storage.', error);
      payload.backgroundImage = null;
    }
  }
  return payload;
}

export function saveEditorState(payload: EditorPayload, isGuest = false) {
  try {
    console.log("inside saveeditor")
    if (isGuest) {
      const image = payload.backgroundImage?.startsWith('data:image/') ? payload.backgroundImage : null;
      const removedImage = payload.bgremovedImage?.startsWith('data:image/') ? payload.bgremovedImage : null;
      const guestPayload = {
        ...payload,
        backgroundImage: image ? null : payload.backgroundImage,
        bgremovedImage: removedImage ? '' : payload.bgremovedImage,
        hasLocalBackgroundImage: Boolean(image),
        hasLocalRemovedImage: Boolean(removedImage),
      };
      localStorage.setItem('guestEditorState', JSON.stringify(guestPayload));
      if (image !== lastGuestImageSaved) {
        lastGuestImageSaved = image;
        void storeGuestAsset(GUEST_IMAGE_KEY, image).catch((error) => {
          console.error('Failed to save guest image locally:', error);
          lastGuestImageSaved = null;
        });
      }
      if (removedImage !== lastGuestRemovedImageSaved) {
        lastGuestRemovedImageSaved = removedImage;
        void storeGuestAsset(GUEST_REMOVED_IMAGE_KEY, removedImage).catch((error) => {
          console.error('Failed to save guest background removal locally:', error);
          lastGuestRemovedImageSaved = null;
        });
      }
      return;
    }
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

  const data = raw ? JSON.parse(raw) : {};
  data.userId = userId;
  data.editorId = editorId;

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
