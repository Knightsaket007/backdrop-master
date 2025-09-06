// app/api/remove-bg/route.ts
import { NextRequest, NextResponse } from "next/server";

// const TIMEOUT = 20000;
const TIMEOUT = 10000;

async function fetchWithTimeout(url: string, options: RequestInit) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // 1. Try PhotoRoom
    try {
      const res = await fetchWithTimeout("https://sdk.photoroom.com/v1/segment", {
        method: "POST",
        headers: {
          "x-api-key": process.env.PHOTOROOM_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const blob = await res.blob();
      return new NextResponse(blob, {
        headers: { "Content-Type": "image/png", "X-Provider": "photoroom" },
      });
    } catch (err) {
      console.warn("PhotoRoom failed, falling back → Dezgo:", err);
    }

    // 2. Fallback → Dezgo
    // const res = await fetchWithTimeout("https://api.dezgo.com/remove-background", {
    //   method: "POST",
    //   headers: { "X-Dezgo-Key": process.env.DEZGO_API_KEY! },
    //   body: JSON.stringify({ image_url: imageUrl }),
    // });

    // const blob = await res.blob();
    return new NextResponse(blob, {
      headers: { "Content-Type": "image/png", "X-Provider": "dezgo" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to remove background" }, { status: 500 });
  }
}
