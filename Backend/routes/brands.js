// backend/routes/brands.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import { createOrUpdateProfile, deleteProfile, getMyProfile, getProfileById, searchBrands } 
  from "../controllers/brandController.js";

const router = express.Router();

// Create or Update brand profile
router.post("/me", auth, role(["brand"]), createOrUpdateProfile);
router.put("/me", auth, role(["brand"]), createOrUpdateProfile);

// Get own profile
router.get("/me", auth, role(["brand"]), getMyProfile);

// Get profile by user ID
router.get("/:userId", getProfileById);

// Search brands
router.get("/", searchBrands);

// Delete brand profile
router.delete("/me", auth, role(["brand"]), deleteProfile);

export default router;