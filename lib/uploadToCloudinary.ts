import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { getImageHash } from '@/app/utils/getImageHash'; // your existing hash util

type UploadType = 'sticker' | 'other';

export const uploadToCloudinary = async (
  buffer: Buffer,
  originalName: string,
  type: UploadType
): Promise<string> => {
  // Dynamic credentials
  const cloudName = type === 'sticker'
    ? process.env.CLOUDINARY_STICKER_CLOUD_NAME!
    : process.env.CLOUDINARY_ASSETS_CLOUD_NAME!;

  const apiKey = type === 'sticker'
    ? process.env.CLOUDINARY_STICKER_API_KEY!
    : process.env.CLOUDINARY_ASSETS_API_KEY!;

  const apiSecret = type === 'sticker'
    ? process.env.CLOUDINARY_STICKER_API_SECRET!
    : process.env.CLOUDINARY_ASSETS_API_SECRET!;

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  // 🧠 Hash the image buffer to generate consistent public_id
  const hash = getImageHash(buffer); // or use crypto.createHash... if inline
  const publicId = `${type}/${hash}`;

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: type,
          resource_type: 'image',
          overwrite: false, // prevent duplicate
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('No result from Cloudinary'));
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return result.secure_url;
  } catch (err: unknown) {
  if (err instanceof Error && err.message.includes('already exists')) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${type}/${hash}`;
  }

  throw err;
}
};
