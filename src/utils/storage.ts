/**
 * Stores the admin access/refresh token pair.
 *
 * "Remember me" uses localStorage. Otherwise, sessionStorage is used so the
 * session is discarded when the browser tab/session is closed.
 */
const ACCESS_TOKEN_KEY = 'tamkkun_admin_access_token';
const REFRESH_TOKEN_KEY = 'tamkkun_admin_refresh_token';
const LEGACY_TOKEN_KEY = 'tamkkun_admin_token';

const getActiveStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
    window.localStorage.getItem(REFRESH_TOKEN_KEY)
  ) {
    return window.localStorage;
  }

  if (
    window.sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
    window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
  ) {
    return window.sessionStorage;
  }

  return null;
};

export const storage = {
  getAccessToken: (): string | null =>
    getActiveStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null,

  getRefreshToken: (): string | null =>
    getActiveStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null,

  setTokens: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
  ): void => {
    if (typeof window === 'undefined') {
      return;
    }

    storage.removeTokens();

    const target = rememberMe ? window.localStorage : window.sessionStorage;
    target.setItem(ACCESS_TOKEN_KEY, accessToken);
    target.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  /**
   * Replaces a rotated token pair while preserving the user's storage choice.
   */
  replaceTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') {
      return;
    }

    const target = getActiveStorage() ?? window.sessionStorage;
    target.setItem(ACCESS_TOKEN_KEY, accessToken);
    target.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  removeTokens: (): void => {
    if (typeof window === 'undefined') {
      return;
    }

    for (const target of [window.localStorage, window.sessionStorage]) {
      target.removeItem(ACCESS_TOKEN_KEY);
      target.removeItem(REFRESH_TOKEN_KEY);
      target.removeItem(LEGACY_TOKEN_KEY);
    }
  },

  // Backwards-compatible access-token accessor for any remaining callers.
  getToken: (): string | null => storage.getAccessToken(),
};
