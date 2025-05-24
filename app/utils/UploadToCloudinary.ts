import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (imageBuffer: Buffer, publicId?: string) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'image', public_id: publicId, folder: 'stickers' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(imageBuffer);
  });

  return result;
};
