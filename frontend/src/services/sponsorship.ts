//src/services/sponsorship.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sponsorships';

export const getSponsorships = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createSponsorship = async (sponsorshipData: any) => {
  const response = await axios.post(API_URL, sponsorshipData);
  return response.data;
};
