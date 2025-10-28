// backend/models/BrandProfile.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const brandProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  description: String,
  logoUrl: { type: String, default: '' },
  website: String,
  socialLinks: {
    instagram: String,
    twitter: String,
    linkedin: String,
  },
  budgetPerPost: Number,
  contactEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BrandProfile = model("BrandProfile", brandProfileSchema);

export default BrandProfile;