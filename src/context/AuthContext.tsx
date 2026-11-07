import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { storage } from '../utils/storage';
import { authApi } from '../api/auth';
import type { LoginRequest } from '../types/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredAccessToken = (): string | null => {
  const accessToken = storage.getAccessToken();
  const refreshToken = storage.getRefreshToken();

  // A single legacy access token cannot be refreshed or safely treated as a
  // complete session, so require the new access/refresh pair.
  if (!accessToken || !refreshToken) {
    storage.removeTokens();
    return null;
  }

  return accessToken;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getStoredAccessToken);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setToken(getStoredAccessToken());
    setIsLoading(false);

    const onUnauthorized = () => setToken(null);
    const onTokensUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ accessToken: string }>;
      setToken(customEvent.detail.accessToken);
    };

    window.addEventListener('auth:unauthorized', onUnauthorized);
    window.addEventListener('auth:tokens-updated', onTokensUpdated);

    return () => {
      window.removeEventListener('auth:unauthorized', onUnauthorized);
      window.removeEventListener('auth:tokens-updated', onTokensUpdated);
    };
  }, []);

  const login = async (
    credentials: LoginRequest,
    rememberMe: boolean,
  ): Promise<void> => {
    const tokens = await authApi.login(credentials);

    if (!tokens.token || !tokens.refresh_token) {
      throw new Error('The login endpoint did not return both tokens.');
    }

    storage.setTokens(tokens.token, tokens.refresh_token, rememberMe);
    setToken(tokens.token);
  };

  const logout = async (): Promise<void> => {
    try {
      // The backend revokes the complete token session, not just the browser token.
      await authApi.logout();
    } finally {
      storage.removeTokens();
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token && storage.getRefreshToken()),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
