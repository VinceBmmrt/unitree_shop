'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/store/auth.store';
import { updateProfile } from '@/lib/api/account';
import { Loader2, CheckCircle } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, 'Requis').max(50),
  lastName: z.string().max(50).optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, 'Format invalide')
    .optional()
    .or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm';

export default function ParametresPage() {
  const { user, isInitialized, setUser } = useAuthStore();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && !user) router.replace('/compte/connexion');
  }, [isInitialized, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName ?? '', phone: user.phone ?? '' });
    }
  }, [user, reset]);

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
      });
      setUser({ ...user!, firstName: data.firstName, lastName: data.lastName ?? user!.lastName });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setServerError('Impossible de mettre à jour le profil. Réessayez.');
    }
  }

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#04040a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#04040a] pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link
            href="/compte"
            className="text-sm text-slate-500 dark:text-zinc-500 hover:text-blue-500 transition-colors"
          >
            ← Mon compte
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">Paramètres</h1>
        </div>

        <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">
            Informations personnelles
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input {...register('firstName')} className={inputCls} />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                  Nom
                </label>
                <input {...register('lastName')} className={inputCls} />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                value={user.email}
                disabled
                className={`${inputCls} opacity-50 cursor-not-allowed`}
              />
              <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
                L&apos;email ne peut pas être modifié.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Téléphone
              </label>
              <input {...register('phone')} placeholder="+33 6 00 00 00 00" className={inputCls} />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            {saved && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Profil mis à jour.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
