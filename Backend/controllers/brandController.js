// backend/controllers/brandController.js
import BrandProfile from "../models/BrandProfile.js";
import User from "../models/User.js";

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

  // Validate required fields
  if (!companyName) {
    return res.status(400).json({ msg: "Company name is required" });
  }
  
  if (!industry) {
    return res.status(400).json({ msg: "Industry is required" });
  }
  
  if (!contactEmail) {
    return res.status(400).json({ msg: "Contact email is required" });
  }

  const profileFields = { user: req.user.id };

  // Required fields
  profileFields.companyName = companyName;
  profileFields.industry = industry;
  profileFields.contactEmail = contactEmail;

  // Optional fields
  if (description !== undefined) profileFields.description = description || "";
  if (logoUrl !== undefined) profileFields.logoUrl = logoUrl || "";
  if (website) profileFields.website = website;
  if (budgetPerPost !== undefined) profileFields.budgetPerPost = budgetPerPost;

  // Merge socialLinks safely
  const existingProfile = await BrandProfile.findOne({ user: req.user.id });
  if (socialLinks) {
    profileFields.socialLinks = {
      ...(existingProfile?.socialLinks || {}),
      ...socialLinks
    };
  } else if (existingProfile?.socialLinks) {
    profileFields.socialLinks = existingProfile.socialLinks;
  }

  try {
    let profile = await BrandProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("user", ["name", "avatar"]);

    res.json(profile);
  } catch (err) {
    console.error('Brand profile save error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation error', errors: err.errors });
    }
    res.status(500).send("Server Error");
  }
};

// Get current user's brand profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await BrandProfile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
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
    const profile = await BrandProfile.findOne({ user: req.params.userId })
      .populate("user", ["name", "email"]);
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

// Get all brands with search, filter, and pagination
export const searchBrands = async (req, res) => {
  try {
    const { q, industry, minBudget, maxBudget, page = 1, limit = 10 } = req.query;
    
    // Build filter criteria
    const filter = {};
    
    // Text search across multiple fields
    if (q) {
      filter.$or = [
        { companyName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { industry: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Industry filter
    if (industry) {
      filter.industry = industry;
    }
    
    // Budget range filter
    if (minBudget || maxBudget) {
      filter.budgetPerPost = {};
      if (minBudget) filter.budgetPerPost.$gte = Number(minBudget);
      if (maxBudget) filter.budgetPerPost.$lte = Number(maxBudget);
    }
    
    // If no filters are provided, get latest brands
    if (!q && !industry && !minBudget && !maxBudget) {
      const docs = await BrandProfile.find()
        .populate('user', ['name', 'email', 'avatar'])
        .sort('-createdAt')
        .limit(10)
        .lean();
        
      return res.json({ 
        total: docs.length, 
        page: 1, 
        limit: 10, 
        results: docs 
      });
    }
    
    // Apply filters with pagination
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.min(50, Number(limit)); // Limit maximum results per page
    
    const docs = await BrandProfile.find(filter)
      .populate('user', ['name', 'email', 'avatar'])
      .sort('-createdAt')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();
      
    // Get total count matching the filter
    const total = await BrandProfile.countDocuments(filter);
    
    res.json({ 
      total, 
      page: pageNumber, 
      limit: pageSize, 
      results: docs 
    });
    
  } catch (error) {
    console.error('Error in brand search:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
};

// Delete brand profile
export const deleteProfile = async (req, res) => {
  try {
    await BrandProfile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};