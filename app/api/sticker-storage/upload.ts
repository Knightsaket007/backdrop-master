import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb', // Increase if needed
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { base64, name } = req.body;

  if (!base64) return res.status(400).json({ error: 'Missing image data' });

  const buffer = Buffer.from(base64.split(',')[1], 'base64');

  try {
    const result = await uploadToCloudinary(buffer, name || undefined);
    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload failed', err);
    res.status(500).json({ error: 'Upload failed' });
  }
}
