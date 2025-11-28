'use client';

import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'soft' | 'danger';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100',
  primary:
    'bg-primary-600 text-white dark:bg-primary-500 dark:text-white',
  soft:
    'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-100',
  danger:
    'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-100'
};

export const Badge = ({ children, className, variant = 'default' }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
};