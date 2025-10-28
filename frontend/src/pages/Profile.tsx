// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../useAuth";
import toast from "react-hot-toast";
import { FaInstagram, FaYoutube, FaTwitter, FaLink, FaMapMarkerAlt, FaTiktok } from 'react-icons/fa';

const renderIcon = (IconComponent: React.ComponentType<any>, props: any) => {
  return <IconComponent {...props} />;
};

interface ProfileFormValues {
  handle: string;
  bio: string;
  categories: string[];
  followerCount: number;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
  other?: string;
  location?: string;
  avatarUrl?: string;
  portfolio?: string[];
  tags?: string[];
  averageEngagementRate?: number; // Added engagement rate
  pricing?: {
    post?: number;
    reel?: number;
    story?: number;
  };
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: { categories: [], portfolio: [], tags: [], pricing: {} },
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialProfileData, setInitialProfileData] = useState<ProfileFormValues | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  // Lightbox state for portfolio
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeImage = () => setSelectedIndex(null);
  const prevImage = () => {
    const portfolio = getValues("portfolio") || [];
    if (selectedIndex !== null && portfolio.length > 0) {
      setSelectedIndex((selectedIndex - 1 + portfolio.length) % portfolio.length);
    }
  };
  const nextImage = () => {
    const portfolio = getValues("portfolio") || [];
    if (selectedIndex !== null && portfolio.length > 0) {
      setSelectedIndex((selectedIndex + 1) % portfolio.length);
    }
  };

  // Helper to format price with currency
  const currencySymbol = () => {
    return "₹"; // Always INR
  };
  const formatPrice = (value?: number) => {
    if (value === undefined || value === null) return null;
    // show integer or two decimals if fractional
    const v = Number(value);
    const formatted = Number.isInteger(v) ? v.toString() : v.toFixed(2);
    return `${currencySymbol()}${formatted}`;
  };

  // Fetch current influencer profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
      navigate('/login');
      return;
    }
      try {
        const res = await fetch("http://localhost:5000/api/influencers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          setIsEditMode(true);
          setProfileExists(false);
          return;
        }
        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        // backend returns fields as in model; map for form defaults
        const profileData: ProfileFormValues = {
          handle: data.handle || "",
          bio: data.bio || "",
          categories: data.categories?.map((cat: any) => {
            // If cat is an object with a name, return the name
            if (typeof cat === 'object' && cat.name) {
              return cat.name;
            }
            // If cat is an object with _id, return the _id
            if (typeof cat === 'object' && cat._id) {
              return cat._id;
            }
            // Otherwise, return cat as is (assuming it's a string)
            return cat;
          }) || [],
          followerCount: data.followerCount || 0,
          instagram: data.socialLinks?.instagram || "",
          youtube: data.socialLinks?.youtube || "",
          twitter: data.socialLinks?.twitter || "",
          tiktok: data.socialLinks?.tiktok || "",
          other: data.socialLinks?.other || "",
          location: data.location || "",
          avatarUrl: data.avatarUrl || "",
          portfolio: data.portfolio || [],
          tags: data.tags || [],
          averageEngagementRate: data.averageEngagementRate || 0,
          pricing: {
            post: data.pricing?.post,
            reel: data.pricing?.reel,
            story: data.pricing?.story,
          },
        };

        reset(profileData);
        setInitialProfileData(profileData);
        setIsEditMode(false);
        setProfileExists(true);
        setAvatarPreview(data.avatarUrl || null);
      } catch (err: any) {
        toast.error(err.message || "Could not fetch profile");
      }
    };

    fetchProfile();
  }, [token, reset]);

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.msg || `Failed to upload avatar: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setValue("avatarUrl", data.url);
      setAvatarPreview(data.url);
      toast.success("Avatar uploaded successfully!");
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      toast.error(err.message || "Could not upload avatar");
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  // Handle portfolio upload
  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const urls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.msg || `Failed to upload image ${i + 1}: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        urls.push(data.url);
      }

      const currentPortfolio = getValues("portfolio") || [];
      setValue("portfolio", [...currentPortfolio, ...urls]);
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (err: any) {
      console.error("Portfolio upload error:", err);
      toast.error(err.message || "Could not upload portfolio images");
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  // Remove image from portfolio
  const removeImage = (index: number) => {
    const currentPortfolio = getValues("portfolio") || [];
    const newPortfolio = currentPortfolio.filter((_, i) => i !== index);
    setValue("portfolio", newPortfolio);
  };

  // Add category
  const addCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed) {
      const currentCategories = getValues("categories") || [];
      if (!currentCategories.includes(trimmed)) {
        setValue("categories", [...currentCategories, trimmed]);
        setCategoryInput("");
      }
    }
  };

  // Remove category
  const removeCategory = (categoryToRemove: string) => {
    const currentCategories = getValues("categories") || [];
    setValue("categories", currentCategories.filter((cat) => cat !== categoryToRemove));
  };

  // Add tag
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed) {
      const currentTags = getValues("tags") || [];
      if (!currentTags.includes(trimmed)) {
        setValue("tags", [...currentTags, trimmed]);
        setTagInput("");
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    const currentTags = getValues("tags") || [];
    setValue("tags", currentTags.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Prepare social links object
      const socialLinks = {
        instagram: data.instagram,
        youtube: data.youtube,
        twitter: data.twitter,
        tiktok: data.tiktok,
        other: data.other,
      };

      // Remove individual social fields from data
      const { instagram, youtube, twitter, tiktok, other, ...rest } = data;

      const profileData = {
        ...rest,
        socialLinks,
      };

      const url = profileExists
        ? "http://localhost:5000/api/influencers/me"
        : "http://localhost:5000/api/influencers/me";

      const method = profileExists ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      toast.success("Profile saved successfully!");
      setIsEditMode(false);
    } catch (err: any) {
      toast.error(err.message || "Could not save profile");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (initialProfileData) {
      reset(initialProfileData);
      setAvatarPreview(initialProfileData.avatarUrl || null);
    }
    setIsEditMode(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      const res = await fetch("http://localhost:5000/api/influencers/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete profile");
      toast.success("Profile deleted successfully!");
      reset({
        handle: "",
        bio: "",
        categories: [],
        followerCount: 0,
        instagram: "",
        youtube: "",
        twitter: "",
        tiktok: "",
        other: "",
        location: "",
        avatarUrl: "",
        portfolio: [],
        tags: [],
        averageEngagementRate: 0,
        pricing: {},
      });
      setAvatarPreview(null);
      setIsEditMode(true);
      setProfileExists(false);
    } catch (err: any) {
      toast.error(err.message || "Could not delete profile");
    }
  };

  // Render a profile value if it exists
  const renderProfileValue = (label: string, value: any) => {
    if (!value) return null;
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{label}</label>
        <div className="mt-1">{value}</div>
      </div>
    );
  };

  // Format follower count
  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Influencer Profile</h1>
          {!isEditMode && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete Profile
              </button>
            </div>
          )}
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={avatarPreview || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer">
                  +
                </label>
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Picture</h2>
                <p className="text-gray-600 dark:text-gray-400">Upload a clear photo of yourself</p>
              </div>
            </div>

            {/* Handle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Handle *</label>
              <input {...register("handle", { required: "Handle is required" })} className="input" />
              {errors.handle && <p className="text-red-500 text-sm mt-1">{errors.handle.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
              <textarea {...register("bio")} rows={3} className="input" />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</label>
              <div className="flex flex-wrap items-center w-full px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50/70 dark:bg-gray-700/70">
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <>
                      {field.value?.map((category, index) => (
                        <div key={index} className="flex items-center bg-primary/20 text-primary-dark dark:text-primary-light text-sm font-medium mr-2 mb-1 px-2 py-1 rounded-full">
                          <span>{category}</span>
                          <button type="button" onClick={() => removeCategory(category)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
                        </div>
                      ))}
                      <div className="flex-grow flex items-center">
                        <input
                          type="text"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                          className="flex-grow bg-transparent outline-none"
                          placeholder="Add categories..."
                        />
                        <button type="button" onClick={addCategory} className="btn-primary text-sm py-1 ml-2">Add</button>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Follower Count</label>
                <input
                  type="number"
                  {...register("followerCount", { valueAsNumber: true, min: 0 })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Avg. Engagement Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("averageEngagementRate", { valueAsNumber: true, min: 0 })}
                  className="input"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  {...register("location")}
                  className="input pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Social links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Social Links</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input {...register("instagram")} placeholder="Instagram URL" className="input" />
                <input {...register("youtube")} placeholder="YouTube URL" className="input" />
                <input {...register("twitter")} placeholder="Twitter URL" className="input" />
                <input {...register("tiktok")} placeholder="TikTok URL" className="input" />
                <input {...register("other")} placeholder="Other Link" className="input" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap items-center w-full px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50/70 dark:bg-gray-700/70">
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <>
                      {field.value?.map((tag, index) => (
                        <div key={index} className="flex items-center bg-primary/20 text-primary-dark dark:text-primary-light text-sm font-medium mr-2 mb-1 px-2 py-1 rounded-full">
                          <span>{tag}</span>
                          <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
                        </div>
                      ))}
                      <div className="flex-grow flex items-center">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                          className="flex-grow bg-transparent outline-none"
                          placeholder="Add tags..."
                        />
                        <button type="button" onClick={addTag} className="btn-primary text-sm py-1 ml-2">Add</button>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricing (INR)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Post</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      ₹
                    </div>
                    <input
                      type="number"
                      {...register("pricing.post", { valueAsNumber: true, min: 0 })}
                      className="input pl-8"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Reel</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      ₹
                    </div>
                    <input
                      type="number"
                      {...register("pricing.reel", { valueAsNumber: true, min: 0 })}
                      className="input pl-8"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Story</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      ₹
                    </div>
                    <input
                      type="number"
                      {...register("pricing.story", { valueAsNumber: true, min: 0 })}
                      className="input pl-8"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input type="file" multiple accept="image/*" className="hidden" id="portfolio-upload" onChange={handlePortfolioUpload} />
                <label htmlFor="portfolio-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FaLink className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Click to upload portfolio images</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </label>
              </div>
              {uploading && <p className="text-gray-500 dark:text-gray-400 mt-2">Uploading...</p>}
              
              {/* Portfolio Preview */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(getValues("portfolio") || []).map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form buttons */}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleCancel} className="btn-outline">Cancel</button>
              <button type="submit" className="btn-primary">Save Profile</button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={getValues("avatarUrl") || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">@{getValues("handle")}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{getValues("bio")}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatFollowerCount(getValues("followerCount") || 0)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getValues("averageEngagementRate") ? `${getValues("averageEngagementRate")}%` : "N/A"}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Engagement</div>
                  </div>
                </div>
              </div>
              
              {/* Location */}
              {getValues("location") && (
                <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{getValues("location")}</span>
                </div>
              )}
              
              {/* Categories */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(getValues("categories") || []).map((categoryId, index) => {
                  // Try to find the category name from the initial data or use the categoryId as fallback
                  let categoryName = categoryId;
                  if (initialProfileData?.categories) {
                    // Find category by matching the ID
                    const matchedCategory: any = initialProfileData.categories.find((cat: any) => {
                      // If cat is an object with _id, compare with that
                      if (typeof cat === 'object' && cat._id) {
                        return cat._id === categoryId;
                      }
                      // If cat is just an ID string, compare directly
                      return cat === categoryId;
                    });
                    
                    // If we found a match and it's an object, use its name, otherwise use the categoryId
                    if (matchedCategory) {
                      categoryName = typeof matchedCategory === 'object' ? (matchedCategory.name || matchedCategory._id) : matchedCategory;
                    }
                  }
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {categoryName}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Social Links */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media</h3>
                  <div className="flex flex-wrap gap-4">
                    {getValues("instagram") && (
                      <a href={getValues("instagram")} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                        <FaInstagram size={20} />
                        <span>Instagram</span>
                      </a>
                    )}
                    {getValues("youtube") && (
                      <a href={getValues("youtube")} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                        <FaYoutube size={20} />
                        <span>YouTube</span>
                      </a>
                    )}
                    {getValues("twitter") && (
                      <a href={getValues("twitter")} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                        <FaTwitter size={20} />
                        <span>Twitter</span>
                      </a>
                    )}
                    {getValues("tiktok") && (
                      <a href={getValues("tiktok")} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 bg-gradient-to-r from-black to-gray-800 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                        <FaTiktok size={20} />
                        <span>TikTok</span>
                      </a>
                    )}
                    {getValues("other") && (
                      <a href={getValues("other")} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                        <FaLink size={20} />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Portfolio */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio</h3>
                  {(getValues("portfolio") || []).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {(getValues("portfolio") || []).map((url, index) => (
                        <div 
                          key={index} 
                          className="relative cursor-pointer group"
                          onClick={() => setSelectedIndex(index)}
                        >
                          <img
                            src={url}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-white font-bold">View</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No portfolio items added yet.</p>
                  )}
                </div>
              </div>

              {/* Right column - Additional info */}
              <div className="space-y-6">
                {/* Pricing */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing (INR)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-300">Post</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getValues("pricing")?.post !== undefined ? formatPrice(getValues("pricing")?.post) : <span className="text-gray-400">Not set</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-300">Reel</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getValues("pricing")?.reel !== undefined ? formatPrice(getValues("pricing")?.reel) : <span className="text-gray-400">Not set</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Story</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getValues("pricing")?.story !== undefined ? formatPrice(getValues("pricing")?.story) : <span className="text-gray-400">Not set</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                  {(getValues("tags") || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(getValues("tags") || []).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No tags added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox for portfolio images */}
        {selectedIndex !== null && (getValues("portfolio") || []).length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeImage}>
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 text-white text-3xl z-10"
                onClick={closeImage}
              >
                &times;
              </button>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                &lsaquo;
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
              >
                &rsaquo;
              </button>
              <img
                src={(getValues("portfolio") || [])[selectedIndex]}
                alt={`Portfolio ${selectedIndex + 1}`}
                className="max-h-[90vh] max-w-full object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {selectedIndex + 1} / {(getValues("portfolio") || []).length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;