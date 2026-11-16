import type { DeveloperRegistrationOptions } from '../../../types/api';

export const REGISTRATION_OPTIONS_STORAGE_KEY =
  'tamkkun_developer_registration_options';

/**
 * Lookups change rarely, so a day-old cached copy is still accurate enough for
 * a form that submits server-side validation anyway. After this window the
 * cached copy is discarded and the endpoint is called again.
 */
export const REGISTRATION_OPTIONS_TTL_MS = 24 * 60 * 60 * 1000;

interface StoredRegistrationOptions {
  data: DeveloperRegistrationOptions;
  savedAt: number;
}

const isValidOptions = (
  value: unknown
): value is DeveloperRegistrationOptions => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const options = value as Partial<DeveloperRegistrationOptions>;

  return (
    Array.isArray(options.cities) &&
    Array.isArray(options.specializations)
  );
};

/**
 * Reads the last successful lookup response from localStorage. Any storage,
 * parsing, shape, or expiry problem falls back to `undefined` so React Query
 * fetches fresh data instead of rendering a broken form.
 */
const readStoredOptions = (): StoredRegistrationOptions | undefined => {
  try {
    const raw = window.localStorage.getItem(REGISTRATION_OPTIONS_STORAGE_KEY);

    if (!raw) {
      return undefined;
    }

    const stored = JSON.parse(raw) as Partial<StoredRegistrationOptions>;

    if (
      typeof stored.savedAt !== 'number' ||
      !isValidOptions(stored.data)
    ) {
      return undefined;
    }

    if (Date.now() - stored.savedAt > REGISTRATION_OPTIONS_TTL_MS) {
      window.localStorage.removeItem(REGISTRATION_OPTIONS_STORAGE_KEY);
      return undefined;
    }

    return { data: stored.data, savedAt: stored.savedAt };
  } catch {
    return undefined;
  }
};

export const readCachedRegistrationOptions = ():
  | DeveloperRegistrationOptions
  | undefined => readStoredOptions()?.data;

/**
 * The moment the cached copy was saved, so React Query can keep counting the
 * TTL from then instead of treating a mount as a fresh fetch.
 */
export const readCachedRegistrationOptionsUpdatedAt = ():
  | number
  | undefined => readStoredOptions()?.savedAt;

/**
 * Persists the latest successful lookup response. Storage can be unavailable
 * (private mode, quota); in that case the in-memory React Query cache still
 * works for the current visit.
 */
export const writeCachedRegistrationOptions = (
  data: DeveloperRegistrationOptions
): void => {
  try {
    const stored: StoredRegistrationOptions = { data, savedAt: Date.now() };
    window.localStorage.setItem(
      REGISTRATION_OPTIONS_STORAGE_KEY,
      JSON.stringify(stored)
    );
  } catch {
    // Ignore storage failures; the query cache still holds the options.
  }
};
