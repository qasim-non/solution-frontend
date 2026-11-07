import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { storage } from '../utils/storage';
import type { ApiSuccessResponse, AuthTokenPair } from '../types/api';

const apiBaseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// A separate client prevents the refresh request from entering the same
// response interceptor and recursively trying to refresh itself.
const refreshClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<AuthTokenPair> | null = null;

const isLoginRequest = (url?: string): boolean =>
  String(url ?? '').includes('/login');

const isRefreshRequest = (url?: string): boolean =>
  String(url ?? '').includes('/auth/refresh');

const notifyUnauthenticated = (): void => {
  storage.removeTokens();
  window.dispatchEvent(new Event('auth:unauthorized'));
};

const refreshTokenPair = (refreshToken: string): Promise<AuthTokenPair> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiSuccessResponse<AuthTokenPair>>(
        '/auth/refresh',
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      )
      .then(({ data }) => {
        if (
          !data.success ||
          !data.data?.token ||
          !data.data?.refresh_token
        ) {
          throw new Error('The refresh endpoint returned an invalid token pair.');
        }

        return data.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Attach only the access token to normal API requests.
apiClient.interceptors.request.use((config) => {
  const accessToken = storage.getAccessToken();

  if (accessToken && !isLoginRequest(config.url)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isLoginRequest(originalRequest.url) ||
      isRefreshRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    // A retried request was also rejected: the session is no longer usable.
    if (originalRequest._retry) {
      notifyUnauthenticated();
      return Promise.reject(error);
    }

    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      notifyUnauthenticated();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Concurrent 401 responses share one refresh operation. This is
      // important because refresh tokens are single-use and rotated by Laravel.
      const tokens = await refreshTokenPair(refreshToken);

      storage.replaceTokens(tokens.token, tokens.refresh_token);
      originalRequest.headers.Authorization = `${tokens.token_type || 'Bearer'} ${tokens.token}`;

      window.dispatchEvent(
        new CustomEvent('auth:tokens-updated', {
          detail: { accessToken: tokens.token },
        }),
      );

      return apiClient(originalRequest);
    } catch (refreshError) {
      notifyUnauthenticated();
      return Promise.reject(refreshError);
    }
  },
);
