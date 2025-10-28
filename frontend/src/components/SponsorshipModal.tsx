//frontend/src/components/SponsorshipModal.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../useAuth";

interface SponsorshipModalProps {
  influencerId: string;
  isOpen: boolean;
  onClose: () => void;
}

const SponsorshipModal: React.FC<SponsorshipModalProps> = ({
  influencerId,
  isOpen,
  onClose,
}) => {
  const { token } = useAuth();

  const [budget, setBudget] = useState<number | "">("");
  const [deliverables, setDeliverables] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in as a brand to sponsor.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/sponsorships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          influencer: influencerId,
          title: `Sponsorship Offer`,
          description: details,
          budget,
          deliverables: deliverables.split(",").map((d) => d.trim()),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create sponsorship");
      }

      // We don't need to use the data variable, just check if request was successful
      await res.json();

      toast.success("Sponsorship request sent!");
      // Reset form
      setBudget("");
      setDeliverables("");
      setDeadline("");
      setDetails("");
      // Close modal
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-xl p-8 w-full max-w-lg border border-gray-200/30 dark:border-gray-700/30">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 text-center">
          Propose Sponsorship
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget (INR)
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                ₹
              </div>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : "")}
                required
                className="w-full px-4 py-2 pl-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deliverables (comma separated)
            </label>
            <input
              type="text"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="e.g. 1 Instagram Post, 2 Stories"
              required
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Describe campaign goals, expectations, etc."
              required
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                // Reset form
                setBudget("");
                setDeliverables("");
                setDeadline("");
                setDetails("");
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition shadow hover:shadow-lg hover-glow disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsorshipModal;