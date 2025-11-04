//frontend/src/components/RecentActivity.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sponsorship } from '../types/types';

const RecentActivity: React.FC = () => {
  const { user, token } = useAuth();
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorships = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/sponsorships/activities`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch activities");
        }
        
        const data = await res.json();
        setSponsorships(data);
      } catch (err: any) {
        toast.error(err.message || 'Error fetching activities');
        console.error('Error fetching activities:', err);
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
  }, [token]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} minutes ago`;
    }
    
    return "Just now";
  };

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
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
            {user?.role === 'brand' ? 'Campaign Activity' : 'Collaboration Activity'}
          </h3>
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="ml-4 flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
          {user?.role === 'brand' ? 'Campaign Activity' : 'Collaboration Activity'}
        </h3>
        <Link to="/sponsorships" className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {sponsorships.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You don't have any recent activity yet.
            </p>
          </div>
        ) : (
          sponsorships.map((sponsorship) => (
            <div 
              key={sponsorship._id} 
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {sponsorship.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {sponsorship.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(sponsorship.status)}`}>
                      {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(sponsorship.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Link
                    to={`/sponsorships/${sponsorship._id}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light"
                  >
                    View
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;