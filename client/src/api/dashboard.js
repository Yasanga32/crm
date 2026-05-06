import api from './axios';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
