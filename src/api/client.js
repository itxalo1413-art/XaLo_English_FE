import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
client.interceptors.request.use(
    (config) => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                const token = parsed?.token;
                if (token && typeof token === 'string' && token.length > 0) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.warn('Error reading user info from localStorage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
