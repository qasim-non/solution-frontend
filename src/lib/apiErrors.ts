import type { ApiErrorResponse } from '../types/api';

interface ApiErrorLike {
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
  message?: string;
}

const asApiError = (error: unknown): ApiErrorLike | null =>
  error && typeof error === 'object' ? (error as ApiErrorLike) : null;

export const getApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  const apiError = asApiError(error);
  return apiError?.response?.data?.message || apiError?.message || fallback;
};

export const getApiErrorStatus = (error: unknown): number | undefined =>
  asApiError(error)?.response?.status;

export const isConflictError = (error: unknown): boolean =>
  getApiErrorStatus(error) === 409;

export const getValidationErrors = (
  error: unknown
): Record<string, string[]> => asApiError(error)?.response?.data?.errors ?? {};
