'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { AdminProduct } from '@/lib/api/admin';

const CATEGORIES = [
  'HUMANOID_ROBOT',
  'QUADRUPED_ROBOT',
  'ROBOTIC_ARM',
  'ACCESSORY',
  'SPARE_PART',
  'SOFTWARE_SUBSCRIPTION',
  'SERVICE_PLAN',
  'PERIPHERAL',
];

const CATEGORY_LABELS: Record<string, string> = {
  HUMANOID_ROBOT: 'Robot humanoïde',
  QUADRUPED_ROBOT: 'Robot quadrupède',
  ROBOTIC_ARM: 'Bras robotique',
  ACCESSORY: 'Accessoire',
  SPARE_PART: 'Pièce détachée',
  SOFTWARE_SUBSCRIPTION: 'Abonnement',
  SERVICE_PLAN: 'Plan service',
  PERIPHERAL: 'Périphérique',
};

const schema = z.object({
  sku: z.string().min(1, 'Requis'),
  name: z.string().min(1, 'Requis'),
  slug: z
    .string()
    .min(1, 'Requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
  shortDescription: z.string().optional(),
  description: z.string().min(1, 'Requis'),
  category: z.string().min(1, 'Requis'),
  basePrice: z.coerce.number().min(0, 'Prix invalide'),
  compareAtPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  leasePriceMonth: z.coerce.number().min(0).optional().or(z.literal('')),
  requiresQuote: z.boolean().default(false),
  isConfigurable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  tags: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof schema>;

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors text-sm';

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  submitLabel: string;
}

export function ProductForm({ defaultValues, onSubmit, submitLabel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      isActive: true,
      requiresQuote: false,
      isConfigurable: false,
      isFeatured: false,
      ...defaultValues,
    },
  });

  const name = watch('name');

  function autoSlug() {
    if (name) {
      setValue(
        'slug',
        name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      );
    }
  }

  function Field({
    label,
    error,
    required,
    children,
  }: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="SKU" error={errors.sku?.message} required>
          <input {...register('sku')} className={inputCls} placeholder="UT-XXX-001" />
        </Field>
        <Field label="Catégorie" error={errors.category?.message} required>
          <select {...register('category')} className={inputCls}>
            <option value="">Choisir…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Nom du produit" error={errors.name?.message} required>
        <input {...register('name')} className={inputCls} onBlur={autoSlug} />
      </Field>

      <Field label="Slug (URL)" error={errors.slug?.message} required>
        <input {...register('slug')} className={inputCls} placeholder="mon-produit" />
      </Field>

      <Field label="Description courte" error={errors.shortDescription?.message}>
        <input {...register('shortDescription')} className={inputCls} />
      </Field>

      <Field label="Description complète" error={errors.description?.message} required>
        <textarea {...register('description')} rows={4} className={inputCls} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Prix HT (€)" error={errors.basePrice?.message} required>
          <input {...register('basePrice')} type="number" step="0.01" className={inputCls} />
        </Field>
        <Field label="Prix barré (€)" error={errors.compareAtPrice?.message}>
          <input {...register('compareAtPrice')} type="number" step="0.01" className={inputCls} />
        </Field>
        <Field label="Loyer mensuel (€)" error={errors.leasePriceMonth?.message}>
          <input {...register('leasePriceMonth')} type="number" step="0.01" className={inputCls} />
        </Field>
      </div>

      <Field label="Image principale (URL)" error={errors.imageUrl?.message}>
        <input {...register('imageUrl')} className={inputCls} placeholder="https://..." />
      </Field>

      <Field label="Tags (séparés par des virgules)" error={errors.tags?.message}>
        <input {...register('tags')} className={inputCls} placeholder="robot, capteur, ROS2" />
      </Field>

      <div className="flex flex-wrap gap-6 pt-2">
        {[
          { key: 'requiresQuote', label: 'Sur devis' },
          { key: 'isConfigurable', label: 'Configurable' },
          { key: 'isFeatured', label: 'En vedette' },
          { key: 'isActive', label: 'Actif (visible)' },
        ].map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 cursor-pointer text-sm text-foreground"
          >
            <input
              type="checkbox"
              {...register(key as keyof ProductFormValues)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            {label}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
