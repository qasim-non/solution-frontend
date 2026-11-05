import { apiClient } from './client';
import {
  CreateProjectRequestPayload,
  CreateProjectRequestResponse,
  GetContactInfoResponse,
  SendContactMessageRequest,
  SendContactMessageResponse,
} from '../types/api';

/**
 * Customer (public) API calls.
 *
 * IMPORTANT: these do NOT return fake success responses on failure.
 * Returning a fake "request created" caused the UI to show the success page
 * even when the backend rejected the submission (e.g. HTTP 422), so the order
 * was silently never saved. Errors now propagate to the page, which shows
 * the real validation message.
 */
export const customerApi = {
  createProjectRequest: async (
    payload: CreateProjectRequestPayload
  ): Promise<CreateProjectRequestResponse> => {
    const response = await apiClient.post<CreateProjectRequestResponse>('/request', payload);
    return response.data;
  },

  sendContactMessage: async (
    payload: SendContactMessageRequest
  ): Promise<SendContactMessageResponse> => {
    const response = await apiClient.post<SendContactMessageResponse>('/message', payload);
    return response.data;
  },

  getContactInfo: async (): Promise<GetContactInfoResponse> => {
    const response = await apiClient.get<GetContactInfoResponse>('/contact');
    return response.data;
  },
};
