'use client'

import { useState } from "react";

const ImageEditor = () => {
  const [textPosition, setTextPosition] = useState({ top: 100, left: 100 });

  const handleDrag = (e) => {
    setTextPosition({
      top: e.clientY - 30,  // Adjust the offset for the text
      left: e.clientX - 50,  // Adjust the offset for the text
    });
  };

  return (
    <div style={{ position: "relative", width: "500px", height: "500px" }}>
      <img
        src="your-image-url.jpg"
        alt="background"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: textPosition.top,
          left: textPosition.left,
          zIndex: 2,
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "5px",
          cursor: "move",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          document.addEventListener("mousemove", handleDrag);
          document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleDrag);
          });
        }}
      >
        Your Text Here
      </div>
    </div>
  );
};

export default ImageEditor;
