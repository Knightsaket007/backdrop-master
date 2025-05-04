'use client';

import { useEffect } from "react";

export function useEditorSave(userId: string, refs: {
  stickers: any,
  backgroundImage: any,
  bgremovedImage: any,
  imgWidth: number,
  imgHeight: number,
  brushColor: string,
  brushSize: number,
  showFilters: boolean,
  colorArray: string[],
  texts: any[],
}) {
  useEffect(() => {
    const getPayload = () => ({
      userId,
      stickers: refs.stickers,
      backgroundImage: refs.backgroundImage,
      bgremovedImage: refs.bgremovedImage,
      imgWidth: refs.imgWidth,
      imgHeight: refs.imgHeight,
      brushColor: refs.brushColor,
      brushSize: refs.brushSize,
      showFilters: refs.showFilters,
      colorArray: refs.colorArray,
      texts: refs.texts,
    });

    const interval = setInterval(() => {
      const payload = getPayload();

      fetch("/api/save-editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn("🛑 Auto-save failed:", err);
      });
    }, 15000);

    const handleUnload = () => {
      const payload = getPayload();
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      const result = navigator.sendBeacon("/api/save-editor", blob);
      if (!result) {
        console.warn("❌ Beacon failed");
      } else {
        console.log("📡 Beacon sent successfully.");
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId, refs]);
}
