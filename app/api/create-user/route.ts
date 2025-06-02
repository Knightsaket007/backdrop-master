import Createuser from "@/app/models/CreateUser";
import InitialModel from "@/app/models/InitialProject";
import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, email,name, } = await req.json();
        if (!userId) return NextResponse.json(
            { error: "Missing userId" },
            { status: 400 }
        );

        await connectToDB();

        const user=await Createuser.findOne({userId});
        console.log("")
        
        if(user){
         return NextResponse.json({error:"User already exists"}, {status:400});    
        }

        const balance=0;
        const createdAt=Date.now();
        console.log('created date', createdAt)

        const newUser=await Createuser.insertOne({
            userId,
            email,
            name,
            balance,
            createdAt,
        })

        if (!newUser) {
            return NextResponse.json(
                { error: "Failed to create user" },
                { status: 500 }
            );
        }    

    }
    catch (err) {

        console.error("Error creating project:", err);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );

    }
}