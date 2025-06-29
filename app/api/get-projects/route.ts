// /api/load-editor.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID in query" }, { status: 400 });

    await connectToDB();
    const data = await EditorState.find({ userId: id });
    return NextResponse.json(data);
}

