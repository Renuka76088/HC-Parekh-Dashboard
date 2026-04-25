import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const contentApi = {
  getServices:     ()        => api.get('/content/services'),
  addService:      (data)    => api.post('/content/services', data),
  updateService:   (id, data)=> api.put(`/content/services/${id}`, data),
  deleteService:   (id)      => api.delete(`/content/services/${id}`),

  getAbout:        ()        => api.get('/content/about'),
  updateAbout:     (data)    => api.put('/content/about', data),

  getContact:      ()        => api.get('/content/contact'),
  updateContact:   (data)    => api.put('/content/contact', data),
};

export const corporateApi = {
  getTenders:    ()         => api.get('/corporate/tenders'),
  addTender:     (data)     => api.post('/corporate/tenders', data),
  updateTender:  (id, data) => api.put(`/corporate/tenders/${id}`, data),
  deleteTender:  (id)       => api.delete(`/corporate/tenders/${id}`),

  getMOUs:       ()         => api.get('/corporate/mous'),
  addMOU:        (data)     => api.post('/corporate/mous', data),
  updateMOU:     (id, data) => api.put(`/corporate/mous/${id}`, data),
  deleteMOU:     (id)       => api.delete(`/corporate/mous/${id}`),

  getNotices:    ()         => api.get('/corporate/notices'),
  addNotice:     (data)     => api.post('/corporate/notices', data),
  updateNotice:  (id, data) => api.put(`/corporate/notices/${id}`, data),
  deleteNotice:  (id)       => api.delete(`/corporate/notices/${id}`),

  getCirculars:   ()         => api.get('/corporate/circulars'),
  addCircular:    (data)     => api.post('/corporate/circulars', data),
  updateCircular: (id, data) => api.put(`/corporate/circulars/${id}`, data),
  deleteCircular: (id)       => api.delete(`/corporate/circulars/${id}`),
};

export const webMarketApi = {
  getSettings: () => api.get('/web-market/settings'),
  updateSettings: (data) => api.put('/web-market/settings', data),
  getEndUserEnquiries: () => api.get('/web-market/end-user'),
  updateEndUserEnquiry: (id, data) => api.put(`/web-market/end-user/${id}`, data),
  deleteEndUserEnquiry: (id) => api.delete(`/web-market/end-user/${id}`),
  getServiceProviderEnquiries: () => api.get('/web-market/service-provider'),
  updateServiceProviderEnquiry: (id, data) => api.put(`/web-market/service-provider/${id}`, data),
  deleteServiceProviderEnquiry: (id) => api.delete(`/web-market/service-provider/${id}`),
};

export const workforceApi = {
  getVacancies:    ()         => api.get('/workforce/vacancies'),
  addVacancy:      (data)     => api.post('/workforce/vacancies', data),
  updateVacancy:   (id, data) => api.put(`/workforce/vacancies/${id}`, data),
  deleteVacancy:   (id)       => api.delete(`/workforce/vacancies/${id}`),
};

export default api;
