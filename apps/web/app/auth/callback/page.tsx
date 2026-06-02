'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/lib/store/auth.store';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_API_URL;

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('token');

    if (!token) {
      router.replace('/compte/connexion');
      return;
    }

    window.__unitreeAccessToken = token;

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data?.data ?? res.data;
        setUser(user, token);
        const redirect = sessionStorage.getItem('oauth_redirect');
        sessionStorage.removeItem('oauth_redirect');
        router.replace(redirect ?? '/');
      })
      .catch(() => {
        window.__unitreeAccessToken = undefined;
        setError(true);
        setTimeout(() => router.replace('/compte/connexion'), 2500);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#04040a] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-zinc-400 text-sm">Authentification échouée. Redirection…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04040a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      <p className="text-zinc-400 text-sm">Connexion en cours…</p>
    </div>
  );
}
