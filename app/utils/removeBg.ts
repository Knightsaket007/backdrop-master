import { removeBackground } from "@imgly/background-removal";

export const removeBg = async (imageUrl: string) => {
  try {
    const imageBlob = await removeBackground(imageUrl);
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("Error removing background:", error);
    return null;
  }
};
