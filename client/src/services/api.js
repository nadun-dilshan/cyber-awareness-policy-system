import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getToken, removeToken } from '../utils/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  completeOnboarding: () => api.post('/auth/onboarding'),
  getProfile: () => api.get('/auth/profile'),
};

// User APIs
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  createUser: (userData) => api.post('/auth/register', userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Policy APIs
export const policyAPI = {
  getPolicies: (params) => api.get('/policies', { params }),
  getAllPolicies: (params) => api.get('/policies/all', { params }),
  uploadPolicy: (formData) => api.post('/policies/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  acknowledgePolicy: (data) => api.post('/policies/acknowledge', data),
};

// Training APIs
export const trainingAPI = {
  getTrainings: (params) => api.get('/trainings', { params }),
  getAllTrainings: (params) => api.get('/trainings/all', { params }),
  createTraining: (data) => api.post('/trainings', data),
  submitQuiz: (data) => api.post('/trainings/quiz', data),
  getMyQuizzes: () => api.get('/trainings/quizzes'),
  getTrainingResults: (params) => api.get('/trainings/results', { params }),
  getMyTrainingResults: (params) => api.get('/trainings/my-results', { params }),
};

// Incident APIs
export const incidentAPI = {
  submitIncident: (formData) => api.post('/incidents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getIncidents: (params) => api.get('/incidents', { params }),
  getMyIncidents: (params) => api.get('/incidents/my', { params }),
  updateIncidentStatus: (data) => api.put('/incidents/status', data),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put('/notifications/read', { id }),
};

// Compliance APIs
export const complianceAPI = {
  getComplianceReport: () => api.get('/compliance/report'),
};

// Audit APIs
export const auditAPI = {
  getAuditLogs: () => api.get('/audits'),
};

export default api;