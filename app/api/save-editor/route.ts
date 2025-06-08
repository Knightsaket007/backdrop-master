import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";
import { error } from "console";

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body = await req.json();
    const {
      userId,
      editorId,
      stickers,
      backgroundImage,
      bgremovedImage,
      imgWidth,
      imgHeight,
      brushColor,
      brushSize,
      showFilters,
      colorArray,
      texts,
    } = body;

    console.log("inapi data..:", body);

    const existing = await EditorState.findOne({ _id: editorId });
    console.log("user found:", existing);

    if (existing) {
      if (existing.userId != userId) {
        return new Response(JSON.stringify({ success: false, message: "user not exist" }), { status: 400 });
      }

      console.log("📝 User found, updating state...");

      await EditorState.findByIdAndUpdate(existing._id, {
        // plan,
        editorId,
        stickers,
        backgroundImage,
        bgremovedImage,
        imgWidth,
        imgHeight,
        brushColor,
        brushSize,
        showFilters,
        colorArray,
        texts,
      });

      // await user.save();
    }

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Save failed:", error);
    return new Response(JSON.stringify({ error: "Failed to save" }), { status: 500 });
  }
}
