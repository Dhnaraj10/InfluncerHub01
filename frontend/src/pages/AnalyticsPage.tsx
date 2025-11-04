// frontend/src/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { getInfluencerStats, getBrandStats, DashboardStats, BrandDashboardStats } from "../services/analytics";
import { getInfluencerSponsorships, getBrandSponsorships } from "../services/sponsorship";
import { Sponsorship } from "../types/types";
import { Link } from "react-router-dom";

const AnalyticsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | BrandDashboardStats | null>(null);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        
        if (user?.role === 'brand') {
          const brandStats = await getBrandStats(token);
          const brandSponsorships = await getBrandSponsorships(token);
          setStats(brandStats);
          setSponsorships(brandSponsorships);
        } else {
          const influencerStats = await getInfluencerStats(token);
          const influencerSponsorships = await getInfluencerSponsorships(token);
          setStats(influencerStats);
          setSponsorships(influencerSponsorships);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user?.role]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.role === 'brand' 
                ? "Detailed insights into your sponsorship campaigns" 
                : "Performance metrics for your collaborations"}
            </p>
          </div>
          
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
            
            <div className="card p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'brand' 
              ? "Detailed insights into your sponsorship campaigns" 
              : "Performance metrics for your collaborations"}
          </p>
        </div>

        {user?.role === 'brand' ? (
          // Brand Analytics
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Campaigns</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {(stats as BrandDashboardStats)?.activeSponsorships || 0}
                </p>
                <p className="text-sm text-green-500 mt-1">
                  +{(stats as BrandDashboardStats)?.activeSponsorshipsChange || 0} from last week
                </p>
              </div>
              
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Budget</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  ₹{(stats as BrandDashboardStats)?.totalBudget?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-500 mt-1">
                  +{(stats as BrandDashboardStats)?.budgetChange || 0}% from last month
                </p>
              </div>
              
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Campaigns</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {sponsorships.filter(s => s.status === 'accepted' || s.status === 'pending').length}
                </p>
                <p className="text-sm text-blue-500 mt-1">
                  {sponsorships.filter(s => s.status === 'pending').length} pending
                </p>
              </div>
              
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Completed</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {sponsorships.filter(s => s.status === 'completed').length}
                </p>
                <p className="text-sm text-green-500 mt-1">
                  +{sponsorships.filter(s => s.status === 'completed').length} this month
                </p>
              </div>
            </div>
            
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">
                Recent Campaigns
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Influencer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sponsorships.slice(0, 5).map((sponsorship) => (
                      <tr key={sponsorship._id} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sponsorship.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {sponsorship.description?.substring(0, 50)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {typeof sponsorship.influencer === 'object' && sponsorship.influencer 
                              ? sponsorship.influencer.name || (sponsorship.influencer.user && typeof sponsorship.influencer.user === 'object' 
                                ? sponsorship.influencer.user.name 
                                : '')
                              : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{sponsorship.budget?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(sponsorship.status)}`}>
                            {sponsorship.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <Link to="/sponsorships" className="btn-primary inline-flex">
                  View All Campaigns
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Influencer Analytics
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Collaborations</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {(stats as DashboardStats)?.activeCollaborations || 0}
                </p>
                <p className="text-sm text-green-500 mt-1">
                  +{(stats as DashboardStats)?.collaborationsChange || 0} from last week
                </p>
              </div>
              
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Earnings</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  ₹{(stats as DashboardStats)?.earningsThisMonth?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-500 mt-1">
                  +₹{(stats as DashboardStats)?.earningsChange?.toLocaleString() || '0'} from last month
                </p>
              </div>
              
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Engagement Rate</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {(stats as DashboardStats)?.engagementRate || 0}%
                </p>
                <p className="text-sm text-blue-500 mt-1">
                  Average across campaigns
                </p>
              </div>
              
              <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Response Rate</h3>
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {(stats as DashboardStats)?.responseRate || 0}%
                </p>
                <p className="text-sm text-green-500 mt-1">
                  +12% from last quarter
                </p>
              </div>
            </div>
            
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">
                Recent Collaborations
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Collaboration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sponsorships.slice(0, 5).map((sponsorship) => (
                      <tr key={sponsorship._id} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sponsorship.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {sponsorship.description?.substring(0, 50)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {typeof sponsorship.brand === 'object' && sponsorship.brand 
                              ? sponsorship.brand.companyName || ''
                              : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{sponsorship.budget?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(sponsorship.status)}`}>
                            {sponsorship.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <Link to="/sponsorships" className="btn-primary inline-flex">
                  View All Collaborations
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
            <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              Performance Insights
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Content Quality</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Audience Engagement</span>
                  <span className="font-medium">76%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Punctuality</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
            <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              Recommendations
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user?.role === 'brand' 
                    ? "Create 2 more campaigns to meet your quarterly goals" 
                    : "Post 3 times per week to maintain engagement"}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user?.role === 'brand' 
                    ? "Focus on fashion industry influencers for better ROI" 
                    : "Engage more with comments to boost your response rate"}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user?.role === 'brand' 
                    ? "Try video content for higher engagement rates" 
                    : "Diversify your content with behind-the-scenes posts"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;