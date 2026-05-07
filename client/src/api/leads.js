import api from './axios';


export const getLeads = async (params = {}) => {
  const response = await api.get('/leads', { params });
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};


export const createLead = async (data) => {
  const response = await api.post('/leads', data);
  return response.data;
};


export const updateLead = async (id, data) => {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
};


export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};


export const getLeadNotes = async (leadId) => {
  const response = await api.get(`/leads/${leadId}/notes`);
  return response.data;
};


export const addLeadNote = async (leadId, content) => {
  const response = await api.post(`/leads/${leadId}/notes`, { content });
  return response.data;
};
