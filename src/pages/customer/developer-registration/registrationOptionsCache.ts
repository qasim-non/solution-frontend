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

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isNamedList = (
  value: unknown,
  requireSlug = false
): value is Array<{ id: number; name: string; slug?: string }> =>
  Array.isArray(value) &&
  value.every((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const entry = item as Record<string, unknown>;

    return (
      typeof entry.id === 'number' &&
      typeof entry.name === 'string' &&
      (!requireSlug || typeof entry.slug === 'string')
    );
  });

const isBooleanArray = (value: unknown): value is boolean[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'boolean');

const isValidOptions = (
  value: unknown
): value is DeveloperRegistrationOptions => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const options = value as Record<string, unknown>;
  const booleanOptions = options.boolean_options;

  if (!booleanOptions || typeof booleanOptions !== 'object') {
    return false;
  }

  const booleans = booleanOptions as Record<string, unknown>;

  return (
    isNamedList(options.cities) &&
    isNamedList(options.specializations, true) &&
    isStringArray(options.experience_years) &&
    isStringArray(options.contract_types) &&
    isStringArray(options.weekly_hours) &&
    isBooleanArray(booleans.is_ready) &&
    isBooleanArray(booleans.has_institutional_experience) &&
    isBooleanArray(booleans.is_remote_ready)
  );
};

/**
 * Reads the last successful lookup response from localStorage. Any storage,
 * parsing, shape, or expiry problem falls back to `undefined` so React Query
 * fetches fresh data instead of rendering a broken form.
 */
const readStoredOptions = (): StoredRegistrationOptions | undefined => {
  try {
    if (typeof window === 'undefined') {
      return undefined;
    }

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
    if (typeof window === 'undefined') {
      return;
    }

    const stored: StoredRegistrationOptions = { data, savedAt: Date.now() };
    window.localStorage.setItem(
      REGISTRATION_OPTIONS_STORAGE_KEY,
      JSON.stringify(stored)
    );
  } catch {
    // Ignore storage failures; the query cache still holds the options.
  }
};

/** Called by the shared cache-invalidation helper. */
export const clearCachedRegistrationOptions = (): void => {
  try {
    window.localStorage.removeItem(REGISTRATION_OPTIONS_STORAGE_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
};
