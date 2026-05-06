import api from './axios';

/**
 * Get all users (salespeople)
 */
export const getUsers = async () => {
  const response = await api.get('/auth');
  return response.data;
};
