import { useEffect, useState } from "react";

const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
const PIXABAY_API_URL = "https://pixabay.com/api/";

const StickerComp = ({ onSelect }: { onSelect: (url: string) => void }) => {
  const [stickers, setStickers] = useState<{ id: number; previewURL: string; largeImageURL: string; tags: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStickers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=sticker&image_type=illustration&category=art&per_page=50`
        );
        const data = await response.json();
        setStickers(data.hits || []);
      } catch (err) {
        setError("Failed to load stickers");
      }
      setLoading(false);
    };

    fetchStickers();
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
