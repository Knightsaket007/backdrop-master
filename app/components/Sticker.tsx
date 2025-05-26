import { useEffect, useState } from "react";
import { uploadImage } from "@/app/utils/upload"; // 📌 util function yeh call karega API ko

const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY!;
const PIXABAY_API_URL = "https://pixabay.com/api/";

const CACHE_KEY = "pixabay_stickers";
const CACHE_EXPIRY_KEY = "pixabay_stickers_expiry";

const StickerComp = ({
  onSelect,
  searchQuery = "",
  setactiveLoader
}: {
  onSelect: (url: string) => void;
  searchQuery?: string;
  setactiveLoader: (isLoading: boolean) => void;
}) => {
  const [stickers, setStickers] = useState<{ id: number; previewURL: string; largeImageURL: string; tags: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStickers = async (query = "sticker", useCache = true) => {
    setLoading(true);
    try {
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

      if (useCache && query === "sticker") {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.hits || []));
        sessionStorage.setItem(CACHE_EXPIRY_KEY, (new Date().getTime() + 24 * 60 * 60 * 1000).toString());
      }
    } catch (err:unknown) {
      console.log('error occoured ', err)
      setError("Failed to load stickers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchStickers(searchQuery.trim(), false);
      } else {
        fetchStickers("sticker", true);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleStickerClick = async (pixabayUrl: string) => {
    try {
      setactiveLoader(true);
      const res = await fetch(pixabayUrl);
      const blob = await res.blob();

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const cloudUrl = await uploadImage(base64, 'sticker');
      onSelect(cloudUrl); 
      setactiveLoader(false);
    } catch (err) {
      console.error("Upload failed:", err);
      setactiveLoader(false);
    }
  };

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
          onClick={() => handleStickerClick(sticker.largeImageURL)}
        />
      ))}
    </div>
  );
};

export default StickerComp;
