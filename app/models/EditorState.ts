import { Schema, models, model } from "mongoose";



const EditorStateSchema = new Schema({
  userId: { type: String, required: true },
  plan: { type: String, required: false, default: "free" },
  stickers: {
    type: [
      {
        id: { type: Number, required: true },
        src: { type: String, required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        size: { type: Number, required: true },
      },
    ],
    required: false,
    default: [],
  },

  backgroundImage: { type: String, required: true },
  bgremovedImage: { type: String, required: false },
  imgWidth: { type: Number, required: true },
  imgHeight: { type: Number, required: true },
  brushColor: { type: String, required: false },
  brushSize: { type: String, required: false },
  showFilters: { type: String, required: false },
  colorArray: {
    type: [String], // allows array of strings like ['#000', '#fff']
  required: false,
  default: [],
  },

  texts: {
    type: [
      {
        id: { type: Number, required: true },
        content: { type: String, required: true },
        fontFamily: { type: String, required: true },
        size: { type: String, required: true },
        bold: { type: Boolean, required: true },
        italic: { type: Boolean, required: true },
        color: { type: String, required: true },
        top: { type: String, required: false },
        left: { type: String, required: false },
        rotate: { type: Number, required: false },
        width: { type: String, required: false },
        height: { type: String, required: false },
        shadow: {
          type: [Schema.Types.Mixed], // since array has 3 numbers & 1 string
          required: false,
        },
        hasShadow: { type: Boolean, required: false },
        textImage: { type: String, required: false },
        gradient: {
          type: [Schema.Types.Mixed], // [angle, color1, color2]
          required: true,
        },
        isgradient: { type: Boolean, required: true },
      },
    ],
    required: function (this: Record<string, unknown>) {
      return this.bgremovedImage;
    },
    default: [],
  },

  //   userId: { type: String, required: true },
  //   texts: { type: Array, required: true },
  //   createdAt: { type: Date, default: Date.now },
},
  { collection: "EditorStates" }
);




const EditorState = models.EditorState || model("EditorState", EditorStateSchema);

export default EditorState;
