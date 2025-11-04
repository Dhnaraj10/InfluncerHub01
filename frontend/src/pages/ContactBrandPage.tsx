// frontend/src/pages/ContactBrandPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../useAuth";
import axios from "axios";
import toast from "react-hot-toast";

interface Brand {
  _id: string;
  companyName: string;
  contactEmail: string;
  description?: string;
  logoUrl?: string;
}

const ContactBrandPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    collaborationIdea: "",
  });

  useEffect(() => {
    const fetchBrand = async () => {
      if (!token || !id) return;
      
      try {
        setLoading(true);
        // In a real app, you would fetch the brand details from an API
        // For now, we'll simulate with sample data
        const sampleBrand: Brand = {
          _id: id,
          companyName: "Sample Brand",
          contactEmail: "contact@samplebrand.com",
          description: "A sample brand for demonstration purposes",
          logoUrl: "https://placehold.co/100"
        };
        
        setBrand(sampleBrand);
      } catch (err) {
        console.error("Error fetching brand:", err);
        toast.error("Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real app, you would send the contact request to an API
      // await axios.post(`${process.env.REACT_APP_API_URL}/api/contact/brand`, {
      //   brandId: id,
      //   subject: formData.subject,
      //   message: formData.message,
      //   collaborationIdea: formData.collaborationIdea
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Your message has been sent to the brand!");
      navigate("/search");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            to="/search" 
            className="flex items-center text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Search
          </Link>
        </div>
        
        <div className="card shadow-lg rounded-xl overflow-hidden">
          <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Brand</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Send a collaboration request to {brand?.companyName}
            </p>
          </div>
          
          <div className="p-6">
            {/* Brand info */}
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
              {brand?.logoUrl ? (
                <img 
                  src={brand.logoUrl} 
                  alt={brand.companyName} 
                  className="w-16 h-16 rounded-full object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{brand?.companyName}</h2>
                <p className="text-gray-600 dark:text-gray-400">{brand?.contactEmail}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Collaboration Proposal for Summer Campaign"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Introduce yourself and explain why you'd like to collaborate with this brand..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="collaborationIdea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collaboration Idea (Optional)
                </label>
                <textarea
                  id="collaborationIdea"
                  name="collaborationIdea"
                  value={formData.collaborationIdea}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Share your initial ideas for collaboration (e.g., content type, theme, platforms)..."
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBrandPage;