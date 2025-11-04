// frontend/src/components/BrandCard.tsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../AuthContext";
import { FaInstagram, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';
import { BrandProfile } from "../types/types";

interface BrandCardProps {
  brand: BrandProfile;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const context = useContext(AuthContext);
  
  // Check if context is available
  if (!context) {
    throw new Error('BrandCard must be used within an AuthProvider');
  }
  
  const { user } = context;
  
  // Use the user ID from the brand profile for the link
  const brandProfileId = brand.user?._id || brand._id;

  // Format price with currency
  const formatPrice = (value?: number) => {
    if (value === undefined || value === null) return "N/A";
    // show integer or two decimals if fractional
    const v = Number(value);
    const formatted = Number.isInteger(v) ? v.toString() : v.toFixed(2);
    return `₹${formatted}`;
  };

  // Normalize URL by adding protocol if missing
  const normalizeUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Add https:// protocol if missing
    return `https://${url}`;
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {brand.logoUrl ? (
            <img 
              src={brand.logoUrl} 
              alt={brand.companyName} 
              className="w-16 h-16 rounded-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/100";
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
              {brand.companyName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {brand.industry}
            </p>
            <div className="mt-1 text-sm font-medium text-primary dark:text-primary-light">
              {formatPrice(brand.budgetPerPost)}/post
            </div>
          </div>
        </div>

        {/* Description */}
        {brand.description && (
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {brand.description}
          </p>
        )}

        {/* Social Links */}
        {(brand.socialLinks?.instagram || brand.socialLinks?.twitter || brand.socialLinks?.linkedin || brand.website) && (
          <div className="flex gap-2 mt-4">
            {brand.socialLinks?.instagram && (
              <a 
                href={normalizeUrl(brand.socialLinks.instagram)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            )}
            
            {brand.socialLinks?.twitter && (
              <a 
                href={normalizeUrl(brand.socialLinks.twitter)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            )}
            
            {brand.socialLinks?.linkedin && (
              <a 
                href={normalizeUrl(brand.socialLinks.linkedin)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            )}
            
            {brand.website && (
              <a 
                href={normalizeUrl(brand.website)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                <FaLink className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/brand/${brandProfileId}`}
            className="flex-1 btn-primary text-center py-2 rounded-lg font-medium transition-all duration-200"
          >
            View Profile
          </Link>
          
          {user?.role === "influencer" && (
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium text-center hover:opacity-90 transition shadow-lg">
              Contact
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandCard;