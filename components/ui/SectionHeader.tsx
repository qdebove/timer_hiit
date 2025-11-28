'use client';

import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  rightSlot?: ReactNode;
}

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  rightSlot
}: SectionHeaderProps) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      )}
    </div>
    {rightSlot && (
      <div className="sm:max-w-xs sm:text-right">
        {rightSlot}
      </div>
    )}
  </header>
);
