import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'pc_at';
const REFRESH_TOKEN_KEY = 'pc_rt';

let memoryAccessToken: string | null = null;

export const TokenService = {
  getAccessToken(): string | null {
    if (memoryAccessToken) return memoryAccessToken;
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  },

  setAccessToken(token: string): void {
    memoryAccessToken = token;
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: 1 / 96, // 15 mins
    });
  },

  getRefreshToken(): string | null {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  setRefreshToken(token: string): void {
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: 7, // 7 days
    });
  },

  clearTokens(): void {
    memoryAccessToken = null;
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  hasTokens(): boolean {
    return !!(this.getAccessToken() || this.getRefreshToken());
  },
};
