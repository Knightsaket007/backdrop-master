'use client';
import { useEffect, useState } from "react";

export default function ScreenMismatch() {
  const [initialWidth, setInitialWidth] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [allowAnyway, setAllowAnyway] = useState(false);
  const [resized, setResized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      setInitialWidth(width);

      if (width < 800) {
        setShowPopup(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const isScreenTooSmall = currentWidth < 800;
      const hasResized = initialWidth !== null && currentWidth !== initialWidth;

      if (hasResized) {
        setAllowAnyway(false);
        setResized(true);
        setShowPopup(true);
      } else if (isScreenTooSmall) {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialWidth]);

  if (!showPopup || allowAnyway) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center" style={{ zIndex: "100" }}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-2 text-red-700">Screen Resize Detect</h2>
        <p className="text-gray-700 mb-4">
          {resized
            ? "You resized your screen or switched device. Please use same screen size for best experience or reload the page."
            : "You're using a small screen. For best results, use a larger screen (like a PC)."}
        </p>

        {!resized && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setAllowAnyway(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Do Anyway
            </button>
            <button
              onClick={() => {
                window.open(window.location.href, '_blank', 'width=1200,height=800');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Open in Desktop Mode
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
