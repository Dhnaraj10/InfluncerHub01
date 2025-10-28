//frontend/src/components/RecentActivity.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Activity {
  id: string;
  description: string;
  timestamp: string;
  type: 'sponsorship' | 'profile' | 'message' | 'payment' | 'notification' | 'default';
  actionUrl?: string;
}

const RecentActivity: React.FC = () => {
  const { user, token } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/sponsorships/activities", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch activities");
        }
        
        const data = await res.json();
        setActivities(data);
      } catch (err: any) {
        toast.error(err.message || 'Error fetching activities');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    
    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchActivities();
    }, 10000); // Poll every 10 seconds for more responsive updates
    
    return () => clearInterval(interval);
  }, [token]);

  const getIconForActivityType = (type: Activity['type']) => {
    switch (type) {
      case 'sponsorship':
        return (
          <div className="p-2 bg-primary-light/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      case 'profile':
        return (
          <div className="p-2 bg-secondary-light/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="p-2 bg-accent/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start p-3 rounded-lg">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse">
                <div className="h-5 w-5"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
          {user?.role === 'brand' ? 'Campaign Activity' : 'Collaboration Activity'}
        </h3>
        <Link to="/sponsorships" className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {getIconForActivityType(activity.type)}
              
              <div className="ml-4 flex-1">
                <p className="text-gray-800 dark:text-gray-200">{activity.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.timestamp}</p>
              </div>
              
              {activity.actionUrl && (
                <Link 
                  to={activity.actionUrl}
                  className="text-primary hover:text-primary-dark dark:hover:text-primary-light"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {user?.role === 'brand' ? 'No recent campaign activity' : 'No recent collaboration activity'}
            </h4>
            <p className="text-gray-500 dark:text-gray-400">
              {user?.role === 'brand' 
                ? 'When you send sponsorship offers, activity will appear here.' 
                : 'When you receive collaboration requests, activity will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;