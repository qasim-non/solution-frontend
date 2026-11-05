import { apiClient } from './client';
import { LoginRequest, LoginResponse } from '../types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    return response.data;
  },
};
