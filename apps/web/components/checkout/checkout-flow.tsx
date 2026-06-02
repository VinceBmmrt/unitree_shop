'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { Loader2, AlertCircle, ChevronLeft, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { env } from '@/lib/env';
import { createAddress, createOrder, createPaymentIntent } from '@/lib/api/checkout';

const stripePromise = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

const contactSchema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  isEnterprise: z.boolean().default(false),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
});

const shippingSchema = z.object({
  line1: z.string().min(1, 'Requis'),
  line2: z.string().optional(),
  city: z.string().min(1, 'Requis'),
  postalCode: z.string().min(4, 'Code postal invalide'),
  country: z.string().min(2, 'Requis'),
  phone: z.string().optional(),
});

type ContactValues = z.infer<typeof contactSchema>;
type ShippingValues = z.infer<typeof shippingSchema>;
type Step = 'contact' | 'livraison' | 'recapitulatif' | 'paiement';

const STEPS: Step[] = ['contact', 'livraison', 'recapitulatif', 'paiement'];
const STEP_LABELS: Record<Step, string> = {
  contact: 'Contact',
  livraison: 'Livraison',
  recapitulatif: 'Récapitulatif',
  paiement: 'Paiement',
};

const COUNTRY_OPTIONS = [
  { label: 'France', code: 'FR' },
  { label: 'Belgique', code: 'BE' },
  { label: 'Suisse', code: 'CH' },
  { label: 'Luxembourg', code: 'LU' },
];

function PaymentStepInner({
  orderId,
  total,
  onError,
}: {
  orderId: string;
  total: number;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    setIsSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
      },
    });
    if (error) {
      onError(error.message ?? 'Le paiement a échoué. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PaymentElement />
      <button
        onClick={handlePay}
        disabled={isSubmitting || !stripe}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Traitement en cours…
          </>
        ) : (
          `Payer ${fmt(total)}`
        )}
      </button>
    </div>
  );
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
      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm disabled:opacity-60';

