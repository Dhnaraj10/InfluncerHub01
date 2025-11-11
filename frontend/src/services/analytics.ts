// frontend/src/services/analytics.ts
import axios from 'axios';

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

// Get influencer dashboard stats
export const getInfluencerStats = async (token: string) => {
  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/analytics/influencer`;
  const res = await axios.get<DashboardStats>(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Get brand dashboard stats
export const getBrandStats = async (token: string) => {
  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/analytics/brand`;
  const res = await axios.get<BrandDashboardStats>(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};