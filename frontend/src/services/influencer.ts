//src/services/influencer.tsx
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/influencers`;

export const getInfluencers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getInfluencerById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getInfluencers,
  getInfluencerById
};