'use client';
import { useEffect, useState } from "react";

export default function ScreenMismatch() {
  const [initialWidth, setInitialWidth] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [allowAnyway, setAllowAnyway] = useState(false);
  const [resized, setResized] = useState(false); // 🔥 Track if resize happened after load

  // On mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      setInitialWidth(width);

      if (width < 800) {
        setShowPopup(true);
      }
    }
  }, []);

  // On resize
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      // If resized OR screen is too small
      const isScreenTooSmall = currentWidth < 800;
      const hasResized = initialWidth !== null && currentWidth !== initialWidth;

      if (hasResized || isScreenTooSmall) {
        setShowPopup(true);
        setResized(hasResized); // 🧠 Only set true if actually resized
      } else {
        setShowPopup(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialWidth]);

  // If user clicked "Do Anyway", hide popup
  if (!showPopup || allowAnyway) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center" style={{ zIndex: "100" }}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-2 text-red-700">Screen Size Not Supported</h2>
        <p className="text-gray-700 mb-4">
          {resized
            ? "You resized your screen or switched device. Please use a desktop or full-screen mode to continue."
            : "You're using a small screen. For best results, use a larger screen (like a PC)."}
        </p>

        {!resized && (
          <button
            onClick={() => setAllowAnyway(true)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Do Anyway
          </button>
        )}
      </div>
    </div>
  );
}
