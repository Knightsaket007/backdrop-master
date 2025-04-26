'use client';

import React, { useState, useRef } from 'react';
import { removeBackground } from "@imgly/background-removal";
import { Button } from "@/components/ui/button"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";


const Page = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setRemovedBgImageUrl(null); // Reset previous bg-removed image
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const imageBlob = await removeBackground(selectedImage);
      const url = URL.createObjectURL(imageBlob);
      console.log("Background removed image URL:", url);
      setRemovedBgImageUrl(url);
    } catch (error) {
      console.error("Error in background removal:", error);
    }
  };

  return (

    <div className="flex flex-col items-center justify-center p-6">
      <h1>hjfhbhj</h1>

      <SignedIn>
        <UserButton
          
          // userProfileMode="navigation"
          // userProfileUrl="/profile"
          // redirectUrl="/"
        />
      </SignedIn>

   


      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Image
      </Button>

      {selectedImage && (
        <>
          <div className="mt-4">
            <h3>Original Image:</h3>
            <img src={selectedImage} alt="Selected" className="w-64 h-auto rounded-md" />
          </div>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
            onClick={handleRemoveBackground}
          >
            Remove Background
          </button>
        </>
      )}

      {removedBgImageUrl && (
        <div className="mt-4">
          <h3>Background Removed:</h3>
          <img src={removedBgImageUrl} alt="Removed Background" className="w-64 h-auto rounded-md" />
        </div>
      )}
    </div>
  );
};

export default Page;
