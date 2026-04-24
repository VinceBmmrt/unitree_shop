import { Star, Check } from 'lucide-react';

interface ProductInfoProps {
  product: {
    name: string;
    shortDescription?: string;
    description?: string;
    category: string;
    basePrice: number;
    compareAtPrice?: number;
    leasePriceMonth?: number;
    requiresQuote: boolean;
    inStock: boolean;
    sku: string;
    avgRating?: number;
    reviewCount?: number;
    specs?: Record<string, string>;
    tags?: { tag: string }[];
  };
}

const formatEur = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

export function ProductInfo({ product }: ProductInfoProps) {
  const tva = product.requiresQuote ? null : product.basePrice * 0.2;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1.5">
          {product.category.replace(/_/g, ' ')}
        </p>
        <h1 className="font-display text-3xl font-bold leading-tight">{product.name}</h1>

        {(product.avgRating ?? 0) > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.avgRating!) ? 'fill-primary text-primary' : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.avgRating?.toFixed(1)} ({product.reviewCount} avis)
            </span>
          </div>
        )}
      </div>

      {product.shortDescription && (
        <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>
      )}

      {/* Pricing */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-1">
        {product.requiresQuote ? (
          <p className="text-lg font-semibold text-muted-foreground">Prix sur demande</p>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-display font-bold">{formatEur(product.basePrice)}</span>
              {product.compareAtPrice && (
                <span className="text-base text-muted-foreground line-through">
                  {formatEur(product.compareAtPrice)}
                </span>
              )}
              <span className="text-xs text-muted-foreground">HT</span>
            </div>
            {tva !== null && (
              <p className="text-xs text-muted-foreground">
                Soit {formatEur(product.basePrice + tva)} TTC (TVA 20 %)
              </p>
            )}
            {product.leasePriceMonth && (
              <p className="text-sm text-primary font-medium">
                ou {formatEur(product.leasePriceMonth)}/mois (financement)
              </p>
            )}
          </>
        )}

        <div className="flex items-center gap-1.5 mt-2">
          {product.inStock ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-500 font-medium">En stock</span>
            </>
          ) : (
            <span className="text-xs text-destructive font-medium">Rupture de stock</span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">Réf. {product.sku}</span>
        </div>
      </div>

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Spécifications clés</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="rounded-lg bg-muted/50 px-3 py-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{key}</p>
                <p className="text-sm font-medium mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map(({ tag }) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
