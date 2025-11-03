// frontend/src/pages/BrandProfile.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaInstagram, FaTwitter, FaLinkedin, FaLink, FaMapMarkerAlt } from 'react-icons/fa';

interface BrandProfileData {
  companyName: string;
  industry: string;
  description: string;
  logoUrl: string;
  website: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  budgetPerPost: number;
  contactEmail: string;
}

const BrandProfile: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [initialProfileData, setInitialProfileData] = useState<BrandProfileData | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BrandProfileData>();

  // Normalize URL by adding protocol if missing
  const normalizeUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Add https:// protocol if missing
    return `https://${url}`;
  };

  // Format price with currency
  const formatPrice = (value?: number) => {
    if (value === undefined || value === null) return null;
    // show integer or two decimals if fractional
    const v = Number(value);
    const formatted = Number.isInteger(v) ? v.toString() : v.toFixed(2);
    return `₹${formatted}`;
  };

  // Fetch current brand profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || user?.role !== "brand") return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/brands/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          setIsEditMode(true);
          setProfileExists(false);
          return;
        }
        if (!res.ok) throw new Error("Failed to load profile");

        const profileData = await res.json();
        setInitialProfileData(profileData);
        reset(profileData);
        setLogoPreview(profileData.logoUrl || null);
        setProfileExists(true);
        setIsEditMode(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user?.role, reset]);

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload logo");

      const data = await res.json();
      setValue("logoUrl", data.url);
      setLogoPreview(data.url);
      toast.success("Logo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Could not upload logo");
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be uploaded again if needed
      if (e.target.value) {
        e.target.value = '';
      }
    }
  };

  // Remove logo
  const removeLogo = () => {
    setLogoPreview(null);
    setValue("logoUrl", "");
  };

  // Handle form submission
  const onSubmit = async (data: BrandProfileData) => {
    // Normalize URLs
    const normalizedData = {
      ...data,
      website: normalizeUrl(data.website),
      socialLinks: {
        instagram: normalizeUrl(data.socialLinks.instagram),
        twitter: normalizeUrl(data.socialLinks.twitter),
        linkedin: normalizeUrl(data.socialLinks.linkedin),
      }
    };

    try {
      const url = profileExists 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/brands/me` 
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/brands`;
      
      const method = profileExists ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(normalizedData),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const profileResponse = await res.json();
      setInitialProfileData(profileResponse);
      reset(profileResponse);
      setLogoPreview(profileResponse.logoUrl || null);
      setProfileExists(true);
      setIsEditMode(false);
      toast.success("Profile saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (initialProfileData) {
      reset(initialProfileData);
      setLogoPreview(initialProfileData.logoUrl || null);
    }
    setIsEditMode(false);
  };

  if (user?.role !== "brand") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Only brand users can access this page. Your current role is: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {profileExists ? "Brand Profile" : "Create Brand Profile"}
          </h1>
          {!isEditMode && profileExists && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditMode || !profileExists ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-32 h-32 object-contain rounded-full border-2 border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Logo"}
                </button>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  {...register("companyName", { required: "Company name is required" })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your company name"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry *
                </label>
                <input
                  id="industry"
                  {...register("industry", { required: "Industry is required" })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your industry"
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  {...register("contactEmail", { 
                    required: "Contact email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contact@company.com"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="budgetPerPost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Per Post (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    ₹
                  </div>
                  <input
                    type="number"
                    id="budgetPerPost"
                    {...register("budgetPerPost", { valueAsNumber: true, min: 0 })}
                    className="w-full px-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell us about your company..."
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  {...register("website")}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="www.yourcompany.com"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    {...register("socialLinks.instagram")}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="instagram.com/yourcompany"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    {...register("socialLinks.twitter")}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="twitter.com/yourcompany"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    {...register("socialLinks.linkedin")}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              {profileExists && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          // View mode
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center space-x-4">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company logo" 
                      className="w-16 h-16 object-contain rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {initialProfileData?.companyName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      {initialProfileData?.industry}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {initialProfileData?.budgetPerPost && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(initialProfileData.budgetPerPost)}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Budget per post</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Description */}
              {initialProfileData?.description && (
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {initialProfileData.description}
                  </p>
                </div>
              )}
              
              {/* Contact Info */}
              <div className="mt-4 flex flex-wrap gap-4">
                {initialProfileData?.contactEmail && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{initialProfileData.contactEmail}</span>
                  </div>
                )}
                
                {initialProfileData?.website && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FaLink className="mr-2" />
                    <a 
                      href={normalizeUrl(initialProfileData.website)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Social Links */}
                {(initialProfileData?.socialLinks.instagram || initialProfileData?.socialLinks.twitter || initialProfileData?.socialLinks.linkedin) && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media</h3>
                    <div className="flex flex-wrap gap-4">
                      {initialProfileData?.socialLinks.instagram && (
                        <a 
                          href={normalizeUrl(initialProfileData.socialLinks.instagram)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                        >
                          <FaInstagram size={20} />
                          <span>Instagram</span>
                        </a>
                      )}
                      
                      {initialProfileData?.socialLinks.twitter && (
                        <a 
                          href={normalizeUrl(initialProfileData.socialLinks.twitter)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                        >
                          <FaTwitter size={20} />
                          <span>Twitter</span>
                        </a>
                      )}
                      
                      {initialProfileData?.socialLinks.linkedin && (
                        <a 
                          href={normalizeUrl(initialProfileData.socialLinks.linkedin)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                        >
                          <FaLinkedin size={20} />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - Additional info */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Company</label>
                      <p className="mt-1 font-medium">{initialProfileData?.companyName}</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Industry</label>
                      <p className="mt-1 font-medium">{initialProfileData?.industry}</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact Email</label>
                      <p className="mt-1 font-medium">{initialProfileData?.contactEmail}</p>
                    </div>
                    
                    {initialProfileData?.budgetPerPost && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Budget per Post</label>
                        <p className="mt-1 font-medium">{formatPrice(initialProfileData.budgetPerPost)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProfile;