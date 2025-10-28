// Backend/controllers/sponsorshipController.js
import Sponsorship from "../models/Sponsorship.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import BrandProfile from "../models/BrandProfile.js";
import { publishSponsorshipUpdate } from "../utils/websocketServer.js";

// @desc    Create a sponsorship (Brand side)
// @route   POST /api/sponsorships
// @access  Private (Brand)
export const createSponsorship = async (req, res) => {
  try {
    // Check if user is a brand
    if (req.user.role !== "brand") {
      return res.status(403).json({ message: "Only brands can create sponsorships" });
    }

    const { influencer, title, description, budget, deliverables } = req.body;

    if (!influencer || !title) {
      return res.status(400).json({ message: "influencer and title are required" });
    }

    // Check if brand has a profile
    const brandProfile = await BrandProfile.findOne({ user: req.user._id });
    if (!brandProfile) {
      return res.status(400).json({ message: "Brand profile is required to create sponsorships" });
    }

    const influencerProfile = await InfluencerProfile.findById(influencer);
    if (!influencerProfile) {
      return res.status(404).json({ message: "Influencer profile not found" });
    }

    // Create sponsorship
    const sponsorship = new Sponsorship({
      brand: brandProfile._id,
      influencer,
      title,
      description,
      budget,
      deliverables: deliverables || [],
    });

    const savedSponsorship = await sponsorship.save();

    // Populate the saved sponsorship with brand and influencer details
    await savedSponsorship.populate({
      path: "brand",
      select: "name brandProfile"
    });
    
    await savedSponsorship.populate("influencer", "handle");

    // Notify the influencer about the new sponsorship
    publishSponsorshipUpdate({
      event: "new_sponsorship",
      data: savedSponsorship,
      recipient: influencerProfile.user.toString()
    });

    res.status(201).json(savedSponsorship);
  } catch (err) {
    console.error("Error creating sponsorship");
    res.status(500).send("Server Error");
  }
};

// @desc    Get all sponsorships for the logged-in brand
// @route   GET /api/sponsorships/brand/my
// @access  Private (Brand)
export const getMyBrandSponsorships = async (req, res) => {
  try {
    // Check if user is a brand
    if (req.user.role !== "brand") {
      return res.status(403).json({ message: "Only brands can view their sponsorships" });
    }

    // Find brand profile
    const brandProfile = await BrandProfile.findOne({ user: req.user._id });
    if (!brandProfile) {
      return res.status(404).json({ message: "Brand profile not found" });
    }

    // Find all sponsorships for this brand with populated data
    const sponsorships = await Sponsorship.find({ brand: brandProfile._id })
      .populate({
        path: "brand",
        select: "name brandProfile"
      })
      .populate("influencer", "handle")
      .sort({ createdAt: -1 });

    // Transform sponsorships to ensure proper brand name is used
    const transformedSponsorships = sponsorships.map(sponsorship => {
      const sponsorshipObj = sponsorship.toObject();
      
      // Use company name from brand profile if available
      if (sponsorshipObj.brand && sponsorshipObj.brand.brandProfile && sponsorshipObj.brand.brandProfile.companyName) {
        sponsorshipObj.brand.name = sponsorshipObj.brand.brandProfile.companyName;
      }
      
      return sponsorshipObj;
    });

    res.json(transformedSponsorships);
  } catch (err) {
    console.error("Error fetching brand sponsorships");
    res.status(500).send("Server Error");
  }
};

// @desc    Get all open sponsorships (for discovery)
// @route   GET /api/sponsorships
// @access  Private (Influencer)
export const getOpenSponsorships = async (req, res) => {
  try {
    // Only influencers can view open sponsorships
    if (req.user.role !== "influencer") {
      return res.status(403).json({ message: "Only influencers can view open sponsorships" });
    }

    // Find influencer profile
    const influencerProfile = await InfluencerProfile.findOne({ user: req.user._id });
    if (!influencerProfile) {
      return res.status(404).json({ message: "Influencer profile not found" });
    }

    // Find all pending sponsorships where the influencer is the target
    const sponsorships = await Sponsorship.find({
      influencer: influencerProfile._id,
      status: "pending"
    })
      .populate({
        path: "brand",
        select: "name"
      })
      .populate("influencer", "handle")
      .sort({ createdAt: -1 });

    res.json(sponsorships);
  } catch (err) {
    console.error("Error fetching open sponsorships");
    res.status(500).send("Server Error");
  }
};

