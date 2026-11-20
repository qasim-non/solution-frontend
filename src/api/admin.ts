import { apiClient } from './client';
import type {
  AdminCreateProjectRequestResponse,
  CreateProjectRequestPayload,
  DeleteDeveloperResponse,
  DeleteMessageResponse,
  DeleteRequestResponse,
  GetAuditAdminsResponse,
  GetAuditLogsQueryParams,
  GetAuditLogsResponse,
  GetDeveloperDetailsResponse,
  GetDeveloperPageOptionsResponse,
  GetDevelopersQueryParams,
  GetDevelopersResponse,
  GetDashboardResponse,
  GetMessagesQueryParams,
  GetMessagesResponse,
  GetNotificationsResponse,
  GetRequestPageOptionsResponse,
  GetRequestsQueryParams,
  GetRequestsResponse,
  GetUnreadCountResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  CreateDeveloperNoteRequest,
  CreateDeveloperNoteResponse,
  UpdateAdminAccountRequest,
  UpdateAdminAccountResponse,
  UpdateDeveloperReadinessRequest,
  UpdateDeveloperReadinessResponse,
  UpdateDeveloperStatusRequest,
  UpdateDeveloperStatusResponse,
  UpdateProjectRequestPayload,
  UpdateProjectRequestResponse,
  UpdateRequestStatusResponse,
} from '../types/api';

/**
 * Admin API calls.
 *
 * Errors are deliberately propagated so pages can surface real backend
 * validation/session errors instead of showing fake, populated screens.
 */
export const adminApi = {
  // Dashboard -------------------------------------------------------------
  getDashboard: async (): Promise<GetDashboardResponse> => {
    const response = await apiClient.get<GetDashboardResponse>('/dashboard');
    return response.data;
  },

  // Requests --------------------------------------------------------------
  getRequestPageOptions: async (): Promise<GetRequestPageOptionsResponse> => {
    const response = await apiClient.get<GetRequestPageOptionsResponse>(
      '/requests/page-options'
    );
    return response.data;
  },

  getRequests: async (
    params: GetRequestsQueryParams = {}
  ): Promise<GetRequestsResponse> => {
    const response = await apiClient.get<GetRequestsResponse>('/requests', {
      params,
    });
    return response.data;
  },

  createRequest: async (
    payload: CreateProjectRequestPayload
  ): Promise<AdminCreateProjectRequestResponse> => {
    const response = await apiClient.post<AdminCreateProjectRequestResponse>(
      '/requests',
      payload
    );
    return response.data;
  },

  updateRequest: async (
    id: number,
    payload: UpdateProjectRequestPayload
  ): Promise<UpdateProjectRequestResponse> => {
    const response = await apiClient.patch<UpdateProjectRequestResponse>(
      `/requests/${id}`,
      payload
    );
    return response.data;
  },

  updateRequestStatus: async (
    id: number,
    status: string
  ): Promise<UpdateRequestStatusResponse> => {
    const response = await apiClient.patch<UpdateRequestStatusResponse>(
      `/requests/${id}/status`,
      { status }
    );
    return response.data;
  },

  deleteRequest: async (id: number): Promise<DeleteRequestResponse> => {
    const response = await apiClient.delete<DeleteRequestResponse>(
      `/requests/${id}`
    );
    return response.data;
  },

  // Developers ------------------------------------------------------------
  getDeveloperPageOptions: async (): Promise<GetDeveloperPageOptionsResponse> => {
    const response = await apiClient.get<GetDeveloperPageOptionsResponse>(
      '/admin/developers/page-options'
    );
    return response.data;
  },

  getDevelopers: async (
    params: GetDevelopersQueryParams = {}
  ): Promise<GetDevelopersResponse> => {
    const response = await apiClient.get<GetDevelopersResponse>(
      '/admin/developers',
      { params }
    );
    return response.data;
  },

  getDeveloperDetails: async (
    id: number
  ): Promise<GetDeveloperDetailsResponse> => {
    const response = await apiClient.get<GetDeveloperDetailsResponse>(
      `/admin/developers/${id}`
    );
    return response.data;
  },

  updateDeveloperStatus: async (
    id: number,
    status: UpdateDeveloperStatusRequest['status']
  ): Promise<UpdateDeveloperStatusResponse> => {
    const response = await apiClient.put<UpdateDeveloperStatusResponse>(
      `/admin/developers/${id}/status`,
      { status } satisfies UpdateDeveloperStatusRequest
    );
    return response.data;
  },

  updateDeveloperReadiness: async (
    id: number,
    isReady: boolean
  ): Promise<UpdateDeveloperReadinessResponse> => {
    const response = await apiClient.put<UpdateDeveloperReadinessResponse>(
      `/admin/developers/${id}/readiness`,
      { is_ready: isReady } satisfies UpdateDeveloperReadinessRequest
    );
    return response.data;
  },

  addDeveloperNote: async (
    id: number,
    text: string
  ): Promise<CreateDeveloperNoteResponse> => {
    const response = await apiClient.post<CreateDeveloperNoteResponse>(
      `/admin/developers/${id}/notes`,
      { text } satisfies CreateDeveloperNoteRequest
    );
    return response.data;
  },

  deleteDeveloper: async (id: number): Promise<DeleteDeveloperResponse> => {
    const response = await apiClient.delete<DeleteDeveloperResponse>(
      `/admin/developers/${id}`
    );
    return response.data;
  },

  // Messages --------------------------------------------------------------
  getMessages: async (
    params: GetMessagesQueryParams = {}
  ): Promise<GetMessagesResponse> => {
    const response = await apiClient.get<GetMessagesResponse>('/messages', {
      params,
    });
    return response.data;
  },

  deleteMessage: async (id: number): Promise<DeleteMessageResponse> => {
    const response = await apiClient.delete<DeleteMessageResponse>(
      `/messages/${id}`
    );
    return response.data;
  },

  // Notifications ---------------------------------------------------------
  getNotifications: async (): Promise<GetNotificationsResponse> => {
    const response = await apiClient.get<GetNotificationsResponse>(
      '/notifications'
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<GetUnreadCountResponse> => {
    const response = await apiClient.get<GetUnreadCountResponse>(
      '/notifications/unread-count'
    );
    return response.data;
  },

  markNotificationRead: async (
    id: string
  ): Promise<MarkNotificationReadResponse> => {
    const response = await apiClient.patch<MarkNotificationReadResponse>(
      `/notifications/${encodeURIComponent(id)}/read`
    );
    return response.data;
  },

  markAllNotificationsRead: async (): Promise<MarkAllNotificationsReadResponse> => {
    const response = await apiClient.patch<MarkAllNotificationsReadResponse>(
      '/notifications/read-all'
    );
    return response.data;
  },

  // Audit logs ------------------------------------------------------------
  getAuditLogs: async (
    params: GetAuditLogsQueryParams = {}
  ): Promise<GetAuditLogsResponse> => {
    const response = await apiClient.get<GetAuditLogsResponse>(
      '/admin/audit-logs',
      { params }
    );
    return response.data;
  },

  getAuditAdmins: async (): Promise<GetAuditAdminsResponse> => {
    const response = await apiClient.get<GetAuditAdminsResponse>(
      '/admin/audit-logs/admins'
    );
    return response.data;
  },

  // Account ---------------------------------------------------------------
  updateAccount: async (
    payload: UpdateAdminAccountRequest
  ): Promise<UpdateAdminAccountResponse> => {
    const response = await apiClient.patch<UpdateAdminAccountResponse>(
      '/admin/account',
      payload
    );
    return response.data;
  },
};
