import { apiClient } from './client';
import {
  DeveloperRegistrationPayload,
  DeveloperRegistrationResponse,
  GetCitiesResponse,
  GetDeveloperSpecializationsResponse,
} from '../types/api';

/**
 * Public developer-registration API calls.
 *
 * These endpoints do not require authentication. Errors are intentionally
 * propagated so the form can surface real validation messages instead of
 * showing a false success state.
 */
export const developerApi = {
  getCities: async (): Promise<GetCitiesResponse> => {
    const response = await apiClient.get<GetCitiesResponse>('/cities');
    return response.data;
  },

  getSpecializations: async (): Promise<GetDeveloperSpecializationsResponse> => {
    const response = await apiClient.get<GetDeveloperSpecializationsResponse>(
      '/developer-specializations'
    );
    return response.data;
  },

  /**
   * The registration endpoint accepts multipart/form-data because CV and
   * portfolio uploads are optional. The shared client defaults to JSON, so the
   * request explicitly declares multipart/form-data; Axios then lets the
   * browser append the multipart boundary.
   */
  register: async (
    payload: DeveloperRegistrationPayload,
    onUploadProgress?: (percentage: number) => void
  ): Promise<DeveloperRegistrationResponse> => {
    const formData = new FormData();

    formData.append('full_name', payload.full_name);
    formData.append('mobile', payload.mobile);
    formData.append('city_id', String(payload.city_id));
    formData.append('is_ready', payload.is_ready ? '1' : '0');
    formData.append('experience_years', payload.experience_years);
    formData.append(
      'has_institutional_experience',
      payload.has_institutional_experience ? '1' : '0'
    );
    formData.append('contract_type', payload.contract_type);
    formData.append('weekly_hours', payload.weekly_hours);
    formData.append('is_remote_ready', payload.is_remote_ready ? '1' : '0');

    if (payload.completed_projects_count !== undefined) {
      formData.append(
        'completed_projects_count',
        String(payload.completed_projects_count)
      );
    }

    if (payload.bio) {
      formData.append('bio', payload.bio);
    }

    payload.specialization_ids?.forEach((id, index) => {
      formData.append(`specialization_ids[${index}]`, String(id));
    });

    payload.technologies?.forEach((technology, index) => {
      formData.append(`technologies[${index}]`, technology);
    });

    if (payload.cv) {
      formData.append('cv', payload.cv);
    }

    if (payload.portfolio) {
      formData.append('portfolio', payload.portfolio);
    }

    const response = await apiClient.post<DeveloperRegistrationResponse>(
      '/developers',
      formData,
      {
        // The shared client defaults to application/json, which makes Axios
        // JSON-serialize a FormData body (files become empty objects). Declaring
        // multipart/form-data keeps the body intact; the browser then appends the
        // boundary itself.
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (onUploadProgress && event.total) {
            onUploadProgress(
              Math.min(100, Math.round((event.loaded / event.total) * 100))
            );
          }
        },
      }
    );

    return response.data;
  },
};
