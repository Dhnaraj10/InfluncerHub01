// frontend/src/pages/InfluencerPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InfluencerProfile } from "../types/types";
import { useAuth } from "../useAuth";
import toast from "react-hot-toast";
import SponsorshipModal from "../components/SponsorshipModal";

const normalizeUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const InfluencerPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { user, token } = useAuth();

  const [influencer, setInfluencer] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Portfolio lightbox
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/influencers/handle/${handle}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!res.ok) throw new Error("Failed to fetch influencer");
        const data = await res.json();
        setInfluencer(data.data || data);
      } catch (err: any) {
        toast.error(err.message || "Error fetching influencer profile");
      } finally {
        setLoading(false);
      }
    };

    if (handle) fetchInfluencer();
  }, [handle, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Influencer not found
      </div>
    );
  }

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);
  const prevImage = () => {
    if (influencer?.portfolio && selectedIndex !== null) {
      setSelectedIndex(
        (selectedIndex - 1 + influencer.portfolio.length) %
          influencer.portfolio.length
      );
    }
  };
  const nextImage = () => {
    if (influencer?.portfolio && selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % influencer.portfolio.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Profile Header */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 border border-gray-200 dark:border-gray-700 mt-8">
          <img
            src={influencer.avatarUrl || "/images/default-avatar.png"}
            alt={influencer.handle}
            className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-lg"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold">{influencer.handle}</h1>
            {influencer.bio && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                {influencer.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-8 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {influencer.followerCount?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Followers
                </p>
              </div>
              {influencer.averageEngagementRate !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-500">
                    {influencer.averageEngagementRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Engagement
                  </p>
                </div>
              )}
              {influencer.location && (
                <div className="text-center">
                  <p className="text-lg font-semibold">{influencer.location}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Location
                  </p>
                </div>
              )}
            </div>

            {/* Categories */}
            {influencer.categories?.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6 justify-center sm:justify-start">
                {influencer.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 text-purple-900 dark:text-white rounded-full font-medium text-sm shadow-sm"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            {(influencer.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {(influencer.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/20 text-primary-dark rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Pricing */}
            {influencer.pricing &&
              (influencer.pricing.post ||
                influencer.pricing.reel ||
                influencer.pricing.story) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                  <div className="flex gap-6">
                    {influencer.pricing.post && (
                      <div>
                        <p className="font-bold">₹{influencer.pricing.post}</p>
                        <p className="text-sm text-gray-500">Post</p>
                      </div>
                    )}
                    {influencer.pricing.reel && (
                      <div>
                        <p className="font-bold">₹{influencer.pricing.reel}</p>
                        <p className="text-sm text-gray-500">Reel</p>
                      </div>
                    )}
                    {influencer.pricing.story && (
                      <div>
                        <p className="font-bold">₹{influencer.pricing.story}</p>
                        <p className="text-sm text-gray-500">Story</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Social Links */}
            <div className="flex justify-center sm:justify-start gap-6 mt-6">
              {influencer.socialLinks?.instagram && (
                <a
                  href={normalizeUrl(influencer.socialLinks.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-500 transition-colors"
                >
                  <i className="fab fa-instagram text-3xl"></i>
                </a>
              )}
              {influencer.socialLinks?.youtube && (
                <a
                  href={normalizeUrl(influencer.socialLinks.youtube)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <i className="fab fa-youtube text-3xl"></i>
                </a>
              )}
              
              {influencer.socialLinks?.twitter && (
                <a
                  href={normalizeUrl(influencer.socialLinks.twitter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-sky-400 transition-colors"
                >
                  <i className="fab fa-twitter text-3xl"></i>
                </a>
              )}
              {influencer.socialLinks?.other && (
                <a
                  href={normalizeUrl(influencer.socialLinks.other)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-green-500 transition-colors"
                >
                  <i className="fas fa-link text-3xl"></i>
                </a>
              )}
            </div>

            {/* Sponsor button */}
            {user?.role === "brand" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition shadow-lg hover:shadow-xl"
              >
                Sponsor this Influencer
              </button>
            )}
          </div>
        </div>

        {/* Portfolio */}
        {influencer.portfolio && influencer.portfolio.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {influencer.portfolio.map((img, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-xl shadow-md group cursor-pointer"
                  onClick={() => openImage(idx)}
                >
                  <img
                    src={img}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {selectedIndex !== null && influencer.portfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg">
            <button
              className="absolute top-4 right-6 text-white text-3xl font-bold"
              onClick={closeImage}
            >
              &times;
            </button>
            <button
              className="absolute left-6 text-white text-4xl"
              onClick={prevImage}
            >
              &#8249;
            </button>
            <img
              src={influencer.portfolio[selectedIndex]}
              alt="Full size"
              className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl"
            />
            <button
              className="absolute right-6 text-white text-4xl"
              onClick={nextImage}
            >
              &#8250;
            </button>
          </div>
        )}

        {/* Sponsorship Modal */}
        {influencer && (
          <SponsorshipModal
            influencerId={influencer._id}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              // Refresh sponsorships after sending an offer
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InfluencerPage;
