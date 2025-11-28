'use client';

import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type CardVariant = 'surface' | 'subtle' | 'muted' | 'dashed' | 'accent';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  surface:
    'border border-slate-200 bg-white/80 shadow-card dark:border-slate-800 dark:bg-slate-900/70',
  subtle:
    'border border-slate-200 bg-white/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/60',
  muted:
    'border border-slate-200 bg-slate-50/60 shadow-inner dark:border-slate-800 dark:bg-slate-900/50',
  dashed:
    'border border-dashed border-slate-200 bg-white/70 dark:border-slate-700 dark:bg-slate-900/60',
  accent:
    'border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 shadow-card dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900/40'
};

export const Card = ({ children, className, variant = 'surface' }: CardProps) => {
  return (
    <div className={cn('rounded-3xl p-4', VARIANT_CLASSES[variant], className)}>
      {children}
    </div>
  );
};