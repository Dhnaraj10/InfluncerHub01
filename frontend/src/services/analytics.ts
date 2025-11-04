// frontend/src/services/analytics.ts
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/analytics`;

export interface DashboardStats {
  activeCollaborations: number;
  earningsThisMonth: number;
  followerGrowth: number;
  engagementRate: number;
  responseRate: number;
  collaborationsChange: number;
  earningsChange: number;
  followerGrowthChange: number;
}

export interface BrandDashboardStats {
  activeSponsorships: number;
  totalBudget: number;
  campaignsThisMonth: number;
  activeSponsorshipsChange: number;
  budgetChange: number;
  campaignsChange: number;
}

// Get influencer dashboard statistics
export const getInfluencerStats = async (token: string): Promise<DashboardStats> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  // For now, we'll derive stats from sponsorships since there's no dedicated endpoint
  // In a real application, this would be a dedicated API endpoint
  const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/sponsorships/my`, config);
  const sponsorships = response.data;
  
  // Calculate stats based on sponsorships data
  const activeCollaborations = sponsorships.filter((s: any) => 
    s.status === 'accepted' || s.status === 'completed').length;
  
  // Calculate earnings (simplified - in a real app this would come from payments)
  const earningsThisMonth = sponsorships
    .filter((s: any) => s.status === 'completed')
    .reduce((sum: number, s: any) => sum + (s.budget || 0), 0);
  
  // Other stats would come from a dedicated analytics endpoint
  const stats: DashboardStats = {
    activeCollaborations,
    earningsThisMonth,
    followerGrowth: 12, // Placeholder - would come from social media APIs
    engagementRate: 4.2, // Placeholder - would come from analytics APIs
    responseRate: 85, // Placeholder - would come from messaging data
    collaborationsChange: 1, // Placeholder
    earningsChange: 8200, // Placeholder
    followerGrowthChange: 3.2 // Placeholder
  };
  
  return stats;
};

// Get brand dashboard statistics
export const getBrandStats = async (token: string): Promise<BrandDashboardStats> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  // For now, we'll derive stats from sponsorships since there's no dedicated endpoint
  const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/sponsorships/brand/my`, config);
  const sponsorships = response.data;
  
  const activeSponsorships = sponsorships.filter((s: any) => 
    s.status === 'accepted' || s.status === 'pending').length;
  
  const totalBudget = sponsorships.reduce((sum: number, s: any) => sum + (s.budget || 0), 0);
  
  // Placeholder for campaigns this month - would need date filtering in real app
  const campaignsThisMonth = sponsorships.length;
  
  const stats: BrandDashboardStats = {
    activeSponsorships,
    totalBudget,
    campaignsThisMonth,
    activeSponsorshipsChange: 2, // Placeholder
    budgetChange: 15, // Placeholder as percentage
    campaignsChange: 1 // Placeholder
  };
  
  return stats;
};

export default {
  getInfluencerStats,
  getBrandStats
};