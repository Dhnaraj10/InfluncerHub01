// backend/models/User.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["brand", "influencer", "admin"], default: "brand" },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
});

const User = model("User", userSchema);

export default User;
