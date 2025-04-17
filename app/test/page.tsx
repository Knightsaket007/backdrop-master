"use client";

import React, { useState } from "react";
import Upscaler from "upscaler";
import model from "@upscalerjs/esrgan-slim";

const upscaler = new Upscaler({
  model,
  backend: "cpu", // optional, CPU preferred for lighter use
});

export default function UpscalePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      setLoading(true);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, img.width, img.height);
      if (!imageData) return;

      const upscaled = await upscaler.upscale(imageData);
      const upscaledCanvas = document.createElement("canvas");
      upscaledCanvas.width = img.width * 2;
      upscaledCanvas.height = img.height * 2;
      upscaledCanvas.getContext("2d")?.putImageData(upscaled, 0, 0);

      const upscaledBlob = await new Promise<Blob | null>((resolve) =>
        upscaledCanvas.toBlob(resolve)
      );
      if (!upscaledBlob) return;

      const upscaledObjectURL = URL.createObjectURL(upscaledBlob);
      setImageUrl(img.src);
      setUpscaledUrl(upscaledObjectURL);
      setLoading(false);
    };
  };

  return (
    <div className="p-4 space-y-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {loading && <p>Upscaling...</p>}
      {imageUrl && <img src={imageUrl} alt="Original" width={200} />}
      {upscaledUrl && (
        <div>
          <p>Upscaled Image:</p>
          <img src={upscaledUrl} alt="Upscaled" width={400} />
        </div>
      )}
    </div>
  );
}
