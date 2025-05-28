import { Schema, models, model} from "mongoose";

const InitialProjectSchema = new Schema({
    userId: { type: String, required: true }
},
{ collection: "EditorStates" }
)

const InitialModel= models.initalModel || model("initalModel", InitialProjectSchema);

export default InitialModel;