import { create } from "domain";
import { Schema, models, model} from "mongoose";

const CreateUserSchema = new Schema({
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    username: { type: String, required: true },
},
{ collection: "User" }
)

const Createuser= models.createuser || model("createuser", CreateUserSchema);

export default Createuser;