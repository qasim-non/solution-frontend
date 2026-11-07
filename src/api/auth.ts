import { apiClient } from './client';
import type {
  ApiSuccessResponse,
  AuthTokenPair,
  LoginRequest,
} from '../types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthTokenPair> => {
    const response = await apiClient.post<ApiSuccessResponse<AuthTokenPair>>(
      '/login',
      credentials,
    );

    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post<ApiSuccessResponse<null>>('/auth/logout');
  },
};
