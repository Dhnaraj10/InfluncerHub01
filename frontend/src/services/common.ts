// src/services/common.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  get: (endpoint: string) => fetch(`${API_BASE_URL}/api${endpoint}`),
  post: (endpoint: string, data: any) => 
    fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) => 
    fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) => 
    fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
    }),
};

export default API_BASE_URL;