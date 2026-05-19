import { create } from 'zustand';
import axios from 'axios';
import { User } from '@unitree/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null, accessToken?: string) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user, accessToken) => {
    if (typeof window !== 'undefined' && accessToken) {
      window.__unitreeAccessToken = accessToken;
    }
    set({ user });
  },

  logout: async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: window.__unitreeAccessToken
            ? { Authorization: `Bearer ${window.__unitreeAccessToken}` }
            : undefined,
          withCredentials: true,
        },
      );
    } catch {}
    if (typeof window !== 'undefined') {
      window.__unitreeAccessToken = undefined;
    }
    set({ user: null });
  },

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const refreshRes = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const accessToken: string =
        refreshRes.data?.data?.accessToken ?? refreshRes.data?.accessToken;

      if (!accessToken) throw new Error('No access token in refresh response');
      window.__unitreeAccessToken = accessToken;

      const meRes = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user: User = meRes.data?.data ?? meRes.data;
      set({ user, isLoading: false, isInitialized: true });
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },
}));
