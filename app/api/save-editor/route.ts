import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body = await req.json();
    const {
      userId,
      plan,
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

    const existing =await EditorState.findOne({ userId });
    console.log("user found:", existing );

    if (existing) {
      console.log("📝 User found, updating state...");

        await EditorState.findByIdAndUpdate(existing._id, {
        plan,
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
    } else {
      console.log(" No existing user, creating new state...");
      await EditorState.create({
        userId,
        plan,
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
    }

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("❌ Save failed:", error);
    return new Response(JSON.stringify({ error: "Failed to save" }), { status: 500 });
  }
}
