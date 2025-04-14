import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('API baseURL:', baseURL); // Log the API URL for debugging

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error('API Error:', error.response?.data || error.message);
        
        const originalRequest = error.config;
        
        // Handle token expiration and refresh if needed
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Implement token refresh logic here if needed
            
            // For now, just clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api; 