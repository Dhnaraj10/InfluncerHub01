// backend/controllers/brandController.js
import BrandProfile from "../models/BrandProfile.js";

// Create or Update brand profile
export const createOrUpdateProfile = async (req, res) => {
  const {
    companyName,
    industry,
    description,
    logoUrl,
    website,
    contactEmail,
    socialLinks,
    budgetPerPost,
  } = req.body;

  const profileFields = { user: req.user.id };

  // Required fields
  if (companyName) profileFields.companyName = companyName;
  if (industry) profileFields.industry = industry;
  if (contactEmail) profileFields.contactEmail = contactEmail;

  // Optional fields
  if (description !== undefined) profileFields.description = description || "";
  if (logoUrl !== undefined) profileFields.logoUrl = logoUrl || "";
  if (website) profileFields.website = website;
  if (budgetPerPost !== undefined) profileFields.budgetPerPost = budgetPerPost;

  // Merge socialLinks safely
  const existingProfile = await BrandProfile.findOne({ user: req.user.id });
  const existingLinks = existingProfile?.socialLinks || {};

  profileFields.socialLinks = {
    instagram: socialLinks?.instagram !== undefined ? socialLinks.instagram : existingLinks.instagram || "",
    twitter: socialLinks?.twitter !== undefined ? socialLinks.twitter : existingLinks.twitter || "",
    linkedin: socialLinks?.linkedin !== undefined ? socialLinks.linkedin : existingLinks.linkedin || "",
  };

  try {
    let profile = await BrandProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get own brand profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await BrandProfile.findOne({ user: req.user.id }).populate("user", ["name", "email"]);
    if (!profile) {
      return res.status(404).json({ msg: "Brand profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get profile by user ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await BrandProfile.findOne({ user: req.params.userId }).populate("user", ["name", "email"]);
    if (!profile) {
      return res.status(404).json({ msg: "Brand profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid profile ID" });
    }
    res.status(500).send("Server Error");
  }
};

// Delete brand profile
export const deleteProfile = async (req, res) => {
  try {
    await BrandProfile.findOneAndDelete({ user: req.user.id });
    res.json({ msg: "Brand profile deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};