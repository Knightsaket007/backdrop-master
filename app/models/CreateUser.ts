import { Schema, models, model } from "mongoose";

const CreateUserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    balance: { type: Number, default: 0 },
    stripeCustomerId: String, //=-=-=-=- optional=-=--=-=//
    createdAt: { type: Date, default: Date.now },
},
    { collection: "User" }
)

const Createuser = models.createuser || model("createuser", CreateUserSchema);

export default Createuser;