'use client';

import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PillVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type PillSize = 'xs' | 'sm' | 'md';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: PillVariant;
  size?: PillSize;
}

const VARIANT_CLASSES: Record<PillVariant, string> = {
  primary:
    'bg-primary-600 text-white shadow-card hover:-translate-y-0.5 hover:shadow-lg dark:bg-primary-500',
  outline:
    'border border-slate-200 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800',
  danger:
    'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-200 dark:hover:bg-rose-950'
};

const SIZE_CLASSES: Record<PillSize, string> = {
  xs: 'px-2 py-1 text-[11px]',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm'
};

export const PillButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: PillButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
    >
      {children}
    </button>
  );
};