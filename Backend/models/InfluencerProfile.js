// backend/models/InfluencerProfile.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const influencerProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  handle: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: '' },
  bio: String,
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  location: String,
  socialLinks: {
    instagram: String,
    youtube: String,
    tiktok: String,
    twitter: String,
    other: String,
  },
  followerCount: { type: Number, default: 0 },
  averageEngagementRate: { type: Number, default: 0 },
  portfolio: [{ type: String }], // image URLs
  tags: [String],
  pricing: {
    post: Number,
    reel: Number,
    story: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const InfluencerProfile = model("InfluencerProfile", influencerProfileSchema);

export default InfluencerProfile;