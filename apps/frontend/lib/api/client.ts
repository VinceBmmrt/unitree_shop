import axios from 'axios';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 3_000,
  headers: { 'Content-Type': 'application/json' },
});

// Client-side only: attach access token from memory (not localStorage — XSS risk)
// Token is stored in memory via auth store; refresh uses httpOnly cookie
if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use((config) => {
    const token = window.__unitreeAccessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Single in-flight refresh promise — prevents concurrent 401s from each
  // triggering their own refresh, which would rotate the token multiple times.
  let refreshPromise: Promise<string> | null = null;

  apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
              .then((res) => {
                const token: string = res.data?.data?.accessToken ?? res.data?.accessToken;
                if (!token) throw new Error('No token in refresh response');
                return token;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }
          const accessToken = await refreshPromise;
          window.__unitreeAccessToken = accessToken;
          original.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(original);
        } catch {
          window.__unitreeAccessToken = undefined;
          window.location.href = '/compte/connexion';
        }
      }

      return Promise.reject(error);
    },
  );
}

declare global {
  interface Window {
    __unitreeAccessToken?: string;
  }
}

// Allow Next.js ISR `next` option to be passed via Axios config
declare module 'axios' {
  interface AxiosRequestConfig {
    next?: { revalidate?: number | false; tags?: string[] };
  }
}
