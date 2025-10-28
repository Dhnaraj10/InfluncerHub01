// backend/controllers/influencerController.js
import InfluencerProfile from "../models/InfluencerProfile.js";
import Category from "../models/Category.js";

// Create or Update influencer profile
export const createOrUpdateProfile = async (req, res) => {
  const {
    handle,
    bio,
    categories,
    location,
    followerCount,
    pricing,
    tags,
    avatarUrl,
    portfolio,
    instagram,
    youtube,
    tiktok,
    twitter,
    averageEngagementRate,
  } = req.body;

  const profileFields = { user: req.user.id };

  if (handle) profileFields.handle = handle;
  if (bio) profileFields.bio = bio;
  if (location) profileFields.location = location;
  if (followerCount) profileFields.followerCount = followerCount;
  if (pricing) profileFields.pricing = pricing;
  if (tags) profileFields.tags = tags;
  if (portfolio) profileFields.portfolio = portfolio;
  if (averageEngagementRate) profileFields.averageEngagementRate = averageEngagementRate;

  // ✅ Always include avatarUrl (empty string if removed)
  profileFields.avatarUrl = avatarUrl || "";

  // ✅ Merge socialLinks safely (don’t overwrite missing ones)
  const existingProfile = await InfluencerProfile.findOne({ user: req.user.id });
  const existingLinks = existingProfile?.socialLinks || {};

  profileFields.socialLinks = {
    instagram: instagram !== undefined ? instagram : existingLinks.instagram || "",
    youtube: youtube !== undefined ? youtube : existingLinks.youtube || "",
    tiktok: tiktok !== undefined ? tiktok : existingLinks.tiktok || "",
    twitter: twitter !== undefined ? twitter : existingLinks.twitter || "",
  };

  if (categories) {
    const catIds = [];
    for (let c of categories) {
      let cat =
        (await Category.findOne({ name: c })) ||
        (await Category.findById(c).catch(() => null));
      if (!cat) {
        cat = await Category.create({
          name: c,
          slug: c.toLowerCase().replace(/\s+/g, "-"),
        });
      }
      catIds.push(cat._id);
    }
    profileFields.categories = catIds;
  }

  try {
    // upsert profile (create if doesn't exist)
    let profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    )
      .populate("user", ["name", "email", "avatar"])
      .populate("categories", "name");

    return res.json(profile);
  } catch (err) {
    console.error("Error saving profile:", err.message);
    res.status(500).send("Server error");
  }
};

// Get current influencer's profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ user: req.user.id })
      .populate("user", ["name", "email", "avatar"])
      .populate("categories", "name");

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).send("Server error");
  }
};

// Get influencer profile by handle
export const getProfileByHandle = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ handle: req.params.handle })
      .populate("user", ["name", "email", "avatar"])
      .populate("categories", "name");

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile by handle:", err.message);
    res.status(500).send("Server error");
  }
};

// Search influencers
export const searchInfluencers = async (req, res) => {
  const {
    q,
    categories,
    minFollowers,
    maxFollowers,
    tags,
    page = 1,
    limit = 20,
    sort = "-followerCount",
  } = req.query;
  const filter = {};

  if (q) {
    filter.$or = [
      { handle: { $regex: q, $options: "i" } },
      { bio: { $regex: q, $options: "i" } },
      { tags: { $in: q.split(",") } },
    ];
  }
  if (tags) filter.tags = { $in: tags.split(",") };
  if (minFollowers) filter.followerCount = { ...filter.followerCount, $gte: Number(minFollowers) };
  if (maxFollowers) filter.followerCount = { ...filter.followerCount, $lte: Number(maxFollowers) };

  if (categories) {
    const categoryNames = categories.split(",");
    const cats = await Category.find({ name: { $in: categoryNames } });
    if (cats.length > 0) {
      filter.categories = { $in: cats.map((c) => c._id) };
    }
  }

  try {
    const skip = (page - 1) * limit;
    const docs = await InfluencerProfile.find(filter)
      .populate("user", ["name", "avatar"])
      .populate("categories", "name")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await InfluencerProfile.countDocuments(filter);

    res.json({ total, page: Number(page), limit: Number(limit), results: docs });
  } catch (err) {
    console.error("Error searching influencers:", err.message);
    res.status(500).send("Server error");
  }
};

export default {
  createOrUpdateProfile,
  getMyProfile,
  getProfileByHandle,
  searchInfluencers,
};
