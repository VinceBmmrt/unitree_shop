'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  values: { id: string; value: string; priceModifier?: number }[];
}

interface ProductConfiguratorProps {
  productId: string;
  options: Option[];
  basePrice: number;
  selected: Record<string, string>;
  onSelectionChange: (optionId: string, choiceId: string) => void;
}

const formatEur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export function ProductConfigurator({ options, basePrice, selected, onSelectionChange }: ProductConfiguratorProps) {
  if (!options?.length) return null;

  const totalModifier = options.reduce((sum, opt) => {
    const val = opt.values.find((v) => v.id === selected[opt.id]);
    return sum + (val?.priceModifier ?? 0);
  }, 0);

  const total = basePrice + totalModifier;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-semibold">Configuration</p>

      {options.map((option) => (
        <div key={option.id} className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {option.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((val) => {
              const isActive = selected[option.id] === val.id;
              return (
                <button
                  key={val.id}
                  onClick={() => onSelectionChange(option.id, val.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  {isActive && <Check className="w-3 h-3" />}
                  {val.value}
                  {val.priceModifier && val.priceModifier !== 0 && (
                    <span className="text-xs text-muted-foreground">
                      {val.priceModifier > 0 ? '+' : ''}
                      {formatEur(val.priceModifier)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {totalModifier !== 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-border text-sm">
          <span className="text-muted-foreground">Total configuré</span>
          <span className="font-bold font-display text-base">{formatEur(total)}</span>
        </div>
      )}
    </div>
  );
}
