import axios from 'axios';

const API_BASE_URL = 'https://hc-parekh-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentApi = {
  getServices: () => api.get('/content/services'),
  addService: (data) => api.post('/content/services', data),
  getAbout: () => api.get('/content/about'),
  updateAbout: (data) => api.put('/content/about', data),
  getContact: () => api.get('/content/contact'),
  updateContact: (data) => api.put('/content/contact', data),
};

export const corporateApi = {
  getTenders: () => api.get('/corporate/tenders'),
  addTender: (data) => api.post('/corporate/tenders', data),
  deleteTender: (id) => api.delete(`/corporate/tenders/${id}`),

  getMOUs: () => api.get('/corporate/mous'),
  addMOU: (data) => api.post('/corporate/mous', data),
  deleteMOU: (id) => api.delete(`/corporate/mous/${id}`),

  getNotices: () => api.get('/corporate/notices'),
  addNotice: (data) => api.post('/corporate/notices', data),
  deleteNotice: (id) => api.delete(`/corporate/notices/${id}`),
};

export const workforceApi = {
  getTeam: () => api.get('/workforce/team'),
  addTeamMember: (formData) => api.post('/workforce/team', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteTeamMember: (id) => api.delete(`/workforce/team/${id}`),
  
  getVacancies: () => api.get('/workforce/vacancies'),
  addVacancy: (data) => api.post('/workforce/vacancies', data),
  deleteVacancy: (id) => api.delete(`/workforce/vacancies/${id}`),
};

export default api;
