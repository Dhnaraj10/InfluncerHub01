// frontend/src/pages/BrandProfile.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaInstagram, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';

interface BrandProfileData {
  companyName: string;
  industry: string;
  description: string;
  logoUrl: string;
  website: string;
  contactEmail: string;
  budgetPerPost: number;
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
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
    if (value === undefined || value === null) return "N/A";
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
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        const profileData = data.profile || data; // Handle both response formats
        
        const formattedProfileData: BrandProfileData = {
          companyName: profileData.companyName || "",
          industry: profileData.industry || "",
          description: profileData.description || "",
          logoUrl: profileData.logoUrl || "",
          website: profileData.website || "",
          contactEmail: profileData.contactEmail || "",
          budgetPerPost: profileData.budgetPerPost || 0,
          socialLinks: {
            instagram: profileData.socialLinks?.instagram || "",
            twitter: profileData.socialLinks?.twitter || "",
            linkedin: profileData.socialLinks?.linkedin || "",
          }
        };

        setInitialProfileData(formattedProfileData);
        reset(formattedProfileData);
        setLogoPreview(formattedProfileData.logoUrl || null);
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
    formData.append("image", file);

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
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/brands/me`;
      
      const method = profileExists ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(normalizedData),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save profile: ${res.status} ${res.statusText}. ${errorText}`);
      }

      const profileResponse = await res.json();
      const profileData = profileResponse.profile || profileResponse;
      
      const formattedProfileData: BrandProfileData = {
        companyName: profileData.companyName || "",
        industry: profileData.industry || "",
        description: profileData.description || "",
        logoUrl: profileData.logoUrl || "",
        website: profileData.website || "",
        contactEmail: profileData.contactEmail || "",
        budgetPerPost: profileData.budgetPerPost || 0,
        socialLinks: {
          instagram: profileData.socialLinks?.instagram || "",
          twitter: profileData.socialLinks?.twitter || "",
          linkedin: profileData.socialLinks?.linkedin || "",
        }
      };

      setInitialProfileData(formattedProfileData);
      reset(formattedProfileData);
      setLogoPreview(formattedProfileData.logoUrl || null);
      setProfileExists(true);
      setIsEditMode(false);
      toast.success("Profile saved successfully");
      
      // Navigate to the public brand profile page after saving
      if (user?._id) {
        navigate(`/brand/${user._id}`);
      }
    } catch (err: any) {
      console.error('Profile save error:', err);
      toast.error(err.message || "Failed to save profile");
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
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-primary to-secondary">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Logo" 
                    className="w-32 h-32 rounded-full border-4 border-white object-contain bg-white"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/100";
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                {isEditMode && (
                  <label className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary-dark transition">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-8 pb-8">
            {!isEditMode && profileExists ? (
              // View Mode
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{initialProfileData?.companyName}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{initialProfileData?.industry}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="btn-primary px-6 py-2 rounded-lg font-medium"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    {/* Description */}
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">About</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {initialProfileData?.description || "No description provided."}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contact Email</div>
                        <div className="text-gray-900 dark:text-white">
                          {initialProfileData?.contactEmail || "N/A"}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Budget per Post</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(initialProfileData?.budgetPerPost)}
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    {(initialProfileData?.socialLinks?.instagram || initialProfileData?.socialLinks?.twitter || initialProfileData?.socialLinks?.linkedin || initialProfileData?.website) && (
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Social Media</h2>
                        <div className="flex flex-wrap gap-3">
                          {initialProfileData?.socialLinks?.instagram && (
                            <a 
                              href={normalizeUrl(initialProfileData.socialLinks.instagram)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                            >
                              <FaInstagram className="h-5 w-5" />
                              <span>Instagram</span>
                            </a>
                          )}
                          {initialProfileData?.socialLinks?.twitter && (
                            <a 
                              href={normalizeUrl(initialProfileData.socialLinks.twitter)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                            >
                              <FaTwitter className="h-5 w-5" />
                              <span>Twitter</span>
                            </a>
                          )}
                          {initialProfileData?.socialLinks?.linkedin && (
                            <a 
                              href={normalizeUrl(initialProfileData.socialLinks.linkedin)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                            >
                              <FaLinkedin className="h-5 w-5" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {initialProfileData?.website && (
                            <a 
                              href={normalizeUrl(initialProfileData.website)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                            >
                              <FaLink className="h-5 w-5" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Company</h3>
                          <p className="text-gray-900 dark:text-white">{initialProfileData?.companyName || "N/A"}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</h3>
                          <p className="text-gray-900 dark:text-white">{initialProfileData?.industry || "N/A"}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</h3>
                          <p className="text-gray-900 dark:text-white">{initialProfileData?.contactEmail || "N/A"}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Budget per Post</h3>
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(initialProfileData?.budgetPerPost)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {profileExists ? "Edit Brand Profile" : "Create Brand Profile"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      {profileExists ? "Update your brand information" : "Set up your brand profile"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {profileExists && (
                      <button 
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="btn-primary px-6 py-2 rounded-lg font-medium"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
                          <input 
                            {...register("companyName", { required: "Company name is required" })} 
                            placeholder="Your company name" 
                            className="input"
                          />
                          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry *</label>
                          <input 
                            {...register("industry", { required: "Industry is required" })} 
                            placeholder="Your industry" 
                            className="input"
                          />
                          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                          <textarea 
                            {...register("description")} 
                            placeholder="Tell us about your brand..." 
                            rows={4}
                            className="input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Email *</label>
                          <input 
                            type="email"
                            {...register("contactEmail", { required: "Contact email is required" })} 
                            placeholder="contact@yourcompany.com" 
                            className="input"
                          />
                          {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pricing</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget per Post (INR)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                              ₹
                            </div>
                            <input
                              type="number"
                              {...register("budgetPerPost", { valueAsNumber: true, min: 0 })}
                              className="input pl-8"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Website</h2>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <FaLink className="h-5 w-5" />
                          </div>
                          <input 
                            {...register("website")} 
                            placeholder="yourcompany.com" 
                            className="input pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Social Links</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                              <FaInstagram className="h-5 w-5" />
                            </div>
                            <input 
                              {...register("socialLinks.instagram")} 
                              placeholder="instagram.com/yourcompany" 
                              className="input pl-10"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                              <FaTwitter className="h-5 w-5" />
                            </div>
                            <input 
                              {...register("socialLinks.twitter")} 
                              placeholder="twitter.com/yourcompany" 
                              className="input pl-10"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                              <FaLinkedin className="h-5 w-5" />
                            </div>
                            <input 
                              {...register("socialLinks.linkedin")} 
                              placeholder="linkedin.com/company/yourcompany" 
                              className="input pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 sticky top-8">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preview</h2>
                      
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Logo</h3>
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo Preview" 
                            className="w-24 h-24 rounded-full object-contain mx-auto bg-white"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/100";
                            }}
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 mx-auto flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                        <div className="mt-2 text-center">
                          <label className="text-sm text-primary hover:underline cursor-pointer">
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleLogoUpload}
                              disabled={uploading}
                            />
                            Change Logo
                          </label>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Company</h3>
                          <p className="text-gray-900 dark:text-white">
                            {initialProfileData?.companyName || "Your company name"}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</h3>
                          <p className="text-gray-900 dark:text-white">
                            {initialProfileData?.industry || "Your industry"}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                            {initialProfileData?.description || "Tell us about your brand..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;