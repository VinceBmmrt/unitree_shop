'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import { useCartStore } from '@/lib/store/cart.store';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

type Step = 'contact' | 'shipping' | 'payment' | 'review';

const STEPS: Step[] = ['contact', 'shipping', 'payment', 'review'];

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  isEnterprise: z.boolean().default(false),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
});

const shippingSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(3),
  country: z.string().min(2),
});

export function CheckoutFlow() {
  const [step, setStep] = useState<Step>('contact');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { items, clearCart, subtotal } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const currentStepIndex = STEPS.indexOf(step);

  async function createOrder(addressId: string) {
    const res = await apiClient.post('/orders', {
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        configurationId: i.configurationId,
        quantity: i.quantity,
      })),
      shippingAddressId: addressId,
      billingAddressId: addressId,
    });
    return res.data.data;
  }

  async function handlePayment() {
    if (!stripe || !elements || !orderId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
        },
      });

      if (stripeError) {
        setError(stripeError.message ?? 'Payment failed');
      }
      // On success, Stripe redirects to return_url
    } finally {
      setIsSubmitting(false);
    }
  }

  const stepConfig = {
    contact: {
      title: 'Contact',
      description: 'Who should we contact about this order?',
    },
    shipping: {
      title: 'Shipping',
      description: 'Where should we deliver your system?',
    },
    payment: {
      title: 'Payment',
      description: 'Secure payment via Stripe',
    },
    review: {
      title: 'Review',
      description: 'Confirm your order details',
    },
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < currentStepIndex && setStep(s)}
              disabled={i >= currentStepIndex}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
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
              className={`text-sm hidden sm:block ${
                i === currentStepIndex ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {stepConfig[s].title}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-8 transition-colors ${
                  i < currentStepIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{stepConfig[step].title}</h2>
            <p className="text-muted-foreground mt-1">{stepConfig[step].description}</p>
          </div>

          {step === 'payment' && clientSecret && (
            <div className="space-y-6">
              <PaymentElement />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : `Pay $${subtotal().toFixed(2)}`}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
