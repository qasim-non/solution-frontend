import { apiClient } from './client';
import {
  GetDashboardResponse,
  GetSystemTypesResponse,
  GetRequestsQueryParams,
  GetRequestsResponse,
  GetSocialMediaAccountsResponse,
  GetMessagesResponse,
  UpdateRequestStatusResponse,
} from '../types/api';

/**
 * Admin API calls.
 *
 * NOTE: These intentionally do NOT return mock/demo data on failure.
 * Returning fake data hides real errors (e.g. an expired auth token) and makes
 * the dashboard look populated when the backend is actually unreachable.
 * Errors are propagated so the pages can show a clear message.
 */
export const adminApi = {
  getDashboard: async (): Promise<GetDashboardResponse> => {
    const response = await apiClient.get<GetDashboardResponse>('/dashboard');
    return response.data;
  },

  getSystemTypes: async (): Promise<GetSystemTypesResponse> => {
    const response = await apiClient.get<GetSystemTypesResponse>('/system-types');
    return response.data;
  },

  getRequests: async (params?: GetRequestsQueryParams): Promise<GetRequestsResponse> => {
    const response = await apiClient.get<GetRequestsResponse>('/requests', { params });
    return response.data;
  },

  getSocialMediaAccounts: async (requestId: number): Promise<GetSocialMediaAccountsResponse> => {
    const response = await apiClient.get<GetSocialMediaAccountsResponse>(
      `/request/social-media-account/${requestId}`
    );
    return response.data;
  },

  getMessages: async (): Promise<GetMessagesResponse> => {
    const response = await apiClient.get<GetMessagesResponse>('/messages');
    return response.data;
  },

  completeRequest: async (requestId: number): Promise<UpdateRequestStatusResponse> => {
    const response = await apiClient.patch<UpdateRequestStatusResponse>(
      `/request/${requestId}/complete`
    );
    return response.data;
  },

  revertRequest: async (requestId: number): Promise<UpdateRequestStatusResponse> => {
    const response = await apiClient.patch<UpdateRequestStatusResponse>(
      `/request/${requestId}/revert`
    );
    return response.data;
  },
};