// @desc    Get all sponsorships for the logged-in influencer
// @route   GET /api/sponsorships/my
// @access  Private (Influencer)
export const getMySponsorships = async (req, res) => {
  try {
    // Check if user is an influencer
    if (req.user.role !== "influencer") {
      return res.status(403).json({ message: "Only influencers can view their sponsorships" });
    }

    // Find influencer profile
    const influencerProfile = await InfluencerProfile.findOne({ user: req.user._id });
    if (!influencerProfile) {
      return res.status(404).json({ message: "Influencer profile not found" });
    }

    // Find all sponsorships for this influencer with populated data
    const sponsorships = await Sponsorship.find({ influencer: influencerProfile._id })
      .populate({
        path: "brand",
        select: "name"
      })
      .populate("influencer", "handle")
      .sort({ createdAt: -1 });

    res.json(sponsorships);
  } catch (err) {
    console.error("Error fetching influencer sponsorships");
    res.status(500).send("Server Error");
  }
};

// @desc    Accept a sponsorship (Influencer side)
// @route   PATCH /api/sponsorships/:id/accept
// @access  Private (Influencer)
export const acceptSponsorship = async (req, res) => {
  try {
    // Check if user is an influencer
    if (req.user.role !== "influencer") {
      return res.status(403).json({ message: "Only influencers can accept sponsorships" });
    }

    // Find influencer profile
    const influencerProfile = await InfluencerProfile.findOne({ user: req.user._id });
    if (!influencerProfile) {
      return res.status(404).json({ message: "Influencer profile not found" });
    }

    // Find the sponsorship
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    // Check if this sponsorship is for the logged-in influencer
    if (sponsorship.influencer.toString() !== influencerProfile._id.toString()) {
      return res.status(403).json({ message: "Not authorized to accept this sponsorship" });
    }

    // Check if sponsorship is pending
    if (sponsorship.status !== "pending") {
      return res.status(400).json({ message: `Sponsorship is already ${sponsorship.status}` });
    }

    // Update sponsorship status
    sponsorship.status = "accepted";
    const updatedSponsorship = await sponsorship.save();

    // Populate the updated sponsorship with brand and influencer details
    await updatedSponsorship.populate({
      path: "brand",
      select: "name brandProfile"
    });
    
    await updatedSponsorship.populate("influencer", "handle");

    // Notify the brand about the accepted sponsorship
    const brandProfile = await BrandProfile.findById(sponsorship.brand);
    if (brandProfile) {
      publishSponsorshipUpdate({
        event: "sponsorship_accepted",
        data: updatedSponsorship,
        recipient: brandProfile.user.toString()
      });
    }

    res.json(updatedSponsorship);
  } catch (err) {
    console.error("Error accepting sponsorship");
    res.status(500).send("Server Error");
  }
};

