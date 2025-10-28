//backend/routes/analytics.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import Sponsorship from "../models/Sponsorship.js";

const router = express.Router();

// Simple analytics derived from sponsorships created by brand or received by influencer
router.get("/overview", auth, async (req, res) => {
  try {
    const asBrand = await Sponsorship.countDocuments({ brand: req.user._id });
    const asInfluencer = await Sponsorship.countDocuments();
    const byStatus = await Sponsorship.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json({ asBrand, asInfluencer, byStatus });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;


