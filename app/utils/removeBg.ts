import { removeBackground } from "@imgly/background-removal";

export const removeBg = async (imageUrl: string): Promise<string | null> => {
  try {
    const imageBlob = await removeBackground(imageUrl);
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("Background Removal Error:", error);
    return null;
  }
};
