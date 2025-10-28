// frontend/src/components/InfluencerCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface InfluencerCardProps {
  id: string;
  name: string;
  followers: number;
  engagementRate: number;
  imageUrl: string;
  categories?: string[];
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({
  id,
  name,
  followers,
  engagementRate,
  imageUrl,
  categories = [],
}) => {
  const formatFollowers = (count: number): string => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="card hover-lift group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-transform duration-300">
      {/* Cover Image */}
      <div className="overflow-hidden aspect-video relative rounded-t-xl">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imageUrl}
          alt={name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {formatFollowers(followers)}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {engagementRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map((category, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-primary-light/20 text-primary-dark rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/influencer/${id}`}
          className="btn-primary w-full mt-4 hover:shadow-glow transition-all duration-300"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default InfluencerCard;
