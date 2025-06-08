// /api/load-editor.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function POST(req: Request) {
  try {
    const { editorId } = await req.json();

    if (!editorId) return NextResponse.json({ error: "Missing editorId" }, { status: 400 });

    await connectToDB();
    const data = await EditorState.findOne({ _id: editorId });

    if (!data) {
      return NextResponse.json({ message: "No editor state found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to load editor state:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
