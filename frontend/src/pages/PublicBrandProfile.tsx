// frontend/src/pages/PublicBrandProfile.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BrandProfile } from "../types/types";
import { FaInstagram, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const PublicBrandProfile: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchBrandProfile = async () => {
      if (!brandId) {
        setError("No brand ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; profile: BrandProfile }>(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/brands/${brandId}`
        );
        
        if (response.data.success) {
          setBrandProfile(response.data.profile);
        } else {
          setError("Failed to load brand profile");
          toast.error("Failed to load brand profile");
        }
      } catch (err: any) {
        console.error("Error fetching brand profile:", err);
        const errorMessage = err.response?.data?.msg || err.message || "Failed to load brand profile";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProfile();
  }, [brandId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Error</h1>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!brandProfile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Brand Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">The brand profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-r from-primary to-secondary">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-6 left-6 flex items-end gap-6">
            {brandProfile.logoUrl ? (
              <img 
                src={brandProfile.logoUrl} 
                alt={brandProfile.companyName} 
                className="w-24 h-24 rounded-full border-4 border-white object-contain bg-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/100";
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-white">{brandProfile.companyName}</h1>
              <p className="text-xl text-white/90">{brandProfile.industry}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {brandProfile.description || "No description provided."}
                </p>
              </div>

              {/* Social Links */}
              {(brandProfile.socialLinks?.instagram || 
                brandProfile.socialLinks?.twitter || 
                brandProfile.socialLinks?.linkedin || 
                brandProfile.website) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect</h2>
                  <div className="flex flex-wrap gap-4">
                    {brandProfile.socialLinks?.instagram && (
                      <a 
                        href={normalizeUrl(brandProfile.socialLinks.instagram)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                      >
                        <FaInstagram className="h-5 w-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    
                    {brandProfile.socialLinks?.twitter && (
                      <a 
                        href={normalizeUrl(brandProfile.socialLinks.twitter)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                      >
                        <FaTwitter className="h-5 w-5" />
                        <span>Twitter</span>
                      </a>
                    )}
                    
                    {brandProfile.socialLinks?.linkedin && (
                      <a 
                        href={normalizeUrl(brandProfile.socialLinks.linkedin)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                      >
                        <FaLinkedin className="h-5 w-5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    
                    {brandProfile.website && (
                      <a 
                        href={normalizeUrl(brandProfile.website)} 
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

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Brand Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Email</h3>
                    <p className="text-gray-900 dark:text-white">{brandProfile.contactEmail}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget per Post</h3>
                    <p className="text-2xl font-bold text-primary">
                      {brandProfile.budgetPerPost ? formatPrice(brandProfile.budgetPerPost) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBrandProfile;