// src/services/search.ts
import { getApiBaseUrl } from './common';

interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

export const searchService = {
  searchInfluencers: async (params: SearchParams = {}) => {
    try {
      const baseUrl = getApiBaseUrl();
      const searchParams = new URLSearchParams();
      
      // Add all params to search
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${baseUrl}/api/influencers?${searchParams.toString()}`;
      console.log('Searching influencers with URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Search failed with status ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Influencer search results:', data);
        return data;
      } else {
        const text = await response.text();
        console.log('Received non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
    } catch (error) {
      console.error('Error searching influencers:', error);
      throw error;
    }
  },
  
  getAllInfluencers: async (params: SearchParams = {}) => {
    try {
      const baseUrl = getApiBaseUrl();
      const searchParams = new URLSearchParams();
      
      // Add all params to search
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${baseUrl}/api/influencers/all?${searchParams.toString()}`;
      console.log('Getting all influencers with URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Get all influencers failed with status ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('All influencers results:', data);
        return data;
      } else {
        const text = await response.text();
        console.log('Received non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
    } catch (error) {
      console.error('Error getting all influencers:', error);
      throw error;
    }
  },
  
  searchBrands: async (params: SearchParams = {}) => {
    try {
      const baseUrl = getApiBaseUrl();
      const searchParams = new URLSearchParams();
      
      // Add all params to search
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${baseUrl}/api/brands?${searchParams.toString()}`;
      console.log('Searching brands with URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brand search failed with status ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Brand search results:', data);
        return data;
      } else {
        const text = await response.text();
        console.log('Received non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
    } catch (error) {
      console.error('Error searching brands:', error);
      throw error;
    }
  },
  
  getAllBrands: async (params: SearchParams = {}) => {
    try {
      const baseUrl = getApiBaseUrl();
      const searchParams = new URLSearchParams();
      
      // Add all params to search
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${baseUrl}/api/brands/all?${searchParams.toString()}`;
      console.log('Getting all brands with URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Get all brands failed with status ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('All brands results:', data);
        return data;
      } else {
        const text = await response.text();
        console.log('Received non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
    } catch (error) {
      console.error('Error getting all brands:', error);
      throw error;
    }
  }
};