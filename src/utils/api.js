import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://startova-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
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

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || (error.response?.status === 404 && error.config.url?.includes('/auth/profile'))) {
            // Unauthorized or User Not Found - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

// Startup API
export const startupAPI = {
    create: (data) => api.post('/startups', data),
    getAll: (params) => api.get('/startups', { params }),
    getById: (id) => api.get(`/startups/${id}`),
    update: (id, data) => api.put(`/startups/${id}`, data),
    delete: (id) => api.delete(`/startups/${id}`),
};

// Investor API
export const investorAPI = {
    create: (data) => api.post('/investors', data),
    getAll: (params) => api.get('/investors', { params }),
    getById: (id) => api.get(`/investors/${id}`),
    update: (id, data) => api.put(`/investors/${id}`, data),
    delete: (id) => api.delete(`/investors/${id}`),
};

// Watchlist API
export const watchlistAPI = {
    add: (data) => api.post('/watchlist', data),
    getByInvestor: (investorId) => api.get(`/watchlist/investor/${investorId}`),
    getWatchers: (startupId) => api.get(`/watchlist/startup/${startupId}/watchers`),
    checkStatus: (investorId, startupId) => api.get(`/watchlist/check?investorId=${investorId}&startupId=${startupId}`),
    remove: (id) => api.delete(`/watchlist/${id}`),
};

// Message API
export const messageAPI = {
    send: (data) => api.post('/messages', data),
    getConversation: (investorId, startupId) => api.get(`/messages/conversation?investorId=${investorId}&startupId=${startupId}`),
    getStartupMessages: (startupId) => api.get(`/messages/startup/${startupId}`),
    getInvestorMessages: (investorId) => api.get(`/messages/investor/${investorId}`),
    markAsRead: (messageId) => api.patch(`/messages/${messageId}/read`),
    delete: (messageId) => api.delete(`/messages/${messageId}`)
};

// Investment API
export const investmentAPI = {
    makeInvestment: (data) => api.post('/investments/invest', data),
    getInvestorProfile: (investorId) => api.get(`/investments/investor/${investorId}`),
    getInvestorPortfolio: (investorId) => api.get(`/investments/investor/${investorId}/portfolio`),
    getStartupFunding: (startupId) => api.get(`/investments/startup/${startupId}/funding`),
    updateInvestorProfile: (investorId, data) => api.put(`/investments/investor/${investorId}`, data)
};

export default api;
