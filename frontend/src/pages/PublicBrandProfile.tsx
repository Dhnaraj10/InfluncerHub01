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
        const response = await axios.get<BrandProfile>(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/brands/${brandId}`
        );
        setBrandProfile(response.data);
      } catch (err: any) {
        console.error("Error fetching brand profile:", err);
        setError(err.response?.data?.msg || "Failed to load brand profile");
        toast.error("Failed to load brand profile");
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Brand Profile
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Back
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              {brandProfile.logoUrl ? (
                <img 
                  src={brandProfile.logoUrl} 
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
                  {brandProfile.companyName}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {brandProfile.industry}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {brandProfile.budgetPerPost && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(brandProfile.budgetPerPost)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Budget per post</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Description */}
          {brandProfile.description && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300">
                {brandProfile.description}
              </p>
            </div>
          )}
          
          {/* Contact Info */}
          <div className="mt-4 flex flex-wrap gap-4">
            {brandProfile.contactEmail && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{brandProfile.contactEmail}</span>
              </div>
            )}
            
            {brandProfile.website && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaLink className="mr-2" />
                <a 
                  href={normalizeUrl(brandProfile.website)} 
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
            {(brandProfile.socialLinks?.instagram || brandProfile.socialLinks?.twitter || brandProfile.socialLinks?.linkedin) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media</h3>
                <div className="flex flex-wrap gap-4">
                  {brandProfile.socialLinks?.instagram && (
                    <a 
                      href={normalizeUrl(brandProfile.socialLinks.instagram)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      <FaInstagram size={20} />
                      <span>Instagram</span>
                    </a>
                  )}
                  
                  {brandProfile.socialLinks?.twitter && (
                    <a 
                      href={normalizeUrl(brandProfile.socialLinks.twitter)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      <FaTwitter size={20} />
                      <span>Twitter</span>
                    </a>
                  )}
                  
                  {brandProfile.socialLinks?.linkedin && (
                    <a 
                      href={normalizeUrl(brandProfile.socialLinks.linkedin)} 
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
                  <p className="mt-1 font-medium">{brandProfile.companyName}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Industry</label>
                  <p className="mt-1 font-medium">{brandProfile.industry}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact Email</label>
                  <p className="mt-1 font-medium">{brandProfile.contactEmail}</p>
                </div>
                
                {brandProfile.budgetPerPost && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Budget per Post</label>
                    <p className="mt-1 font-medium">{formatPrice(brandProfile.budgetPerPost)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBrandProfile;