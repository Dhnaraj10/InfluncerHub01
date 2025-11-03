// frontend/src/pages\SponsorshipsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Sponsorship } from "../types/types";
import { useAuth } from "../useAuth";
import toast from "react-hot-toast";
import { FaPlus, FaEye } from "react-icons/fa";
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
    return `${baseUrl}/api/sponsorships/my`;
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
        toast.error(err.message || "Error fetching sponsorships");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorships();
    
    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchSponsorships();
    }, 10000); // Poll every 10 seconds for more responsive updates
    
    return () => clearInterval(interval);
  }, [token, getSponsorshipsEndpoint]);

  const handleAction = async (id: string, action: "accept" | "reject" | "cancel" | "complete") => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      let endpoint = `${baseUrl}/api/sponsorships/${id}`;
      let method = "PUT";
      
      switch (action) {
        case "accept":
        case "reject":
          endpoint += `/${action}`;
          method = "PATCH";
          break;
        case "cancel":
          endpoint += "/cancel";
          break;
        case "complete":
          endpoint += "/complete";
          break;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (!res.ok) throw new Error("Action failed");
      
      toast.success(`Sponsorship ${action}ed`);
      
      // Refresh the list immediately after action
      const res2 = await fetch(getSponsorshipsEndpoint(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res2.ok) {
        const data = await res2.json();
        setSponsorships(data);
      }
    } catch (err: any) {
      toast.error(err.message || `Error ${action}ing sponsorship`);
    }
  };

  const filteredSponsorships = sponsorships.filter(s => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Sponsorships</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Sponsorships</h1>
          {user?.role === "brand" && (
            <button
              onClick={() => navigate("/create-sponsorship")}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:opacity-90 transition flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              Create Sponsorship
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "accepted", "rejected", "completed", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === status
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sponsorship List */}
        {filteredSponsorships.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No sponsorships found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === "all" 
                ? "You don't have any sponsorships yet." 
                : `You don't have any ${filter} sponsorships.`}
            </p>
            {user?.role === "brand" && (
              <button
                onClick={() => navigate("/create-sponsorship")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Create Your First Sponsorship
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSponsorships.map((sponsorship) => (
              <div 
                key={sponsorship._id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {sponsorship.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sponsorship.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : sponsorship.status === "accepted"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : sponsorship.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : sponsorship.status === "rejected" || sponsorship.status === "cancelled"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                    }`}>
                      {sponsorship.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {sponsorship.description || "No description provided"}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {sponsorship.budget ? `₹${sponsorship.budget}` : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(sponsorship.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Brand/Influencer Info */}
                  <div className="mb-6">
                    {user?.role === "influencer" && typeof sponsorship.brand === "object" ? (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {sponsorship.brand.name || sponsorship.brand.companyName || "Unknown Brand"}
                        </p>
                      </div>
                    ) : user?.role === "brand" && typeof sponsorship.influencer === "object" ? (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {sponsorship.influencer.name || sponsorship.influencer.handle || "Unknown Influencer"}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/sponsorships/${sponsorship._id}`)}
                      className="flex items-center text-sm text-primary hover:text-primary-dark"
                    >
                      <FaEye className="mr-1" />
                      View
                    </button>
                    
                    {user?.role === "brand" && sponsorship.status === "pending" && (
                      <button
                        onClick={() => handleAction(sponsorship._id, "cancel")}
                        className="text-sm text-red-600 hover:text-red-800 dark:hover:text-red-400"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {user?.role === "brand" && sponsorship.status === "accepted" && (
                      <button
                        onClick={() => handleAction(sponsorship._id, "complete")}
                        className="text-sm text-green-600 hover:text-green-800 dark:hover:text-green-400"
                      >
                        Complete
                      </button>
                    )}
                    
                    {user?.role === "influencer" && sponsorship.status === "pending" && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAction(sponsorship._id, "reject")}
                          className="text-sm text-red-600 hover:text-red-800 dark:hover:text-red-400"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(sponsorship._id, "accept")}
                          className="text-sm text-green-600 hover:text-green-800 dark:hover:text-green-400"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorshipDashboard;