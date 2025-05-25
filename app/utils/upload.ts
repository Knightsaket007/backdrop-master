export const uploadImage = async (
  base64: string,
  type: 'sticker' | 'other',
  name?: string
): Promise<string> => {
  const res = await fetch('/api/upload-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, type, name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
};
