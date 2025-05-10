import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const quizService = {
  getQuizzes: async (status, page = 1) => {
    try {
      const response = await api.get(`/quizzes?status=${status}&page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getQuizById: async (id) => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  startQuiz: async (id) => {
    try {
      const response = await api.post(`/quizzes/${id}/start`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitQuiz: async (id, answers) => {
    try {
      const response = await api.post(`/quizzes/${id}/submit`, { answers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const statsService = {
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 