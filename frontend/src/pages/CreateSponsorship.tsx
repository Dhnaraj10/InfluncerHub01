// frontend/src/pages/CreateSponsorship.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { InfluencerProfile } from "../types/types";

interface CreateSponsorshipFormValues {
  influencerProfileIds: string[]; // Changed from single ID to array
  title: string;
  description: string;
  budget: number;
  deliverables: string[];
}

const CreateSponsorship: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateSponsorshipFormValues>({
    defaultValues: {
      influencerProfileIds: [],
      deliverables: []
    }
  });

  const [filteredInfluencers, setFilteredInfluencers] = useState<InfluencerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInfluencers, setSelectedInfluencers] = useState<InfluencerProfile[]>([]); // Track selected influencers

  // Only brands can create sponsorships
  useEffect(() => {
    if (user?.role !== "brand") {
      navigate("/sponsorships");
      return;
    }
  }, [user?.role, navigate]);

  // Perform search when query changes
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredInfluencers([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      params.append('limit', '20'); // Limit results for performance

      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/influencers?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to search influencers");
      const data = await res.json();
      const results = data.results || data.data || data;
      setFilteredInfluencers(results);
    } catch (err: any) {
      toast.error(err.message || "Error searching influencers");
      setFilteredInfluencers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setFilteredInfluencers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, performSearch]);

  const addDeliverable = () => {
    if (deliverableInput.trim() && !deliverables.includes(deliverableInput.trim())) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  // Toggle influencer selection
  const toggleInfluencerSelection = (influencer: InfluencerProfile) => {
    setSelectedInfluencers(prev => {
      const isSelected = prev.some(i => i._id === influencer._id);
      let newSelection;
      
      if (isSelected) {
        // Remove from selection
        newSelection = prev.filter(i => i._id !== influencer._id);
      } else {
        // Add to selection
        newSelection = [...prev, influencer];
      }
      
      // Update form value
      setValue("influencerProfileIds", newSelection.map(i => i._id));
      return newSelection;
    });
  };

  // Remove selected influencer
  const removeSelectedInfluencer = useCallback((influencerId: string) => {
    setSelectedInfluencers(prev => {
      const newSelection = prev.filter(i => i._id !== influencerId);
      setValue("influencerProfileIds", newSelection.map(i => i._id));
      return newSelection;
    });
  }, [setValue]);

  const onSubmit = useCallback(async (data: CreateSponsorshipFormValues) => {
    if (data.influencerProfileIds.length === 0) {
      toast.error("Please select at least one influencer");
      return;
    }

    try {
      // Show loading state
      setLoading(true);
      
      // Create sponsorships sequentially to avoid overwhelming the server
      const createdSponsorships = [];
      let errorCount = 0;
      
      for (const influencerId of data.influencerProfileIds) {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/sponsorships`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              influencer: influencerId,
              title: data.title,
              description: data.description,
              budget: data.budget,
              deliverables: deliverables, // Use the state deliverables, not form data
            }),
          });

          if (res.ok) {
            const sponsorship = await res.json();
            createdSponsorships.push(sponsorship);
          } else {
            const errorData = await res.json();
            console.error(`Failed to create sponsorship for influencer ${influencerId}:`, errorData.message);
            errorCount++;
          }
        } catch (err) {
          console.error(`Error creating sponsorship for influencer ${influencerId}:`, err);
          errorCount++;
        }
      }
      
      // Provide feedback based on results
      if (createdSponsorships.length > 0) {
        if (errorCount === 0) {
          toast.success(`Successfully sent sponsorship offers to ${createdSponsorships.length} influencer(s)!`);
        } else {
          toast.success(`Sent sponsorship offers to ${createdSponsorships.length} influencer(s). ${errorCount} failed.`);
        }
        // Navigate to sponsorships page after successful submission
        navigate("/sponsorships");
      } else {
        toast.error("Failed to send any sponsorship offers. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating sponsorships");
    } finally {
      setLoading(false);
    }
  }, [token, navigate, toast, deliverables]);

  if (user?.role !== "brand") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Only brand users can create sponsorships. Your current role is: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading influencers...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Sponsorship</h1>
          <button
            onClick={() => navigate("/sponsorships")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Back to Sponsorships
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Influencer Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search and Select Influencer *
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by handle, category, or tag..."
                className="input w-full"
                disabled={loading}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredInfluencers([]);
                  }}
                  disabled={loading}
                >
                  &times;
                </button>
              )}
            </div>
            
            {loading && searchQuery ? (
              <div className="flex items-center justify-center py-4 text-gray-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching influencers...
              </div>
            ) : (
              <>
                {filteredInfluencers.length > 0 ? (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto mt-2">
                    {filteredInfluencers.map((influencer) => (
                      <div 
                        key={influencer._id}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedInfluencers.some(i => i._id === influencer._id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                        }`}
                        onClick={() => toggleInfluencerSelection(influencer)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              @{influencer.handle}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {influencer.followerCount?.toLocaleString()} followers
                            </div>
                          </div>
                          {influencer.categories && influencer.categories.length > 0 && (
                            <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              {influencer.categories[0]?.name || 'No category'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-4 text-gray-500">
                    No influencers found matching your search.
                  </div>
                ) : null}
              </>
            )}
            
            {/* Selected Influencers */}
            {selectedInfluencers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected Influencers
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedInfluencers.map((influencer) => (
                    <span
                      key={influencer._id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      @{influencer.handle}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedInfluencer(influencer._id);
                        }}
                        className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        disabled={loading}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hidden input for form validation */}
            <input 
              type="hidden" 
              {...register("influencerProfileIds", { 
                validate: (value) => value.length > 0 || "Please select at least one influencer"
              })} 
            />
            {errors.influencerProfileIds && (
              <p className="text-red-500 text-sm mt-1">{errors.influencerProfileIds.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="input w-full"
              placeholder="Sponsored post for summer collection"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="input w-full"
              placeholder="Describe the sponsorship opportunity..."
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget (INR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                ₹
              </div>
              <input
                type="number"
                {...register("budget", { valueAsNumber: true, min: 0 })}
                className="input pl-8 w-full"
                placeholder="1000"
              />
            </div>
            {errors.budget && (
              <p className="text-red-500 text-sm mt-1">
                {errors.budget.message || "Please enter a valid budget"}
              </p>
            )}
          </div>

          {/* Deliverables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deliverables
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={deliverableInput}
                onChange={(e) => setDeliverableInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDeliverable();
                  }
                }}
                className="input flex-1"
                placeholder="e.g., 1 Instagram post, 2 stories"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addDeliverable}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                disabled={loading}
              >
                Add
              </button>
            </div>
            {deliverables.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {deliverables.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => removeDeliverable(i)}
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      disabled={loading}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50"
              disabled={selectedInfluencers.length === 0 || loading}
            >
              {loading ? "Sending Offers..." : `Send Sponsorship Offer${selectedInfluencers.length > 1 ? ` to ${selectedInfluencers.length} Influencers` : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSponsorship;