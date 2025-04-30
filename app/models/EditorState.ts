import mongoose, { Schema, models, model } from "mongoose";

const EditorStateSchema = new Schema({

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
    colorArray: { type: String, required: false },


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
                top: { type: String, required: true },
                left: { type: String, required: true },
                rotate: { type: Number, required: true },
                width: { type: String, required: true },
                height: { type: String, required: true },
                shadow: {
                    type: [Schema.Types.Mixed], // since array has 3 numbers & 1 string
                    validate: arr => arr.length === 4,
                    required: true,
                },
                hasShadow: { type: Boolean, required: true },
                textImage: { type: String, required: true },
                gradient: {
                    type: [Schema.Types.Mixed], // [angle, color1, color2]
                    validate: arr => arr.length === 3,
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
});

const EditorState = models.EditorState || model("EditorState", EditorStateSchema);

export default EditorState;
