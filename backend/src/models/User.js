import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, default: "lawyer" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
