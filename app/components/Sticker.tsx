import { useEffect, useState } from "react";

const PIXABAY_API_KEY = "49616266-4ed9268cf8716ab706261c0e1";
const PIXABAY_API_URL = "https://pixabay.com/api/";

const fetchStickers = async () => {
  const cacheKey = "pixabay_stickers";
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      console.log("Serving from cache");
      return data;
    } else {
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const response = await fetch(
      `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=sticker&image_type=illustration&category=art&per_page=50`
    );
    const data = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify({ data: data.hits, timestamp: Date.now() }));
    return data.hits;
  } catch (error) {
    console.error("Failed to fetch stickers", error);
    return [];
  }
};

const StickerComp = ({ onSelect }) => {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchStickers()
      .then((data) => setStickers(data))
      .catch(() => setError("Failed to load stickers"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-64 overflow-y-auto grid grid-cols-3 gap-2 p-2">
      {stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.previewURL}
          alt={sticker.tags}
          className="cursor-pointer rounded-lg hover:scale-110 transition-transform"
          onClick={() => onSelect(sticker.largeImageURL)}
        />
      ))}
    </div>
  );
};

export default StickerComp;
