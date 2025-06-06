import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
// import { clerkClient } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing WEBHOOK_SECRET");
    return new Response("Missing webhook secret", { status: 400 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text(); // Use text() instead of json()
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  console.log(`✅ Received event: ${eventType}`);

  if (eventType === "user.created") {
    try {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username || `user_${id}`,
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url,
      };

      const newUser = await createUser(user);

      // Optional: save publicMetadata back to Clerk
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      console.log("✅ User created and stored in DB.");
    } catch (err) {
      console.error("Error processing user.created:", err);
    }
  }

  if (eventType === "user.deleted") {
    try {
      const { id } = evt.data;
      console.log('delelte id is', id)
      if(!id)return new Response("Missing user ID", { status: 400 });
      await deleteUser(id);

      console.log("🗑️ User deleted from DB successfully.");
    } catch (err) {
      console.error(" Error processing user.deleted:", err);
    }
  }

  if (eventType === "user.updated") {
  try {
    const { id, username, first_name, last_name } = evt.data;

    if (!id) {
      return new Response("Missing user ID", { status: 400 });
    }

    // Build update payload (only fields you want to update)
    const updatedData = {
      ...(username && { username }),
      ...(first_name && { firstName: first_name }),
      ...(last_name && { lastName: last_name }),
    };

    const updatedUser = await updateUser(id, updatedData);

    if (!updatedUser) {
      console.warn("Clerk user exists, but not found in DB:", id);
    } else {
      console.log("User updated in DB successfully.");
    }
  } catch (err) {
    console.error("Error processing user.updated:", err);
  }
}


  return NextResponse.json({ success: true });
}
