import { useEffect, useState } from "react";

export default function ScreenMismatch() {
  const [initialWidth, setInitialWidth] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      setInitialWidth(width);

      // Already chhoti screen ho toh bhi popup dikhao
      if (width < 800) {
        setShowPopup(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      // ✅ If screen resized or too small — show popup
      if (
        (initialWidth !== null && currentWidth !== initialWidth) ||
        currentWidth < 800
      ) {
        setShowPopup(true);
      } else {
        // ✅ If screen returns to valid state — hide popup
        setShowPopup(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialWidth]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center " style={{zIndex:"100"}}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-2 text-red-700">Screen Size Not Supported</h2>
        <p className="text-gray-700 ">
          Resizing or small screens are not supported. Please use a larger screen (like a PC) if your screen width is less than 800px
        </p>
      </div>
    </div>
  );
}
