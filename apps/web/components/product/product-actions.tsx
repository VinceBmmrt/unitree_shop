'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductConfigurator } from './product-configurator';
import { QuoteRequestButton } from './quote-request-button';
import { AddToCartButton } from './add-to-cart-button';
import { apiClient } from '@/lib/api/client';
import { Loader2 } from 'lucide-react';

interface ProductActionsProps {
  product: any;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (product.options ?? []).map((o: any) => [
        o.id,
        o.choices?.find((c: any) => c.isDefault)?.id || o.choices?.[0]?.id || '',
      ]),
    ),
  );
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleSelectionChange = (optionId: string, choiceId: string) => {
    setSelections((prev) => ({ ...prev, [optionId]: choiceId }));
  };

  const handleQuoteRequest = async () => {
    if (product.isConfigurable) {
      setIsConfiguring(true);
      try {
        const res = await apiClient.post(`/products/${product.id}/configure`, { selections });
        const configId = res.data.data.id;
        router.push(`/devis?product=${product.id}&config=${configId}`);
      } catch (error) {
        console.error('Failed to save configuration', error);
        // Fallback to basic quote if configuration fails
        router.push(`/devis?product=${product.id}`);
      } finally {
        setIsConfiguring(false);
      }
    } else {
      router.push(`/devis?product=${product.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {product.isConfigurable && (
        <ProductConfigurator
          productId={product.id}
          options={product.options.map((o: any) => ({
            id: o.id,
            name: o.name,
            values: o.choices.map((c: any) => ({
              id: c.id,
              value: c.label,
              priceModifier: Number(c.priceDelta),
            })),
          }))}
          basePrice={Number(product.basePrice)}
          selected={selections}
          onSelectionChange={handleSelectionChange}
        />
      )}

      <div className="flex flex-col gap-3">
        {product.requiresQuote ? (
          <button
            onClick={handleQuoteRequest}
            disabled={isConfiguring}
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isConfiguring ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Préparation du devis...
              </>
            ) : (
              'Demander un devis personnalisé'
            )}
          </button>
        ) : (
          <AddToCartButton product={product} />
        )}
      </div>
    </div>
  );
}
