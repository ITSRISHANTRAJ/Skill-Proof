import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('skillproof_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('skillproof_token');
            localStorage.removeItem('skillproof_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
