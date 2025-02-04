"use client";

import { useState } from "react";
import { removeBg } from "../utils/removeBg";

export default function BgRemover({ onBgRemove }: { onBgRemove: (url: string) => void }) {
  const [image, setImage] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveBg = async () => {
    if (!image) return;
    const imageUrl = URL.createObjectURL(image);
    const removedBgUrl = await removeBg(imageUrl);
    if (removedBgUrl) onBgRemove(removedBgUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {image && <button onClick={handleRemoveBg} className="bg-blue-500 text-white px-4 py-2 rounded">Remove BG</button>}
    </div>
  );
}
