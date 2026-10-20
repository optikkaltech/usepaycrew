import { http } from './http.service';

export const AuthService = {
  login: async (credentials: { email: string; password: string; twoFactorToken?: string; turnstileToken?: string }) => {
    return http.post('/auth/login', credentials);
  },
  register: async (payload: { fullName: string; companyName: string; email: string; password: string; turnstileToken?: string }) => {
    return http.post('/auth/register', payload);
  },
  getMe: async () => {
    return http.get('/auth/me');
  },
  getGoogleAuthUrl: async (redirectUri: string) => {
    return http.get(`/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`);
  },
  exchangeGoogleCode: async (payload: { code: string; redirectUri: string; role?: string }) => {
    return http.post('/auth/google', payload);
  },
  logout: async () => {
    try {
      await http.post('/auth/logout');
    } catch (_) {}
  },
};
