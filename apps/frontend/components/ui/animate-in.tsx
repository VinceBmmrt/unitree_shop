'use client';

import { useRef } from 'react';
import { type Variants, motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimateInVariant = 'fade-up' | 'fade-left' | 'fade-right' | 'scale';

interface AnimateInProps {
  children: React.ReactNode;
  variant?: AnimateInVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

const variantMap: Record<AnimateInVariant, Variants> = {
  'fade-up': { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
  'fade-left': { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  'fade-right': { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
};

export function AnimateIn({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.55,
  once = true,
  className,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      variants={variantMap[variant]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
