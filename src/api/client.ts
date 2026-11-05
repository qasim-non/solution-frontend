import axios from 'axios';
import { storage } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach Sanctum Bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    try {
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      // Debug: log outgoing requests in dev
      // eslint-disable-next-line no-console
      console.debug('[apiClient] Request ->', config.method?.toUpperCase(), fullUrl);
    } catch (e) {}
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      // eslint-disable-next-line no-console
      console.debug('[apiClient] Response Error ->', error?.response?.status, error?.config?.url);
    } catch (e) {}
    if (error.response && error.response.status === 401) {
      // Clear token if unauthenticated
      storage.removeToken();

      // Don't bounce the user for a failed login attempt itself.
      const url = String(error.config?.url || '');
      if (!url.includes('/login')) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);
