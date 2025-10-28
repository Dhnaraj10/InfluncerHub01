// backend/routes/influencers.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import influencerController from "../controllers/influencerController.js";

const router = express.Router();

// Create or Update influencer profile
router.post("/me", auth, role(["influencer"]), influencerController.createOrUpdateProfile);
router.put("/me", auth, role(["influencer"]), influencerController.createOrUpdateProfile); // ✅ Added PUT support

// Get own profile
router.get("/me", auth, influencerController.getMyProfile);

// Get profile by handle
router.get("/handle/:handle", influencerController.getProfileByHandle);

// Search influencers
router.get("/", influencerController.searchInfluencers);

export default router;
