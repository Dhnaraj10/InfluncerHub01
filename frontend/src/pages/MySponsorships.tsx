// frontend/src/pages/MySponsorships.tsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../AuthContext';
import SponsorshipFilters from '../components/SponsorshipFilters';
import axios from 'axios';
import { Sponsorship } from '../types/types';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import SponsorshipModal from '../components/SponsorshipModal';
import { FaEye } from 'react-icons/fa';
import {
  acceptSponsorship,
  rejectSponsorship,
  cancelSponsorship,
  completeSponsorship
} from '../services/sponsorship';

// Create a partial interface for API responses that might be missing some fields
interface PartialSponsorship extends Omit<Sponsorship, 'updatedAt'> {
  updatedAt?: string;
}

const MySponsorships: React.FC = () => {
  const context = useContext(AuthContext);
  const [filters, setFilters] = useState({ status: 'All', date: '' });
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [filteredSponsorships, setFilteredSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Check if context is available
  if (!context) {
    throw new Error('MySponsorships must be used within an AuthProvider');
  }

  const { user, token } = context;

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

  // Fetch sponsorships based on user role
  const fetchSponsorships = useCallback(async () => {
    if (!token || !user) return;
    
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      let endpoint = '';
      if (user.role === 'brand') {
        endpoint = 'http://localhost:5000/api/sponsorships/brand/my';
      } else if (user.role === 'influencer') {
        endpoint = 'http://localhost:5000/api/sponsorships/my';
      }
      
      const response = await axios.get<PartialSponsorship[]>(endpoint, config);
      
      // Convert PartialSponsorship[] to Sponsorship[] by adding missing fields
      const fullSponsorships: Sponsorship[] = response.data.map(s => ({
        ...s,
        updatedAt: s.updatedAt || s.createdAt || new Date().toISOString()
      }));
      
      setSponsorships(fullSponsorships);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
      toast.error('Failed to load sponsorships');
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchSponsorships();
  }, [fetchSponsorships, refreshFlag]);

  // Apply filters whenever filters or sponsorships change
  useEffect(() => {
    let result = [...sponsorships];
    
    // Apply status filter
    if (filters.status !== 'All') {
      result = result.filter(sponsorship => 
        sponsorship.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      result = result.filter(sponsorship => {
        const sponsorshipDate = new Date(sponsorship.createdAt);
        return sponsorshipDate.toDateString() === filterDate.toDateString();
      });
    }
    
    setFilteredSponsorships(result);
  }, [filters, sponsorships]);

  const handleFilterChange = (newFilters: { status: string; date: string }) => {
    setFilters(newFilters);
  };

  const handleSponsorshipClick = (sponsorship: Sponsorship) => {
    setSelectedSponsorship(sponsorship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSponsorship(null);
  };

  const handleAccept = async (id: string) => {
    if (!token) return;
    
    try {
      await acceptSponsorship(id, token);
      toast.success('Sponsorship accepted successfully');
      setIsModalOpen(false);
      setRefreshFlag(!refreshFlag); // Trigger refresh
    } catch (error) {
      console.error('Error accepting sponsorship:', error);
      toast.error('Failed to accept sponsorship');
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;
    
    try {
      await rejectSponsorship(id, token);
      toast.success('Sponsorship rejected');
      setIsModalOpen(false);
      setRefreshFlag(!refreshFlag); // Trigger refresh
    } catch (error) {
      console.error('Error rejecting sponsorship:', error);
      toast.error('Failed to reject sponsorship');
    }
  };

  const handleCancel = async (id: string) => {
    if (!token) return;
    
    try {
      await cancelSponsorship(id, token);
      toast.success('Sponsorship cancelled');
      setIsModalOpen(false);
      setRefreshFlag(!refreshFlag); // Trigger refresh
    } catch (error) {
      console.error('Error cancelling sponsorship:', error);
      toast.error('Failed to cancel sponsorship');
    }
  };

  const handleComplete = async (id: string) => {
    if (!token) return;
    
    try {
      await completeSponsorship(id, token);
      toast.success('Sponsorship marked as completed');
      setIsModalOpen(false);
      setRefreshFlag(!refreshFlag); // Trigger refresh
    } catch (error) {
      console.error('Error completing sponsorship:', error);
      toast.error('Failed to mark sponsorship as completed');
    }
  };

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSponsorships();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchSponsorships]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">My Sponsorships</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">
            {user?.role === 'brand' ? 'My Created Sponsorships' : 'My Sponsorship Offers'}
          </h2>
          <SponsorshipFilters onFilterChange={handleFilterChange} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        {filteredSponsorships.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {user?.role === 'brand' ? 'Influencer' : 'Brand'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSponsorships.map((sponsorship) => (
                  <tr key={sponsorship._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.role === 'brand' 
                            ? (typeof sponsorship.influencer === 'object' ? sponsorship.influencer.handle : 'N/A')
                            : <>{getBrandName(sponsorship)}</>}
                        </div>
                        {user?.role === 'influencer' && getBrandId(sponsorship) && (
                          <Link 
                            to={`/brand/${getBrandId(sponsorship)}`} 
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                          >
                            <FaEye size={12} /> View
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sponsorship.title}</div>
                      {sponsorship.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{sponsorship.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sponsorship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        sponsorship.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        sponsorship.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sponsorship.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        sponsorship.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sponsorship.budget ? `₹${sponsorship.budget.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sponsorship.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleSponsorshipClick(sponsorship)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sponsorships</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user?.role === 'brand' 
                ? "You haven't created any sponsorships yet." 
                : "You don't have any sponsorship offers yet."}
            </p>
          </div>
        )}
      </div>

      <SponsorshipModal
        sponsorship={selectedSponsorship}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAccept}
        onReject={handleReject}
        onCancel={handleCancel}
        onComplete={handleComplete}
        userRole={user?.role || ''}
      />
    </div>
  );
};

export default MySponsorships;