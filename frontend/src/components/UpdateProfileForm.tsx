// frontend/src/components/UpdateProfileForm.tsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useAuth } from "../useAuth";
import toast from "react-hot-toast";
import { InfluencerProfile } from "../types/types"; // Import InfluencerProfile type

interface UpdateProfileFormInputs {
  name: string;
  email: string;
  bio: string;
  location: string;
  handle: string; // Added handle
  followerCount: number; // Added followerCount
  socialLinks: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  portfolio: { value: string }[]; // Added portfolio
  categories: { _id: string; name: string }[]; // Added categories
}

const UpdateProfileForm: React.FC = () => {
  const { token } = useAuth();
  const { register, handleSubmit, reset, control } = useForm<UpdateProfileFormInputs>();
  const [loading, setLoading] = useState(false);

  const { fields: portfolioFields, append: appendPortfolio, remove: removePortfolio } = useFieldArray<UpdateProfileFormInputs, "portfolio">({ // Explicitly type useFieldArray
    control,
    name: "portfolio",
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray<UpdateProfileFormInputs, "categories">({ // Explicitly type useFieldArray
    control,
    name: "categories",
  });

  // Load current profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/influencers/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data: InfluencerProfile = await res.json();

        reset({
          name: data.user?.name || "",
          email: data.user?.email || "",
          bio: data.bio || "",
          location: data.location || "",
          handle: data.handle || "",
          followerCount: data.followerCount || 0,
          socialLinks: {
            instagram: data.socialLinks?.instagram || "",
            youtube: data.socialLinks?.youtube || "",
            tiktok: data.socialLinks?.tiktok || "",
            twitter: data.socialLinks?.twitter || "",
          },
          portfolio: (data.portfolio || []).map(item => ({ value: item })),
          categories: data.categories || [],
        });
      } catch (err: any) {
        toast.error(err.message || "Could not fetch profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token, reset]);

  // Handle update
  const onSubmit = async (formData: UpdateProfileFormInputs) => {
    console.log("Frontend sending formData:", formData); // DEBUG
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/influencers/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          socialLinks: {
            instagram: formData.socialLinks.instagram,
            youtube: formData.socialLinks.youtube,
            tiktok: formData.socialLinks.tiktok,
            twitter: formData.socialLinks.twitter,
          },
          portfolio: formData.portfolio.map(item => item.value),
          categories: formData.categories.map(cat => cat.name), // Send only category names
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
        Update Profile
      </h2>

      {/* Handle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Handle (username)
        </label>
        <input
          type="text"
          {...register("handle")}
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-gray-50/70 dark:bg-gray-700/70 
            focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-gray-50/70 dark:bg-gray-700/70 
            focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-gray-50/70 dark:bg-gray-700/70 
            focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          rows={4}
          {...register("bio")}
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-gray-50/70 dark:bg-gray-700/70 
            focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Location
        </label>
        <input
          type="text"
          {...register("location")}
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-gray-50/70 dark:bg-gray-700/70 
            focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* Follower Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Follower Count
        </label>
        <input
          type="number"
          {...register("followerCount", { valueAsNumber: true })}
          className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-gray-50/70 dark:bg-gray-700/70 
            focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instagram URL
          </label>
          <input
            type="text"
            {...register("socialLinks.instagram")}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-gray-50/70 dark:bg-gray-700/70 
              focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            YouTube URL
          </label>
          <input
            type="text"
            {...register("socialLinks.youtube")}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-gray-50/70 dark:bg-gray-700/70 
              focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            TikTok URL
          </label>
          <input
            type="text"
            {...register("socialLinks.tiktok")}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-gray-50/70 dark:bg-gray-700/70 
              focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Twitter URL
          </label>
          <input
            type="text"
            {...register("socialLinks.twitter")}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-gray-50/70 dark:bg-gray-700/70 
              focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Portfolio */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Images</h3>
        {portfolioFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              type="text"
              {...register(`portfolio.${index}.value` as const)}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-gray-50/70 dark:bg-gray-700/70 
                focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
            <button
              type="button"
              onClick={() => removePortfolio(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendPortfolio({ value: "" })}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add Portfolio Image
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
        {categoryFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              type="text"
              {...register(`categories.${index}.name` as const)}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-gray-50/70 dark:bg-gray-700/70 
                focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendCategory({ _id: '', name: "" })}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add Category
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg text-white font-medium 
          bg-primary hover:bg-primary-dark transition duration-200 
          shadow hover:shadow-lg hover-glow disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default UpdateProfileForm;
