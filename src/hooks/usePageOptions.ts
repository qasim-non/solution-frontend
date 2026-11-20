import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import { customerApi } from '../api/customer';
import { developerApi } from '../api/developers';
import { queryKeys } from '../lib/queryKeys';
import {
  clearCachedRegistrationOptions,
  readCachedRegistrationOptions,
  readCachedRegistrationOptionsUpdatedAt,
  writeCachedRegistrationOptions,
} from '../pages/customer/developer-registration/registrationOptionsCache';
import type {
  DeveloperPageOptions,
  DeveloperRegistrationOptions,
  PublicStatistics,
  RequestPageOptions,
  SystemType,
} from '../types/api';

/**
 * Option lists are stable lookup data. Keeping them fresh for a full day and
 * garbage-collecting them after a week avoids needless requests without
 * risking stale records or user-specific state.
 */
export const PAGE_OPTIONS_STALE_TIME = 24 * 60 * 60 * 1000;
export const PAGE_OPTIONS_GC_TIME = 7 * 24 * 60 * 60 * 1000;

/** Aggregate counters change often, so they use a much shorter window. */
const STATISTICS_STALE_TIME = 5 * 60 * 1000;
const STATISTICS_GC_TIME = 30 * 60 * 1000;

export const usePublicSystemTypes = () =>
  useQuery({
    queryKey: queryKeys.public.systemTypes,
    queryFn: async (): Promise<SystemType[]> => {
      const response = await customerApi.getSystemTypes();
      return response.data;
    },
    staleTime: PAGE_OPTIONS_STALE_TIME,
    gcTime: PAGE_OPTIONS_GC_TIME,
  });

export const usePublicStatistics = () =>
  useQuery({
    queryKey: queryKeys.public.statistics,
    queryFn: async (): Promise<PublicStatistics> => {
      const response = await customerApi.getPublicStatistics();
      return response.data;
    },
    staleTime: STATISTICS_STALE_TIME,
    gcTime: STATISTICS_GC_TIME,
  });

export const useDeveloperRegistrationOptions = () =>
  useQuery({
    queryKey: queryKeys.public.developerRegistrationOptions,
    queryFn: async (): Promise<DeveloperRegistrationOptions> => {
      const response = await developerApi.getRegistrationOptions();
      writeCachedRegistrationOptions(response.data);
      return response.data;
    },
    initialData: readCachedRegistrationOptions,
    initialDataUpdatedAt: readCachedRegistrationOptionsUpdatedAt,
    staleTime: PAGE_OPTIONS_STALE_TIME,
    gcTime: PAGE_OPTIONS_GC_TIME,
  });

export const useRequestPageOptions = () =>
  useQuery({
    queryKey: queryKeys.admin.requestPageOptions,
    queryFn: async (): Promise<RequestPageOptions> => {
      const response = await adminApi.getRequestPageOptions();
      return response.data;
    },
    staleTime: PAGE_OPTIONS_STALE_TIME,
    gcTime: PAGE_OPTIONS_GC_TIME,
  });

export const useDeveloperPageOptions = () =>
  useQuery({
    queryKey: queryKeys.admin.developerPageOptions,
    queryFn: async (): Promise<DeveloperPageOptions> => {
      const response = await adminApi.getDeveloperPageOptions();
      return response.data;
    },
    staleTime: PAGE_OPTIONS_STALE_TIME,
    gcTime: PAGE_OPTIONS_GC_TIME,
  });

/**
 * Explicit refresh for every long-lived option cache. User-specific and
 * frequently changing data is deliberately excluded.
 */
export const useInvalidatePageOptions = () => {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    clearCachedRegistrationOptions();

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.requestPageOptions,
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.developerPageOptions,
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.public.developerRegistrationOptions,
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.public.systemTypes,
      }),
    ]);
  }, [queryClient]);
};
