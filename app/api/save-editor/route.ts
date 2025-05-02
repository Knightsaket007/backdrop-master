import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body = await req.json();
    const { userId, texts } = body;

    console.log("inapi data..:", { userId, texts });
    await EditorState.create({ userId, texts });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("❌ Save failed:", error);
    return new Response(JSON.stringify({ error: "Failed to save" }), { status: 500 });
  }
}
