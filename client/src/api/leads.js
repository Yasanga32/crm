import api from './axios';

/**
 * Get all leads
 */
export const getLeads = async (params = {}) => {
  const response = await api.get('/leads', { params });
  return response.data;
};

/**
 * Get a specific lead by ID
 */
export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

/**
 * Create a new lead
 */
export const createLead = async (data) => {
  const response = await api.post('/leads', data);
  return response.data;
};

/**
 * Update an existing lead
 */
export const updateLead = async (id, data) => {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
};

/**
 * Delete a lead
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

/**
 * Get notes for a lead
 */
export const getLeadNotes = async (leadId) => {
  const response = await api.get(`/leads/${leadId}/notes`);
  return response.data;
};

/**
 * Add a note to a lead
 */
export const addLeadNote = async (leadId, content) => {
  const response = await api.post(`/leads/${leadId}/notes`, { content });
  return response.data;
};
