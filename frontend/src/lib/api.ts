import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://editco-clyra-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('doctor_token') || 
                  localStorage.getItem('clinic_token') || 
                  localStorage.getItem('patient_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
