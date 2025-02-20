import { removeBackground } from "@imgly/background-removal";

// Helper function to fetch with retries
async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Blob> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying fetch (${retries} attempts left)...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay);
    } else {
      throw error; // Re-throw the error if all retries fail
    }
  }
}

export const removeBg = async (imageUrl: string): Promise<string | null> => {
  try {
    // Fetch the image with retry logic
    const blob = await fetchWithRetry(imageUrl);

    // Remove the background
    const imageBlob = await removeBackground(blob);

    // Create and return a URL for the processed image
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("Background Removal Error:", error);
    return null;
  }
};