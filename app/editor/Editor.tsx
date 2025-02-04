"use client";

import { useState } from "react";
import BgRemover from "../components/BgRemover";

export default function Editor() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-xl font-bold">Backdrop Editor</h1>

      <div className="flex gap-4">
        <BgRemover onBgRemove={setFrontImage} />
      </div>

      <input type="file" onChange={(e) => setBgImage(URL.createObjectURL(e.target.files![0]))} />

      <input
        type="text"
        placeholder="Enter Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2"
      />

      <div className="relative w-[300px] h-[300px] border">
        {bgImage && <img src={bgImage} className="absolute w-full h-full object-cover" />}
        {frontImage && <img src={frontImage} className="absolute w-full h-full object-cover mix-blend-multiply" />}
        {text && <p className="absolute bottom-4 left-4 text-white text-2xl">{text}</p>}
      </div>
    </div>
  );
}
