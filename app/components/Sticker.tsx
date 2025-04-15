import { useEffect, useState } from "react";

const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
const PIXABAY_API_URL = "https://pixabay.com/api/";

const CACHE_KEY = "pixabay_stickers";
const CACHE_EXPIRY_KEY = "pixabay_stickers_expiry";

const StickerComp = ({
  onSelect,
  searchQuery = "",
}: {
  onSelect: (url: string) => void;
  searchQuery?: string;
}) => {
  const [stickers, setStickers] = useState<{ id: number; previewURL: string; largeImageURL: string; tags: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStickers = async (query = "sticker", useCache = true) => {
    setLoading(true);
    try {
      // Cache logic for default load only (not for search)
      if (useCache && query === "sticker") {
        const cached = sessionStorage.getItem(CACHE_KEY);
        const expiry = sessionStorage.getItem(CACHE_EXPIRY_KEY);
        const isValid = cached && expiry && new Date().getTime() < parseInt(expiry);

        if (isValid) {
          setStickers(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const response = await fetch(
        `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=illustration&category=art&per_page=50`
      );
      const data = await response.json();

      setStickers(data.hits || []);

      // Only cache default sticker data
      if (useCache && query === "sticker") {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.hits || []));
        sessionStorage.setItem(CACHE_EXPIRY_KEY, (new Date().getTime() + 24 * 60 * 60 * 1000).toString()); // 1 day
      }
    } catch (err) {
      setError("Failed to load stickers");
    }
    setLoading(false);
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchStickers();
  }, []);

  // 🔍 Search stickers live from Pixabay
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchStickers(searchQuery.trim(), false); // No cache when searching
      } else {
        fetchStickers("sticker", true); // Default with cache
      }
    }, 500); // 500ms debounce
  
    return () => clearTimeout(timeout); // Cleanup on next keystroke
  }, [searchQuery]);

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
