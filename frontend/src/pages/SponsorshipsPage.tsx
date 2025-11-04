// frontend/src/pages/SponsorshipsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Sponsorship } from "../types/types";
import { useAuth } from "../useAuth";
import toast from "react-hot-toast";
import { FaPlus, FaEye, FaFilter } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

// Create a partial interface for API responses that might be missing some fields
interface PartialSponsorship extends Omit<Sponsorship, 'updatedAt'> {
  updatedAt?: string;
}

const SponsorshipDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected" | "completed" | "cancelled">("all");

  // Determine which endpoint to use based on user role
  const getSponsorshipsEndpoint = useCallback(() => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    if (user?.role === "brand") {
      return `${baseUrl}/api/sponsorships/brand/my`;
    } else if (user?.role === "influencer") {
      return `${baseUrl}/api/sponsorships/my`;
    }
    return `${baseUrl}/api/sponsorships`;
  }, [user?.role]);

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        if (!token) return;
        
        setLoading(true);
        const res = await fetch(getSponsorshipsEndpoint(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load sponsorships");
        const data = await res.json();
        
        // Convert PartialSponsorship[] to Sponsorship[] by adding missing fields
        const fullSponsorships: Sponsorship[] = data.map((s: PartialSponsorship) => ({
          ...s,
          updatedAt: s.updatedAt || s.createdAt || new Date().toISOString()
        }));
        
        setSponsorships(fullSponsorships);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to load sponsorships");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorships();
  }, [token, getSponsorshipsEndpoint]);

  // Filter sponsorships based on status
  const filteredSponsorships = sponsorships.filter(sponsorship => {
    if (filter === "all") return true;
    return sponsorship.status === filter;
  });

  // Format price with currency
  const formatPrice = (value?: number) => {
    if (value === undefined || value === null) return "N/A";
    // show integer or two decimals if fractional
    const v = Number(value);
    const formatted = Number.isInteger(v) ? v.toString() : v.toFixed(2);
    return `₹${formatted}`;
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get brand name
  const getBrandName = (sponsorship: Sponsorship) => {
    if (typeof sponsorship.brand === 'object' && sponsorship.brand) {
      return sponsorship.brand.companyName || 
             sponsorship.brand.contactEmail || 
             (sponsorship.brand.user && typeof sponsorship.brand.user === 'object' 
               ? sponsorship.brand.user.name 
               : "Unknown Brand");
    }
    return "Unknown Brand";
  };

  // Get influencer name
  const getInfluencerName = (sponsorship: Sponsorship) => {
    if (typeof sponsorship.influencer === 'object' && sponsorship.influencer) {
      return sponsorship.influencer.user && typeof sponsorship.influencer.user === 'object'
        ? sponsorship.influencer.user.name
        : sponsorship.influencer.handle;
    }
    return "Unknown Influencer";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sponsorships</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {user?.role === "brand" 
              ? "Manage your sponsorship campaigns" 
              : "View and manage your sponsorship offers"}
          </p>
        </div>
        {user?.role === "brand" && (
          <button
            onClick={() => navigate("/sponsorships/create")}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow"
          >
            <FaPlus />
            <span>Create Sponsorship</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Sponsorships</h2>
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "accepted", "rejected", "completed", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsorships List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredSponsorships.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No sponsorships found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {filter === "all" 
                ? "You don't have any sponsorships yet." 
                : `You don't have any ${filter} sponsorships.`}
            </p>
            {user?.role === "brand" && (
              <button
                onClick={() => navigate("/sponsorships/create")}
                className="btn-primary px-6 py-2 rounded-lg font-medium"
              >
                Create Your First Sponsorship
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sponsorship
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {user?.role === "brand" ? "Influencer" : "Brand"}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Budget
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSponsorships.map((sponsorship) => (
                  <tr 
                    key={sponsorship._id} 
                    className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{sponsorship.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{sponsorship.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.role === "brand" 
                          ? getInfluencerName(sponsorship)
                          : getBrandName(sponsorship)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(sponsorship.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(sponsorship.status)}`}>
                        {sponsorship.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/sponsorships/${sponsorship._id}`)}
                        className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary flex items-center gap-1 px-3 py-1 rounded transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <FaEye />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorshipDashboard;