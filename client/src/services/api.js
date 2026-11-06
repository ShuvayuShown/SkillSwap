import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data)
};

export const userApi = {
  getUsers: (params) => api.get('/users', { params }).then((res) => res.data),
  getUserById: (id) => api.get(`/users/${id}`).then((res) => res.data),
  searchUsers: (params) => api.get('/users/search', { params }).then((res) => res.data),
  updateProfile: (data) => api.put('/users/profile', data).then((res) => res.data)
};

export const skillApi = {
  getMeta: () => api.get('/skills').then((res) => res.data),
  addTeachingSkill: (data) => api.post('/skills/teach', data).then((res) => res.data),
  updateTeachingSkill: (id, data) => api.put(`/skills/teach/${id}`, data).then((res) => res.data),
  deleteTeachingSkill: (id) => api.delete(`/skills/teach/${id}`).then((res) => res.data),
  addLearningSkill: (data) => api.post('/skills/learn', data).then((res) => res.data),
  updateLearningSkill: (id, data) => api.put(`/skills/learn/${id}`, data).then((res) => res.data),
  deleteLearningSkill: (id) => api.delete(`/skills/learn/${id}`).then((res) => res.data)
};

export const requestApi = {
  createRequest: (data) => api.post('/requests', data).then((res) => res.data),
  getReceived: () => api.get('/requests/received').then((res) => res.data),
  getSent: () => api.get('/requests/sent').then((res) => res.data),
  getCompleted: () => api.get('/requests/completed').then((res) => res.data),
  accept: (id) => api.patch(`/requests/${id}/accept`).then((res) => res.data),
  reject: (id) => api.patch(`/requests/${id}/reject`).then((res) => res.data),
  cancel: (id) => api.patch(`/requests/${id}/cancel`).then((res) => res.data),
  complete: (id) => api.patch(`/requests/${id}/complete`).then((res) => res.data)
};

export const reviewApi = {
  submitReview: (data) => api.post('/reviews', data).then((res) => res.data),
  getUserReviews: (userId) => api.get(`/reviews/${userId}`).then((res) => res.data)
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats').then((res) => res.data),
  getRecommendations: () => api.get('/dashboard/recommendations').then((res) => res.data)
};

export default api;
