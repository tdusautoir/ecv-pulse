import axios from 'axios'
import { TOKEN_KEY } from './auth';
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        console.log('🚀 Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            headers: config.headers,
            data: config.data,
            params: config.params,
        });
        return config;
    },
    (error) => {
        console.log('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            url: response.config.url,
        });
        return response;
    },
    (error) => {
        console.log('❌ Response Error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
        });
        return Promise.reject(error);
    }
);

export default api