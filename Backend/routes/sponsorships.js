// Backend/routes/sponsorships.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createSponsorship,
  getSponsorshipById,
  getMySponsorships,
  getMyBrandSponsorships,
  acceptSponsorship,
  rejectSponsorship,
  getOpenSponsorships,
  cancelSponsorship,
  completeSponsorship,
  getRecentActivities
} from "../controllers/sponsorshipController.js";

const router = express.Router();

// Brand creates sponsorship
router.post("/", auth, createSponsorship);

// Specific routes should come before parameterized routes to avoid conflicts
// Get all open sponsorships (for influencers)
router.get("/open", auth, getOpenSponsorships);

// Influencer views their sponsorship offers
router.get("/my", auth, getMySponsorships);

// Brand views the sponsorships they created
router.get("/brand/my", auth, getMyBrandSponsorships);

// Get recent activities for a user
router.get("/activities", auth, getRecentActivities);

// Get all sponsorships (for dashboard)
router.get("/", auth, getMySponsorships);

// Get a single sponsorship by ID - this should come AFTER specific routes like /my, /activities, etc.
router.get("/:id", auth, getSponsorshipById);

// Influencer accepts/rejects sponsorship
router.patch("/:id/accept", auth, acceptSponsorship);
router.patch("/:id/reject", auth, rejectSponsorship);

// Brand cancels sponsorship
router.put("/:id/cancel", auth, cancelSponsorship);

// Brand marks sponsorship as completed
router.put("/:id/complete", auth, completeSponsorship);

export default router;