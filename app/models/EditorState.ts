import { Schema, models, model } from "mongoose";



const EditorStateSchema = new Schema({
    userId: { type: String, required: false },
    texts: { type: String, required: false },
  }, {
    collection: "EditorStates"
  });
  

const EditorState = models.EditorState || model("EditorState", EditorStateSchema);

export default EditorState;
