import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

type UploadType = 'sticker' | 'other';

export const uploadToCloudinary = async (
  buffer: Buffer,
  publicId: string,
  type: UploadType
) => {
  // Dynamic env based on type
  const cloudName = type === 'sticker'
    ? process.env.CLOUDINARY_STICKER_CLOUD_NAME!
    : process.env.CLOUDINARY_OTHER_CLOUD_NAME!;

  const apiKey = type === 'sticker'
    ? process.env.CLOUDINARY_STICKER_API_KEY!
    : process.env.CLOUDINARY_OTHER_API_KEY!;

  const apiSecret = type === 'sticker'
    ? process.env.CLOUDINARY_STICKER_API_SECRET!
    : process.env.CLOUDINARY_OTHER_API_SECRET!;

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: type,
        resource_type: 'image',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });

  return result.secure_url;
};
