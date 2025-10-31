// frontend/src/pages/SponsorshipsPage.tsx
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
    if (user?.role === "brand") {
      return "http://localhost:5000/api/sponsorships/brand/my";
    } else if (user?.role === "influencer") {
      return "http://localhost:5000/api/sponsorships/my";
    }
    return "http://localhost:5000/api/sponsorships/my";
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
      let endpoint = `http://localhost:5000/api/sponsorships/${id}`;
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
        
        // Convert PartialSponsorship[] to Sponsorship[] by adding missing fields
        const fullSponsorships: Sponsorship[] = data.map((s: PartialSponsorship) => ({
          ...s,
          updatedAt: s.updatedAt || s.createdAt || new Date().toISOString()
        }));
        
        setSponsorships(fullSponsorships);
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating sponsorship");
    }
  };

  const filteredSponsorships =
    filter === "all" ? sponsorships : sponsorships.filter((s) => s.status === filter);

  // Format budget with INR currency
  const formatBudget = (budget?: number) => {
    if (!budget) return "Not specified";
    return `₹${budget.toLocaleString()}`;
  };

  // Get brand ID from sponsorship object
  const getBrandId = useCallback((sponsorship: Sponsorship | PartialSponsorship): string | null => {
    if (typeof sponsorship.brand === 'object' && sponsorship.brand !== null) {
      // Use the user ID instead of the brand profile ID for public profile links
      if ('user' in sponsorship.brand && sponsorship.brand.user) {
        // If user is an object with _id property
        if (typeof sponsorship.brand.user === 'object' && '_id' in sponsorship.brand.user) {
          return sponsorship.brand.user._id as string;
        }
        // If user is directly the user ID string
        if (typeof sponsorship.brand.user === 'string') {
          return sponsorship.brand.user;
        }
      }
    }
    return null;
  }, []);

  // Get brand name from sponsorship object
  const getBrandName = useCallback((sponsorship: Sponsorship | PartialSponsorship): string => {
    // Handle case where brand is a populated object
    if (typeof sponsorship.brand === 'object' && sponsorship.brand !== null) {
      // Try to get the company name first
      if ('companyName' in sponsorship.brand && sponsorship.brand.companyName) {
        return sponsorship.brand.companyName as string;
      }
      // Try to get the email directly
      if ('contactEmail' in sponsorship.brand && sponsorship.brand.contactEmail) {
        return sponsorship.brand.contactEmail as string;
      }
      return "Unknown Brand";
    }
    // Handle case where brand is a string (ID or name)
    if (typeof sponsorship.brand === 'string') {
      return sponsorship.brand || "Unknown Brand";
    }
    return "Unknown Brand";
  }, []);

  if (loading && sponsorships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading sponsorships...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            {user?.role === "brand" ? "My Sponsorships" : "My Sponsorship Offers"}
          </h1>
          
          {user?.role === "brand" && (
            <button
              onClick={() => navigate("/sponsorships/create")}
              className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              <FaPlus /> Create Sponsorship
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "pending", "accepted", "rejected", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === tab
                  ? "bg-primary text-white shadow"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Sponsorship List */}
        {filteredSponsorships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No {filter === "all" ? "" : filter} sponsorships found.
            </p>
            {user?.role === "brand" && (
              <button
                onClick={() => navigate("/sponsorships/create")}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                <FaPlus /> Create Your First Sponsorship
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSponsorships.map((s) => (
              <div
                key={s._id}
                className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    {user?.role === "influencer" ? (
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Brand:
                        </span>
                        <span className="font-medium text-lg text-gray-900 dark:text-white">
                          {getBrandName(s)}
                        </span>
                        {getBrandId(s) && (
                          <Link 
                            to={`/brand/${getBrandId(s)}`}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                          >
                            <FaEye /> View Profile
                          </Link>
                        )}
                      </div>
                    ) : null}
                    
                    {user?.role === "brand" ? (
                      <p className="font-medium text-lg text-gray-900 dark:text-white mb-2">
                        Influencer: {typeof s.influencer === "string" ? s.influencer : s.influencer?.handle || "Unknown"}
                      </p>
                    ) : null}
                    
                    <h3 className="font-bold text-xl mt-1 text-gray-900 dark:text-white">{s.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{s.description}</p>
                    
                    <div className="mt-3 flex items-center gap-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Budget: <span className="font-medium">{formatBudget(s.budget)}</span>
                      </p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          s.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : s.status === "accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : s.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : s.status === "completed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </div>
                    
                    {s.deliverables && s.deliverables.length > 0 ? (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Deliverables:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {s.deliverables.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 md:mt-0 flex flex-col gap-2 min-w-[150px]">
                    {user?.role === "influencer" && s.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(s._id, "accept")}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition flex-1"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(s._id, "reject")}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex-1"
                        >
                          Reject
                        </button>
                      </div>
                    ) : null}
                    
                    {user?.role === "brand" && s.status === "pending" ? (
                      <button
                        onClick={() => handleAction(s._id, "cancel")}
                        className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                      >
                        Cancel
                      </button>
                    ) : null}
                    
                    {user?.role === "brand" && s.status === "accepted" ? (
                      <button
                        onClick={() => handleAction(s._id, "complete")}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Mark Complete
                      </button>
                    ) : null}
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