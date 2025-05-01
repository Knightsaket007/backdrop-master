import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body = await req.json();
    const { userId, texts } = body;

    await EditorState.create({ userId, texts });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save" }), { status: 500 });
  }
}
