const ACCESS_TOKEN_KEY = 'pc_access_token';
const REFRESH_TOKEN_KEY = 'pc_refresh_token';

function getStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage full or blocked — silent fail
  }
}

function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silent fail
  }
}

export const TokenService = {
  getAccessToken(): string | null {
    return getStorage(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    setStorage(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    return getStorage(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    setStorage(REFRESH_TOKEN_KEY, token);
  },

  clearTokens(): void {
    removeStorage(ACCESS_TOKEN_KEY);
    removeStorage(REFRESH_TOKEN_KEY);
  },

  hasTokens(): boolean {
    return !!(this.getAccessToken() || this.getRefreshToken());
  },
};

