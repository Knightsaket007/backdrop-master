// /api/load-editor.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function DELETE(req: Request) {
    const body = await req.json();
    const { user, id } = body;
    if (!user) return NextResponse.json({ error: "Missing user in query" }, { status: 400 });
    if (!id) return NextResponse.json({ error: "Missing ID in query" }, { status: 400 });


    await connectToDB();
    const data = await EditorState.findOneAndDelete({
        _id: id
        , userId: user
    });
    return NextResponse.json(data);
}

