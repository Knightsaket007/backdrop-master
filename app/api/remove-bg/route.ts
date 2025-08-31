import { NextRequest, NextResponse } from "next/server";

async function fetchWithTimeout(url: string, opts: RequestInit & { timeout?: number } = {}) {
  const { timeout = Number(process.env.BG_TIMEOUT_MS ?? 20000), ...rest } = opts;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { ...rest, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// async function readInput(req: NextRequest): Promise<{ buffer: Buffer; filename: string } | { error: string; code?: number }> {
//   const contentType = req.headers.get("content-type") || "";

//   if (contentType.includes("multipart/form-data")) {
//     const form = await req.formData();
//     const file = form.get("image");
//     if (!file || !(file instanceof File)) return { error: "Field 'image' (File) is required.", code: 400 };
//     const arrayBuffer = await file.arrayBuffer();
//     return { buffer: Buffer.from(arrayBuffer), filename: (file as File).name || "upload.png" } as any;
//   }

//   if (contentType.includes("application/json")) {
//     const { imageUrl } = await req.json();
//     if (!imageUrl || typeof imageUrl !== "string") return { error: "Provide 'imageUrl' in JSON body.", code: 400 };
//     const res = await fetch(imageUrl);
//     if (!res.ok) return { error: `Failed to fetch imageUrl (HTTP ${res.status}).`, code: 400 };
//     const arrayBuffer = await res.arrayBuffer();
//     const filename = imageUrl.split("?")[0].split("/").pop() || "remote.jpg";
//     return { buffer: Buffer.from(arrayBuffer), filename };
//   }

//   return { error: "Unsupported content-type. Use multipart/form-data with 'image' or JSON { imageUrl }.", code: 415 };
// }

// async function callPhotoRoom(image: Buffer, filename: string) {
//   const key = process.env.PHOTOROOM_API_KEY;
//   if (!key) throw new Error("PHOTOROOM_API_KEY missing");

//   const endpoint = "https://sdk.photoroom.com/v1/segment";
//   const form = new FormData();
//   form.append("image_file", new Blob([image]), filename || "image.jpg");
//   form.append("format", "png");

//   const res = await fetchWithTimeout(endpoint, {
//     method: "POST",
//     headers: {
//       "x-api-key": key,
//       "Accept": "image/png, application/json",
//     },
//     body: form as any,
//   });

//   if (!res.ok) throw new Error(`PhotoRoom failed: ${res.status}`);
//   const arrayBuffer = await res.arrayBuffer();
//   return Buffer.from(arrayBuffer);
// }

// async function callDezgo(image: Buffer) {
//   const key = process.env.DEZGO_API_KEY;
//   if (!key) throw new Error("DEZGO_API_KEY missing");

//   const form = new FormData();
//   form.append("image", new Blob([image]), "image.png");

//   const res = await fetchWithTimeout("https://api.dezgo.com/remove-background", {
//     method: "POST",
//     headers: {
//       "X-Dezgo-Key": key,
//       "Accept": "image/png,application/json",
//     },
//     body: form as any,
//   });

//   if (!res.ok) throw new Error(`Dezgo failed: ${res.status}`);
//   const arrayBuffer = await res.arrayBuffer();
//   return Buffer.from(arrayBuffer);
// }

// export async function POST(req: NextRequest) {
//   try {
//     const input = await readInput(req);
//     if ("error" in input) {
//       return NextResponse.json({ error: input.error }, { status: input.code ?? 400 });
//     }
//     const { buffer, filename } = input;

//     // Try PhotoRoom first
//     if (process.env.PHOTOROOM_API_KEY) {
//       try {
//         const pr = await callPhotoRoom(buffer, filename);
//         return new NextResponse(pr, {
//           status: 200,
//           headers: { "Content-Type": "image/png", "X-Provider-Used": "photoroom" },
//         });
//       } catch (e) {
//         console.error("PhotoRoom failed:", e);
//       }
//     }

//     // Fallback: Dezgo
//     if (process.env.DEZGO_API_KEY) {
//       try {
//         const dz = await callDezgo(buffer);
//         return new NextResponse(dz, {
//           status: 200,
//           headers: { "Content-Type": "image/png", "X-Provider-Used": "dezgo" },
//         });
//       } catch (e) {
//         console.error("Dezgo failed:", e);
//       }
//     }

//     return NextResponse.json({ error: "All providers failed or missing keys" }, { status: 502 });
//   } catch (err) {
//     return NextResponse.json({ error: (err as Error).message }, { status: 500 });
//   }
// }
