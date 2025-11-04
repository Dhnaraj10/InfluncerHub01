// backend/controllers/brandController.js
import BrandProfile from "../models/BrandProfile.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Helper function for sending error responses
const sendError = (res, status, message, error = null) => {
  console.error(`Error ${status}: ${message}`, error ? '\n' + error.stack : '');
  return res.status(status).json({ 
    success: false,
    error: message,
    ...(error && { stack: error.stack })
  });
};

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
    return sendError(res, 400, 'Company name is required');
  }
  
  if (!industry) {
    return sendError(res, 400, 'Industry is required');
  }
  
  if (!contactEmail) {
    return sendError(res, 400, 'Contact email is required');
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

    res.json({ success: true, profile });
    
  } catch (err) {
    if (err.name === 'ValidationError') {
      return sendError(res, 400, 'Validation error', err);
    }
    return sendError(res, 500, 'Server error', err);
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
      return sendError(res, 404, 'Brand profile not found');
    }

    res.json({ success: true, profile });
  } catch (err) {
    return sendError(res, 500, 'Server error', err);
  }
};

// Get profile by user ID
export const getProfileById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return sendError(res, 400, 'Invalid profile ID');
    }

    const profile = await BrandProfile.findOne({ user: req.params.userId })
      .populate("user", ["name", "email"]);
    
    if (!profile) {
      return sendError(res, 404, 'Brand profile not found');
    }
    
    res.json({ success: true, profile });
  } catch (err) {
    return sendError(res, 500, 'Server error', err);
  }
};

// Get all brands with search, filter, and pagination
export const searchBrands = async (req, res) => {
  try {
    const { q, industry, minBudget, maxBudget, page = 1, limit = 20 } = req.query;
    
    // Validate pagination parameters
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.min(50, Number(limit));
    
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
    
    // Apply filters with pagination
    const docs = await BrandProfile.find(filter)
      .populate('user', ['name', 'email', 'avatar'])
      .sort('-createdAt')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();
      
    // Get total count matching the filter
    const total = await BrandProfile.countDocuments(filter);
    
    res.json({ 
      success: true,
      total, 
      page: pageNumber, 
      limit: pageSize, 
      results: docs 
    });
    
  } catch (error) {
    return sendError(res, 500, 'Error in brand search', error);
  }
};

// Get all brands (latest)
export const getAllBrands = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Validate pagination parameters
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.min(50, Number(limit));
    
    const docs = await BrandProfile.find()
      .populate('user', ['name', 'email', 'avatar'])
      .sort('-createdAt')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const total = await BrandProfile.countDocuments();

    res.json({ 
      success: true,
      total, 
      page: pageNumber, 
      limit: pageSize, 
      results: docs 
    });
  } catch (err) {
    return sendError(res, 500, 'Error fetching all brands', err);
  }
};

// Delete brand profile
export const deleteProfile = async (req, res) => {
  try {
    const profile = await BrandProfile.findOneAndRemove({ user: req.user.id });
    
    if (!profile) {
      return sendError(res, 404, 'Brand profile not found');
    }
    
    res.json({ success: true, msg: "Profile deleted" });
  } catch (err) {
    return sendError(res, 500, 'Server error', err);
  }
};