import api from './api';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  updateProfile: async (data) => {
    return await api.put('/auth/profile', data);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const sourceService = {
  getAll: async () => {
    return await api.get('/sources');
  },

  getById: async (id) => {
    return await api.get(`/sources/${id}`);
  },

  create: async (data) => {
    return await api.post('/sources', data);
  },

  update: async (id, data) => {
    return await api.put(`/sources/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/sources/${id}`);
  },
};

export const channelService = {
  getAll: async () => {
    return await api.get('/channels');
  },

  getById: async (id) => {
    return await api.get(`/channels/${id}`);
  },

  create: async (data) => {
    return await api.post('/channels', data);
  },

  update: async (id, data) => {
    return await api.put(`/channels/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/channels/${id}`);
  },
};

export const offerService = {
  getAll: async (params) => {
    return await api.get('/offers', { params });
  },

  getById: async (id) => {
    return await api.get(`/offers/${id}`);
  },

  getStats: async () => {
    return await api.get('/offers/stats');
  },
};

export const ruleService = {
  getAll: async () => {
    return await api.get('/rules');
  },

  getById: async (id) => {
    return await api.get(`/rules/${id}`);
  },

  create: async (data) => {
    return await api.post('/rules', data);
  },

  update: async (id, data) => {
    return await api.put(`/rules/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/rules/${id}`);
  },
};
