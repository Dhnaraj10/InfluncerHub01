//src/services/user.ts
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`;

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await axios.put(`${API_URL}/${id}`, userData);
  return response.data;
};

export default {
  getUsers,
  getUserById,
  updateUser
};