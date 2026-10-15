import { TokenService } from './token.service';

const API_BASE =
  typeof window !== 'undefined'
    ? '/api/proxy'
    : process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  let url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined) searchParams.append(key, String(val));
    });
    const qs = searchParams.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = TokenService.getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers,
  });

  // Handle Token Refresh on 401
  if (response.status === 401 && TokenService.getRefreshToken()) {
    const refreshToken = TokenService.getRefreshToken();
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const newAccess = refreshData.data?.accessToken;
        if (newAccess) {
          TokenService.setAccessToken(newAccess);
          headers.set('Authorization', `Bearer ${newAccess}`);
          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      } else {
        TokenService.clearTokens();
      }
    } catch {
      TokenService.clearTokens();
    }
  }

  const rawText = await response.text();
  let data: any = {};
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { message: rawText || `Request failed with status ${response.status}` };
  }

  if (!response.ok) {
    const message =
      (Array.isArray(data.message) ? data.message.join(', ') : data.message) ||
      data.error ||
      rawText ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data.data !== undefined ? data.data : data;
}

export const http = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
