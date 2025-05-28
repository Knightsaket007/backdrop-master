import InitialModel from "@/app/models/InitialProject";
import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) return NextResponse.json(
            { error: "Missing userId" },
            { status: 400 }
        );

        await connectToDB();

        


    }
    catch (err) {

    }
}