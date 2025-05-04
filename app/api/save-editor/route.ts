import { connectToDB } from "@/lib/mongodb";
import EditorState from "@/app/models/EditorState";

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body = await req.json();
    const {
      userId,
      plan,
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

    console.log("inapi data..:", { userId, texts });

    const user=await EditorState.findOne({ userId });
    console.log("user found:", user);
    if (user) {
      console.log("📝 User found, updating state...");

      user.stickers = stickers;
      user.plan = plan;
      user.backgroundImage = backgroundImage;
      user.bgremovedImage = bgremovedImage;
      user.imgWidth = imgWidth;
      user.imgHeight = imgHeight;
      user.brushColor = brushColor;
      user.brushSize = brushSize;
      user.showFilters = showFilters;
      user.colorArray = colorArray;
      user.texts = texts;

      await user.save();
    } else {
      console.log(" No existing user, creating new state...");
      await EditorState.create({
        userId,
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
