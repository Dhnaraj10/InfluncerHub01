//frontend/src/components/Stats.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { getInfluencerStats, getBrandStats, DashboardStats, BrandDashboardStats } from '../services/analytics';
import { getInfluencerSponsorships, getBrandSponsorships } from '../services/sponsorship';

const Stats: React.FC = () => {
  const { user, token } = useAuth();
  const [influencerStats, setInfluencerStats] = useState<DashboardStats | null>(null);
  const [brandStats, setBrandStats] = useState<BrandDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        if (user?.role === 'brand') {
          const stats = await getBrandStats(token);
          setBrandStats(stats);
        } else {
          const stats = await getInfluencerStats(token);
          setInfluencerStats(stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, user?.role]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (user?.role === 'brand') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Sponsorships</h4>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{brandStats?.activeSponsorships || 0}</p>
              <p className="text-sm font-medium text-green-500 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+{brandStats?.activeSponsorshipsChange || 0} from last week</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 border-l-4 border-secondary">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Budget</h4>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">₹{brandStats ? brandStats.totalBudget.toLocaleString() : '0'}</p>
              <p className="text-sm font-medium text-green-500 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+{brandStats?.budgetChange || 0}% from last month</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-light/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 border-l-4 border-accent">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Campaigns This Month</h4>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{brandStats?.campaignsThisMonth || 0}</p>
              <p className="text-sm font-medium text-green-500 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>{brandStats?.campaignsChange || 0} new campaign{brandStats && brandStats.campaignsChange !== 1 ? 's' : ''}</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Influencer stats
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Collaborations</h4>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{influencerStats?.activeCollaborations || 0}</p>
              <p className="text-sm font-medium text-green-500 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+{influencerStats?.collaborationsChange || 0} from last week</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 border-l-4 border-secondary">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Earnings This Month</h4>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">₹{influencerStats ? influencerStats.earningsThisMonth.toLocaleString() : '0'}</p>
              <p className="text-sm font-medium text-green-500 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+₹{influencerStats ? influencerStats.earningsChange.toLocaleString() : '0'} from last month</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-light/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 border-l-4 border-accent">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Follower Growth</h4>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">+{influencerStats?.followerGrowth || 0}%</p>
              <p className="text-sm font-medium text-green-500 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+{influencerStats?.followerGrowthChange || 0}% from last month</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Stats;