// @desc    Reject a sponsorship (Influencer side)
// @route   PATCH /api/sponsorships/:id/reject
// @access  Private (Influencer)
export const rejectSponsorship = async (req, res) => {
  try {
    // Check if user is an influencer
    if (req.user.role !== "influencer") {
      return res.status(403).json({ message: "Only influencers can reject sponsorships" });
    }

    // Find influencer profile
    const influencerProfile = await InfluencerProfile.findOne({ user: req.user._id });
    if (!influencerProfile) {
      return res.status(404).json({ message: "Influencer profile not found" });
    }

    // Find the sponsorship
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    // Check if this sponsorship is for the logged-in influencer
    if (sponsorship.influencer.toString() !== influencerProfile._id.toString()) {
      return res.status(403).json({ message: "Not authorized to reject this sponsorship" });
    }

    // Check if sponsorship is pending
    if (sponsorship.status !== "pending") {
      return res.status(400).json({ message: `Sponsorship is already ${sponsorship.status}` });
    }

    // Update sponsorship status
    sponsorship.status = "rejected";
    const updatedSponsorship = await sponsorship.save();

    // Populate the updated sponsorship with brand and influencer details
    await updatedSponsorship.populate({
      path: "brand",
      select: "name brandProfile"
    });
    
    await updatedSponsorship.populate("influencer", "handle");

    // Notify the brand about the rejected sponsorship
    const brandProfile = await BrandProfile.findById(sponsorship.brand);
    if (brandProfile) {
      publishSponsorshipUpdate({
        event: "sponsorship_rejected",
        data: updatedSponsorship,
        recipient: brandProfile.user.toString()
      });
    }

    res.json(updatedSponsorship);
  } catch (err) {
    console.error("Error rejecting sponsorship");
    res.status(500).send("Server Error");
  }
};

// @desc    Cancel a sponsorship (Brand side)
// @route   PUT /api/sponsorships/:id/cancel
// @access  Private (Brand)
export const cancelSponsorship = async (req, res) => {
  try {
    // Check if user is a brand
    if (req.user.role !== "brand") {
      return res.status(403).json({ message: "Only brands can cancel sponsorships" });
    }

    // Find brand profile
    const brandProfile = await BrandProfile.findOne({ user: req.user._id });
    if (!brandProfile) {
      return res.status(404).json({ message: "Brand profile not found" });
    }

    // Find the sponsorship
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    // Check if this sponsorship is from the logged-in brand
    if (sponsorship.brand.toString() !== brandProfile._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this sponsorship" });
    }

    // Check if sponsorship is pending
    if (sponsorship.status !== "pending") {
      return res.status(400).json({ message: `Sponsorship is already ${sponsorship.status}` });
    }

    // Update sponsorship status
    sponsorship.status = "cancelled";
    const updatedSponsorship = await sponsorship.save();

    // Populate the updated sponsorship with brand and influencer details
    await updatedSponsorship.populate({
      path: "brand",
      select: "name brandProfile"
    });
    
    await updatedSponsorship.populate("influencer", "handle");

    // Notify the influencer about the cancelled sponsorship
    const influencerProfile = await InfluencerProfile.findById(sponsorship.influencer);
    if (influencerProfile) {
      publishSponsorshipUpdate({
        event: "sponsorship_cancelled",
        data: updatedSponsorship,
        recipient: influencerProfile.user.toString()
      });
    }

    res.json(updatedSponsorship);
  } catch (err) {
    console.error("Error cancelling sponsorship");
    res.status(500).send("Server Error");
  }
};

// @desc    Mark a sponsorship as completed (Brand side)
// @route   PUT /api/sponsorships/:id/complete
// @access  Private (Brand)
export const completeSponsorship = async (req, res) => {
  try {
    // Check if user is a brand
    if (req.user.role !== "brand") {
      return res.status(403).json({ message: "Only brands can complete sponsorships" });
    }

    // Find brand profile
    const brandProfile = await BrandProfile.findOne({ user: req.user._id });
    if (!brandProfile) {
      return res.status(404).json({ message: "Brand profile not found" });
    }

    // Find the sponsorship
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    // Check if this sponsorship is from the logged-in brand
    if (sponsorship.brand.toString() !== brandProfile._id.toString()) {
      return res.status(403).json({ message: "Not authorized to complete this sponsorship" });
    }

    // Check if sponsorship is accepted
    if (sponsorship.status !== "accepted") {
      return res.status(400).json({ message: `Sponsorship must be accepted before it can be completed. Current status: ${sponsorship.status}` });
    }

    // Update sponsorship status
    sponsorship.status = "completed";
    const updatedSponsorship = await sponsorship.save();

    // Populate the updated sponsorship with brand and influencer details
    await updatedSponsorship.populate({
      path: "brand",
      select: "name brandProfile"
    });
    
    await updatedSponsorship.populate("influencer", "handle");

    // Notify the influencer about the completed sponsorship
    const influencerProfile = await InfluencerProfile.findById(sponsorship.influencer);
    if (influencerProfile) {
      publishSponsorshipUpdate({
        event: "sponsorship_completed",
        data: updatedSponsorship,
        recipient: influencerProfile.user.toString()
      });
    }

    res.json(updatedSponsorship);
  } catch (err) {
    console.error("Error completing sponsorship");
    res.status(500).send("Server Error");
  }
};

