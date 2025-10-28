// frontend/src/pages/BrandProfile.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

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

  // Fetch current brand profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || user?.role !== "brand") return;
      try {
        const res = await fetch("http://localhost:5000/api/brands/me", {
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
      const res = await fetch("http://localhost:5000/api/upload", {
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
    }
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
      const method = profileExists ? "PUT" : "POST";
      const res = await fetch("http://localhost:5000/api/brands/me", {
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
      <div className="max-w-4xl mx-auto px-4 py-8">
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {profileExists ? "Brand Profile" : "Create Brand Profile"}
          </h1>
          {!isEditMode && profileExists && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditMode || !profileExists ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="mb-4">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-32 h-32 object-contain rounded-lg border-2 border-dashed border-gray-300"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <input
                type="hidden"
                {...register("logoUrl")}
              />
              
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
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Logo"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  {...register("companyName", { required: "Company name is required" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <input
                  type="number"
                  id="budgetPerPost"
                  {...register("budgetPerPost", { valueAsNumber: true, min: 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10000"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          // View mode
          <div className="space-y-6">
            {logoPreview && (
              <div className="flex justify-center">
                <img 
                  src={logoPreview} 
                  alt="Company logo" 
                  className="w-32 h-32 object-contain rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</h3>
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                  {initialProfileData?.companyName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</h3>
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                  {initialProfileData?.industry}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Email</h3>
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                  {initialProfileData?.contactEmail}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Per Post</h3>
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                  {initialProfileData?.budgetPerPost ? `₹${initialProfileData.budgetPerPost.toLocaleString()}` : 'Not specified'}
                </p>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                  {initialProfileData?.description || 'No description provided'}
                </p>
              </div>

              {initialProfileData?.website && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h3>
                  <a 
                    href={normalizeUrl(initialProfileData.website)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-lg font-medium text-primary hover:underline"
                  >
                    {initialProfileData.website}
                  </a>
                </div>
              )}
            </div>

            {(initialProfileData?.socialLinks.instagram || initialProfileData?.socialLinks.twitter || initialProfileData?.socialLinks.linkedin) && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h3>
                
                <div className="flex space-x-4">
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
        )}
      </div>
    </div>
  );
};

export default BrandProfile;