export function CheckoutFlow() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { user, isInitialized } = useAuthStore();
  const { items, subtotal } = useCartStore();

  const [step, setStep] = useState<Step>('contact');
  const [contactData, setContactData] = useState<ContactValues | null>(null);
  const [shippingAddressId, setShippingAddressId] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<ShippingValues | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/compte/connexion?redirect=/checkout');
    }
  }, [isInitialized, user, router]);

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      isEnterprise: false,
    },
  });

  const shippingForm = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { country: 'FR' },
  });

  const isEnterprise = contactForm.watch('isEnterprise');
  const currentStepIndex = STEPS.indexOf(step);

  const subtotalHT = subtotal();
  const tva = subtotalHT * 0.2;
  const shipping = subtotalHT >= 5000 ? 0 : 150;
  const total = subtotalHT + tva + shipping;

  const stripeOptions = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            locale: 'fr' as const,
            appearance: {
              theme: (resolvedTheme === 'dark' ? 'night' : 'stripe') as 'night' | 'stripe',
              variables: {
                colorPrimary: '#3b82f6',
                colorBackground: resolvedTheme === 'dark' ? '#06060f' : '#ffffff',
                colorText: resolvedTheme === 'dark' ? '#f0f0f8' : '#0f172a',
                borderRadius: '12px',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            },
          }
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clientSecret],
  );

  function handleContactSubmit(data: ContactValues) {
    setContactData(data);
    setStep('livraison');
  }

  async function handleShippingSubmit(data: ShippingValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const address = await createAddress({
        firstName: contactData!.firstName,
        lastName: contactData!.lastName,
        company: contactData?.isEnterprise ? contactData.companyName : undefined,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone ?? contactData?.phone,
      });
      setShippingAddressId(address.id);
      setShippingData(data);
      setStep('recapitulatif');
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Impossible de sauvegarder l'adresse.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProceedToPayment() {
    setIsSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          configurationId: i.configurationId,
          quantity: i.quantity,
        })),
        shippingAddressId: shippingAddressId!,
      });
      const { clientSecret: secret } = await createPaymentIntent(order.id);
      setOrderId(order.id);
      setOrderTotal(order.total ?? total);
      setClientSecret(secret);
      setStep('paiement');
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Impossible de créer la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isInitialized || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0 && step !== 'paiement') {
    return (
      <div className="text-center py-20">
        <Package className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">Votre panier est vide.</p>
        <a href="/accessoires" className="text-primary hover:underline text-sm">
          Voir les accessoires →
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-3">
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < currentStepIndex && step !== 'paiement' && setStep(s)}
                disabled={i >= currentStepIndex || step === 'paiement'}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                  i < currentStepIndex
                    ? 'bg-primary text-primary-foreground cursor-pointer'
                    : i === currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-default'
                }`}
              >
                {i < currentStepIndex ? '✓' : i + 1}
              </button>
              <span
                className={`text-sm hidden sm:block ${i === currentStepIndex ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
              >
                {STEP_LABELS[s]}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px w-6 mx-1 transition-colors ${i < currentStepIndex ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-6 rounded-xl bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {step === 'contact' && (
              <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-5">
                <h2 className="text-xl font-semibold text-foreground mb-1">Vos coordonnées</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Prénom"
                    required
                    error={contactForm.formState.errors.firstName?.message}
                  >
                    <input
                      {...contactForm.register('firstName')}
                      className={inputCls}
                      placeholder="Jean"
                      autoComplete="given-name"
                    />
                  </Field>
                  <Field
                    label="Nom"
                    required
                    error={contactForm.formState.errors.lastName?.message}
                  >
                    <input
                      {...contactForm.register('lastName')}
                      className={inputCls}
                      placeholder="Dupont"
                      autoComplete="family-name"
                    />
                  </Field>
                </div>
                <Field label="Email" error={contactForm.formState.errors.email?.message}>
                  <input
                    {...contactForm.register('email')}
                    className={`${inputCls} cursor-not-allowed`}
                    disabled
                    autoComplete="email"
                  />
                </Field>
                <Field label="Téléphone" error={contactForm.formState.errors.phone?.message}>
                  <input
                    {...contactForm.register('phone')}
                    className={inputCls}
                    placeholder="+33 6 12 34 56 78"
                    autoComplete="tel"
                  />
                </Field>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...contactForm.register('isEnterprise')}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-zinc-300">
                    Commander pour une entreprise
                  </span>
                </label>
                {isEnterprise && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Raison sociale"
                      error={contactForm.formState.errors.companyName?.message}
                    >
                      <input
                        {...contactForm.register('companyName')}
                        className={inputCls}
                        placeholder="Acme SA"
                        autoComplete="organization"
                      />
                    </Field>
                    <Field
                      label="N° TVA intracommunautaire"
                      error={contactForm.formState.errors.taxId?.message}
                    >
                      <input
                        {...contactForm.register('taxId')}
                        className={inputCls}
                        placeholder="FR12345678901"
                      />
                    </Field>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Continuer vers la livraison
                </button>
              </form>
            )}

            {step === 'livraison' && (
              <form
                onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 mb-1">
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-foreground">Adresse de livraison</h2>
                </div>
                <Field
                  label="Adresse"
                  required
                  error={shippingForm.formState.errors.line1?.message}
                >
                  <input
                    {...shippingForm.register('line1')}
                    className={inputCls}
                    placeholder="42 rue de la Paix"
                    autoComplete="address-line1"
                  />
                </Field>
                <Field
                  label="Complément d'adresse"
                  error={shippingForm.formState.errors.line2?.message}
                >
                  <input
                    {...shippingForm.register('line2')}
                    className={inputCls}
                    placeholder="Bâtiment B, Appartement 12"
                    autoComplete="address-line2"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Code postal"
                    required
                    error={shippingForm.formState.errors.postalCode?.message}
                  >
                    <input
                      {...shippingForm.register('postalCode')}
                      className={inputCls}
                      placeholder="75001"
                      autoComplete="postal-code"
                    />
                  </Field>
                  <Field label="Ville" required error={shippingForm.formState.errors.city?.message}>
                    <input
                      {...shippingForm.register('city')}
                      className={inputCls}
                      placeholder="Paris"
                      autoComplete="address-level2"
                    />
                  </Field>
                </div>
                <Field label="Pays" required error={shippingForm.formState.errors.country?.message}>
                  <select {...shippingForm.register('country')} className={inputCls}>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Téléphone de livraison"
                  error={shippingForm.formState.errors.phone?.message}
                >
                  <input
                    {...shippingForm.register('phone')}
                    className={inputCls}
                    placeholder="+33 6 12 34 56 78"
                    autoComplete="tel"
                    defaultValue={contactData?.phone ?? ''}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Continuer vers le récapitulatif
                </button>
              </form>
            )}

            {step === 'recapitulatif' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-1">
                  <button
                    type="button"
                    onClick={() => setStep('livraison')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-foreground">Récapitulatif</h2>
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
                    >
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-muted flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-foreground">
                          {fmt(item.unitPrice * item.quantity)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {fmt(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {shippingData && (
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Adresse de livraison
                    </p>
                    <p className="text-sm text-foreground">
                      {contactData?.firstName} {contactData?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{shippingData.line1}</p>
                    {shippingData.line2 && (
                      <p className="text-sm text-muted-foreground">{shippingData.line2}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {shippingData.postalCode} {shippingData.city},{' '}
                      {COUNTRY_OPTIONS.find((c) => c.code === shippingData.country)?.label ??
                        shippingData.country}
                    </p>
                  </div>
                )}
                {/* Droit de rétractation — French consumer law (art. L221-18 Code conso) */}
                <p className="text-xs text-muted-foreground leading-relaxed border border-border rounded-xl px-4 py-3">
                  Conformément à l&apos;article L221-18 du Code de la consommation, vous disposez
                  d&apos;un délai de <strong className="text-foreground">14 jours</strong> à compter
                  de la réception de votre commande pour exercer votre droit de rétractation, sans
                  avoir à justifier de motifs. Les frais de retour sont à votre charge. Ce droit ne
                  s&apos;applique pas aux produits personnalisés ou configurés sur mesure.
                </p>

                <button
                  onClick={handleProceedToPayment}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Préparation du paiement…
                    </>
                  ) : (
                    `Procéder au paiement — ${fmt(total)}`
                  )}
                </button>
              </div>
            )}

            {step === 'paiement' && clientSecret && stripeOptions && orderId && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-1">Paiement</h2>
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <PaymentStepInner
                    orderId={orderId}
                    total={orderTotal}
                    onError={(msg) => setError(msg)}
                  />
                </Elements>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step !== 'paiement' && (
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-slate-50 dark:bg-[#06060f] p-6 sticky top-24">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Votre commande
            </h3>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground truncate mr-4">
                    {item.name}
                    <span className="text-muted-foreground"> × {item.quantity}</span>
                  </span>
                  <span className="text-foreground font-medium shrink-0">
                    {fmt(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total HT</span>
                <span>{fmt(subtotalHT)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>TVA 20%</span>
                <span>{fmt(tva)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span>{shipping === 0 ? 'Gratuite' : fmt(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground text-base pt-2 border-t border-border">
                <span>Total TTC</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
            {subtotalHT < 5000 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Livraison offerte dès {fmt(5000)} d&apos;achat.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
