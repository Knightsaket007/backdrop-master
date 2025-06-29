// /api/load-editor.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function GET(req: Request) {
    try {

        //=-=-=-= Next Logic for user active id or not=-=-=-//
        //=-=-=-= Next Logic for user active id or not=-=-=-//

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "Missing editor ID" }, { status: 400 });
        await connectToDB();
        const data = await EditorState.find({ _id: id });
        console.log("data...", data)

        return NextResponse.json(data);
    } catch (err) {
        console.error("Failed to load editor state:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