// @desc    Get recent activities for a user
// @route   GET /api/sponsorships/activities
// @access  Private
export const getRecentActivities = async (req, res) => {
  try {
    // Get recent sponsorships related to the user (either as brand or influencer)
    const sponsorships = await Sponsorship.find({
      $or: [
        { brand: req.user._id },
        { influencer: req.user._id }
      ]
    })
      .populate({
        path: "brand",
        select: "name brandProfile"
      })
      .populate("influencer", "handle")
      .sort({ createdAt: -1 })
      .limit(10);

    // Transform sponsorships into activity objects
    const activities = sponsorships.map(sponsorship => {
      // Transform brand data to ensure proper name is used
      const brandData = sponsorship.brand;
      if (brandData && brandData.brandProfile && brandData.brandProfile.companyName) {
        sponsorship.brand.name = brandData.brandProfile.companyName;
      }
      
      let description = "";
      let type = "sponsorship";
      
      if (sponsorship.brand._id.toString() === req.user._id.toString()) {
        // User is the brand
        if (sponsorship.status === "pending") {
          description = `You sent a sponsorship offer to ${sponsorship.influencer.handle}`;
        } else if (sponsorship.status === "accepted") {
          description = `${sponsorship.influencer.handle} accepted your sponsorship offer`;
          type = "notification";
        } else if (sponsorship.status === "rejected") {
          description = `${sponsorship.influencer.handle} rejected your sponsorship offer`;
          type = "notification";
        } else if (sponsorship.status === "completed") {
          description = `You completed the sponsorship with ${sponsorship.influencer.handle}`;
          type = "payment";
        } else if (sponsorship.status === "cancelled") {
          description = `You cancelled the sponsorship with ${sponsorship.influencer.handle}`;
          type = "notification";
        }
      } else {
        // User is the influencer
        const brandName = sponsorship.brand.companyName || sponsorship.brand.name;
        if (sponsorship.status === "pending") {
          description = `${brandName} sent you a sponsorship offer`;
          type = "sponsorship";
        } else if (sponsorship.status === "accepted") {
          description = `You accepted a sponsorship offer from ${brandName}`;
          type = "notification";
        } else if (sponsorship.status === "rejected") {
          description = `You rejected a sponsorship offer from ${brandName}`;
          type = "notification";
        } else if (sponsorship.status === "completed") {
          description = `${brandName} completed your sponsorship`;
          type = "payment";
        } else if (sponsorship.status === "cancelled") {
          description = `${brandName} cancelled the sponsorship`;
          type = "notification";
        }
      }

      // Format the timestamp
      const timeDiff = Math.floor((new Date().getTime() - new Date(sponsorship.createdAt).getTime()) / (1000 * 60));
      let timestamp = "";
      if (timeDiff < 60) {
        timestamp = `${timeDiff} minutes ago`;
      } else if (timeDiff < 1440) {
        timestamp = `${Math.floor(timeDiff / 60)} hours ago`;
      } else {
        timestamp = `${Math.floor(timeDiff / 1440)} days ago`;
      }

      return {
        id: sponsorship._id,
        description,
        timestamp,
        type,
        actionUrl: "/sponsorships"
      };
    });

    res.json(activities);
  } catch (err) {
    console.error("Error fetching recent activities");
    res.status(500).send("Server Error");
  }
};