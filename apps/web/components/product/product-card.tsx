'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  basePrice: number;
  compareAtPrice?: number;
  leasePriceMonth?: number;
  category: string;
  requiresQuote: boolean;
  inStock: boolean;
  image?: { url: string; altText?: string };
  tags?: { tag: string }[];
}

export function ProductCard({
  slug,
  name,
  shortDescription,
  basePrice,
  compareAtPrice,
  leasePriceMonth,
  category,
  requiresQuote,
  inStock,
  image,
  tags = [],
}: ProductCardProps) {
  const formatEur = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  return (
    <Link href={`/products/${slug}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#09090f] overflow-hidden h-full flex flex-col hover:border-blue-300 dark:hover:border-blue-500/30 transition-colors duration-300 shadow-sm hover:shadow-md dark:shadow-none"
        style={{ boxShadow: undefined }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-50 dark:from-[#0d0d18] to-white dark:to-[#09090f] overflow-hidden">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? name}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 to-transparent group-hover:from-blue-600/5 dark:group-hover:from-blue-600/8 transition-all duration-500" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {!inStock && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                Rupture
              </span>
            )}
            {requiresQuote && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                Sur devis
              </span>
            )}
            {compareAtPrice && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                Promo
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1 border-t border-slate-100 dark:border-white/6">
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-medium mb-1.5">
            {category.replace(/_/g, ' ')}
          </p>
          <h3 className="font-display font-semibold text-base leading-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
            {name}
          </h3>
          {shortDescription && (
            <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
              {shortDescription}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 3).map(({ tag }) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-white/8">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4">
            {requiresQuote ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400 dark:text-zinc-500">Prix sur demande</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                  Devis <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-display font-bold text-slate-900 dark:text-white">{formatEur(basePrice)}</span>
                  {compareAtPrice && (
                    <span className="text-sm text-slate-400 dark:text-zinc-600 line-through">{formatEur(compareAtPrice)}</span>
                  )}
                </div>
                {leasePriceMonth && (
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                    ou {formatEur(leasePriceMonth)}/mois
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
