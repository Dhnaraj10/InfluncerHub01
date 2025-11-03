// src/services/common.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Function to get API base URL with better error handling
export const getApiBaseUrl = (): string => {
  const url = process.env.REACT_APP_API_URL;
  if (!url) {
    console.warn('REACT_APP_API_URL not set, using localhost fallback');
    return 'http://localhost:5000';
  }
  return url;
};

export const api = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`API GET request failed for ${url}:`, error);
      throw error;
    }
  },
  
  post: async (endpoint: string, data: any, options: RequestInit = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      method: 'POST',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    };
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`API POST request failed for ${url}:`, error);
      throw error;
    }
  },
  
  put: async (endpoint: string, data: any, options: RequestInit = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      method: 'PUT',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    };
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`API PUT request failed for ${url}:`, error);
      throw error;
    }
  },
  
  delete: async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      method: 'DELETE',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`API DELETE request failed for ${url}:`, error);
      throw error;
    }
  },
};

export default API_BASE_URL;