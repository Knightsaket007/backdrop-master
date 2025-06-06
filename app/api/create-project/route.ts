import userSchema from "@/app/models/User.model";
import InitialModel from "@/app/models/InitialProject";
import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, useremail, } = await req.json();
        if (!userId) return NextResponse.json(
            { error: "Missing userId" },
            { status: 400 }
        );

        await connectToDB();

        const user=await userSchema.findOne({userId});
        
        if(user){
         return NextResponse.json({error:"User already exists"}, {status:400});    
        }

        const newUser=await userSchema.insertOne({

        })

    }
    catch (err) {

        console.error("Error creating project:", err);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );

    }
}