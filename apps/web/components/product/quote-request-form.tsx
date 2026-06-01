'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Plus, Minus, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

const schema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone requis'),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  country: z.string().default('France'),
  useCase: z.string().max(2000).optional(),
  timeline: z.string().optional(),
  budget: z.number().min(0).optional(),
  requestsFinancing: z.boolean().default(false),
  preferredContact: z.enum(['email', 'phone', 'visio']).optional(),
  additionalNotes: z.string().max(2000).optional(),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().min(1),
      }),
    )
    .min(1, 'Sélectionnez au moins un produit'),
});

type FormValues = z.infer<typeof schema>;

interface Product {
  id: string;
  name: string;
  category: string;
  requiresQuote: boolean;
  basePrice: number;
}

interface Props {
  products: Product[];
  preselectedProductId?: string;
  preselectedConfigId?: string;
}

export function QuoteRequestForm({ products, preselectedProductId, preselectedConfigId }: Props) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [quoteNumber, setQuoteNumber] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: 'France',
      requestsFinancing: false,
      items: preselectedProductId
        ? [{ productId: preselectedProductId, quantity: 1, configurationId: preselectedConfigId } as any]
        : [],
    },
  });

  const selectedItems = watch('items') ?? [];

  function addProduct(productId: string) {
    const existing = selectedItems.find((i) => i.productId === productId);
    if (existing) {
      setValue(
        'items',
        selectedItems.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setValue('items', [...selectedItems, { productId, quantity: 1 }]);
    }
  }

  function removeProduct(productId: string) {
    setValue('items', selectedItems.filter((i) => i.productId !== productId));
  }

  function adjustQuantity(productId: string, delta: number) {
    setValue(
      'items',
      selectedItems
        .map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  async function onSubmit(data: FormValues) {
    try {
      const res = await apiClient.post('/quotes/request', data);
      setQuoteNumber(res.data.data.quoteNumber);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-10 text-center max-w-lg mx-auto"
      >
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold">Demande envoyée !</h2>
        <p className="text-muted-foreground mt-2">Numéro de devis : <strong>{quoteNumber}</strong></p>
        <p className="text-muted-foreground mt-3 text-sm">
          Notre équipe vous contactera dans les 48h ouvrées pour discuter de votre projet.
          Un email de confirmation vient de vous être envoyé.
        </p>
      </motion.div>
    );
  }

  const quotableProducts = products.filter((p) => p.requiresQuote);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Product selection */}
      <section>
        <h2 className="font-display font-semibold text-xl mb-1">
          1. Produits souhaités
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Sélectionnez les robots et systèmes qui vous intéressent.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {quotableProducts.map((product) => {
            const selected = selectedItems.find((i) => i.productId === product.id);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => selected ? removeProduct(product.id) : addProduct(product.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border hover:border-border/80 hover:bg-muted/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.category.replace(/_/g, ' ')}
                    </p>
                  </div>
                  {selected && (
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); adjustQuantity(product.id, -1); }}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center bg-background"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm tabular-nums">{selected.quantity}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); adjustQuantity(product.id, 1); }}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center bg-background"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {errors.items && (
          <p className="text-sm text-destructive">{errors.items.message}</p>
        )}
      </section>

      {/* Contact information */}
      <section>
        <h2 className="font-display font-semibold text-xl mb-5">2. Vos coordonnées</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom *" error={errors.firstName?.message}>
            <input {...register('firstName')} placeholder="Jean" className={inputCls} />
          </Field>
          <Field label="Nom *" error={errors.lastName?.message}>
            <input {...register('lastName')} placeholder="Dupont" className={inputCls} />
          </Field>
          <Field label="Email professionnel *" error={errors.email?.message}>
            <input {...register('email')} type="email" placeholder="j.dupont@entreprise.fr" className={inputCls} />
          </Field>
          <Field label="Téléphone *" error={errors.phone?.message}>
            <input {...register('phone')} type="tel" placeholder="+33 6 12 34 56 78" className={inputCls} />
          </Field>
          <Field label="Entreprise / Organisation" error={undefined}>
            <input {...register('companyName')} placeholder="Acme Robotics" className={inputCls} />
          </Field>
          <Field label="Fonction" error={undefined}>
            <input {...register('jobTitle')} placeholder="Directeur R&D" className={inputCls} />
          </Field>
        </div>
      </section>

      {/* Project context */}
      <section>
        <h2 className="font-display font-semibold text-xl mb-5">3. Votre projet</h2>
        <div className="space-y-4">
          <Field label="Cas d'usage" error={undefined}>
            <textarea
              {...register('useCase')}
              rows={4}
              placeholder="Décrivez votre application : inspection industrielle, recherche académique, démonstration, etc."
              className={`${inputCls} resize-none`}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Délai souhaité" error={undefined}>
              <input
                {...register('timeline')}
                placeholder="ex: Q3 2025, ASAP, Pas de contrainte"
                className={inputCls}
              />
            </Field>
            <Field label="Budget indicatif (€ HT)" error={undefined}>
              <input
                {...register('budget', { valueAsNumber: true })}
                type="number"
                min={0}
                step={1000}
                placeholder="50000"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-border">
            <input
              {...register('requestsFinancing')}
              type="checkbox"
              id="financing"
              className="mt-0.5 rounded border-border"
            />
            <label htmlFor="financing" className="text-sm cursor-pointer">
              <span className="font-medium">Je suis intéressé par une solution de financement / leasing</span>
              <span className="block text-muted-foreground text-xs mt-0.5">
                Notre équipe vous présentera les options disponibles.
              </span>
            </label>
          </div>

          <Field label="Comment souhaitez-vous être contacté ?" error={undefined}>
            <select {...register('preferredContact')} className={inputCls}>
              <option value="">Indifférent</option>
              <option value="email">Email</option>
              <option value="phone">Téléphone</option>
              <option value="visio">Visioconférence</option>
            </select>
          </Field>

          <Field label="Informations complémentaires" error={undefined}>
            <textarea
              {...register('additionalNotes')}
              rows={3}
              placeholder="Questions spécifiques, contraintes techniques, intégrations existantes..."
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>
      </section>

      {/* GDPR + Submit */}
      <section className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border">
          <Controller
            name="gdprConsent"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="gdpr"
                className="mt-0.5 rounded border-border"
                checked={field.value === true}
                onChange={(e) => field.onChange(e.target.checked ? true : (undefined as any))}
              />
            )}
          />
          <label htmlFor="gdpr" className="text-sm cursor-pointer">
            J&apos;accepte que mes données soient utilisées pour traiter ma demande de devis,
            conformément à la{' '}
            <a href="/privacy" className="text-primary hover:underline" target="_blank">
              politique de confidentialité
            </a>{' '}
            d&apos;Unitree Robotics (RGPD). *
          </label>
        </div>
        {errors.gdprConsent && (
          <p className="text-sm text-destructive">{errors.gdprConsent.message}</p>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Une erreur s&apos;est produite. Veuillez réessayer ou nous contacter directement.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer la demande de devis'
          )}
        </button>
        <p className="text-xs text-center text-muted-foreground">
          Réponse garantie sous 48h ouvrées · Sans engagement
        </p>
      </section>
    </form>
  );
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/20 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
