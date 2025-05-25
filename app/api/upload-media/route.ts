import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

export const runtime = 'nodejs'; // force edge -> node for Buffer support

export async function POST(req: NextRequest) {
  const { base64, type, name } = await req.json();

  if (!base64 || !type) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const buffer = Buffer.from(base64.split(',')[1], 'base64');

  try {
    const url = await uploadToCloudinary(buffer, name || `upload-${Date.now()}`, type);
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
