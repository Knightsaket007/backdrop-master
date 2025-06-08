import Createuser from "@/app/models/CreateUser";
import InitialModel from "@/app/models/InitialProject";
import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        const { userId: authUserId } =await auth();

        if (!authUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        await connectToDB();

        const isExist = await Createuser.findOne({ clerkId: userId });
        if (isExist) {
            return NextResponse.json({ error: "Initial project already exists" }, { status: 400 });
        }

        const created = await InitialModel.create({ userId });

        if (!created) {
            return NextResponse.json({ error: "Failed to create initial project" }, { status: 500 });
        }

        console.log('created..', created)

        return NextResponse.json({ success: true, data: created._id }, { status: 201 });
    } catch (err) {
        console.error("Failed to create initial project:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
