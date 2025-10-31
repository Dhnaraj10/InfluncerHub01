// backend/models/Sponsorship.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const sponsorshipSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: "BrandProfile", required: true },
  influencer: { type: Schema.Types.ObjectId, ref: "InfluencerProfile", required: true },
  title: { type: String, required: true },
  description: String,
  budget: Number,
  deliverables: [String],
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Sponsorship = model("Sponsorship", sponsorshipSchema);

export default Sponsorship;