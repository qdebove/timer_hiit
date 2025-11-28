'use client';

import { cn } from '@/lib/cn';
import { NAV_ITEMS, type NavSection } from './navConfig';

interface Props {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

export const BottomNav = ({ activeSection, onSectionChange }: Props) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-safe pt-1 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="mx-auto flex max-w-screen-md items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className="flex flex-1 flex-col items-center gap-0.5 py-1 text-xs"
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-base',
                  active
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                )}
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  'truncate text-[11px]',
                  active
                    ? 'font-semibold text-primary-700 dark:text-primary-300'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};