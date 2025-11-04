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

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/influencers/search?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to search influencers");
      const data = await res.json();
      setFilteredInfluencers(data.results || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to search influencers");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Handle adding a deliverable
  const handleAddDeliverable = () => {
    if (deliverableInput.trim() && !deliverables.includes(deliverableInput.trim())) {
      const newDeliverables = [...deliverables, deliverableInput.trim()];
      setDeliverables(newDeliverables);
      setValue("deliverables", newDeliverables);
      setDeliverableInput("");
    }
  };

  // Handle removing a deliverable
  const handleRemoveDeliverable = (index: number) => {
    const newDeliverables = deliverables.filter((_, i) => i !== index);
    setDeliverables(newDeliverables);
    setValue("deliverables", newDeliverables);
  };

  // Handle selecting an influencer
  const handleSelectInfluencer = (influencer: InfluencerProfile) => {
    if (!selectedInfluencers.some(i => i._id === influencer._id)) {
      const newSelected = [...selectedInfluencers, influencer];
      setSelectedInfluencers(newSelected);
      setValue("influencerProfileIds", newSelected.map(i => i._id));
    }
    setSearchQuery("");
    setFilteredInfluencers([]);
  };

  // Handle removing a selected influencer
  const handleRemoveInfluencer = (id: string) => {
    const newSelected = selectedInfluencers.filter(i => i._id !== id);
    setSelectedInfluencers(newSelected);
    setValue("influencerProfileIds", newSelected.map(i => i._id));
  };

  // Handle form submission
  const onSubmit = async (data: CreateSponsorshipFormValues) => {
    if (data.influencerProfileIds.length === 0) {
      toast.error("Please select at least one influencer");
      return;
    }

    try {
      const responses = await Promise.all(
        data.influencerProfileIds.map(async (influencerId) => {
          const sponsorshipData = {
            influencer: influencerId,
            title: data.title,
            description: data.description,
            budget: data.budget,
            deliverables: data.deliverables,
          };

          const res = await fetch(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/sponsorships`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(sponsorshipData),
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to create sponsorship");
          }

          return res.json();
        })
      );

      toast.success(`Successfully created ${responses.length} sponsorship(s)!`);
      navigate("/sponsorships");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create sponsorships");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Sponsorship</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create a new sponsorship offer for influencers
            </p>
          </div>
          <button
            onClick={() => navigate("/sponsorships")}
            className="btn-secondary px-4 py-2 rounded-lg font-medium"
          >
            Back to Sponsorships
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Sponsored post for summer collection"
                  className="input w-full"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe the sponsorship opportunity..."
                  rows={4}
                  className="input w-full"
                />
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget (INR) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    ₹
                  </div>
                  <input
                    id="budget"
                    type="number"
                    {...register("budget", { 
                      required: "Budget is required",
                      min: { value: 1, message: "Budget must be at least ₹1" }
                    })}
                    placeholder="5000"
                    className="input w-full pl-8"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                )}
              </div>

              {/* Influencer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Influencers *
                </label>
                
                {/* Search Input */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search influencers by name or handle..."
                    className="input w-full pl-10"
                  />
                </div>

                {/* Selected Influencers */}
                {selectedInfluencers.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Influencers:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInfluencers.map((influencer) => (
                        <div 
                          key={influencer._id} 
                          className="flex items-center bg-primary/10 dark:bg-primary/20 rounded-full px-3 py-1"
                        >
                          <span className="text-sm text-primary dark:text-primary-light">
                            {typeof influencer.user === 'object' ? influencer.user.name : influencer.handle}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInfluencer(influencer._id)}
                            className="ml-2 text-primary dark:text-primary-light hover:text-primary-dark"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Results */}
                {searchQuery && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="py-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : filteredInfluencers.length > 0 ? (
                      <ul>
                        {filteredInfluencers.map((influencer) => (
                          <li 
                            key={influencer._id} 
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            onClick={() => handleSelectInfluencer(influencer)}
                          >
                            <div className="flex items-center">
                              {typeof influencer.user === 'object' && (influencer.user as any).avatar ? (
                                <img 
                                  src={(influencer.user as any).avatar} 
                                  alt={typeof influencer.user === 'object' ? influencer.user.name : influencer.handle} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                                    {typeof influencer.user === 'object' ? influencer.user.name?.charAt(0) : influencer.handle?.charAt(0) || "U"}
                                  </span>
                                </div>
                              )}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {typeof influencer.user === 'object' ? influencer.user.name : influencer.handle}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  @{influencer.handle}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                        No influencers found
                      </div>
                    )}
                  </div>
                )}

                {errors.influencerProfileIds && (
                  <p className="mt-1 text-sm text-red-600">{errors.influencerProfileIds.message}</p>
                )}
              </div>

              {/* Deliverables */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deliverables
                </label>
                
                {/* Add Deliverable Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    placeholder="e.g., Instagram post, YouTube video"
                    className="input flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="btn-primary px-4 py-2 rounded-lg font-medium"
                  >
                    Add
                  </button>
                </div>

                {/* Deliverables List */}
                {deliverables.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <ul className="space-y-2">
                      {deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{deliverable}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDeliverable(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/sponsorships")}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-3 rounded-lg font-medium"
                >
                  Create Sponsorship
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSponsorship;