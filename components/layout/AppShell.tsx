'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
import { NAV_ITEMS, type NavSection } from './navConfig';

interface Props {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
  children: ReactNode;
}

export const AppShell = ({ activeSection, onSectionChange, children }: Props) => {
  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-col gap-5 px-4 py-5 sm:px-6 lg:gap-8 lg:px-10 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[260px,1fr] xl:grid-cols-[280px,1fr]">
        {/* Sidebar visible seulement à partir de lg */}
        <aside className="hidden space-y-4 lg:block">
          <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
                Navigation
              </p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pilotage</h2>
            </div>
            <ThemeToggle />
          </div>

          <nav className="space-y-2 rounded-3xl border border-slate-200 bg-white/70 p-3 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Vues
            </p>
            <div className="mt-1 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition',
                      active
                        ? 'bg-primary-50 text-primary-900 shadow-sm ring-1 ring-primary-200 dark:bg-primary-500/10 dark:text-primary-50 dark:ring-primary-500/40'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/70'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span aria-hidden>{item.icon}</span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-semibold">{item.label}</span>
                      <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Contenu principal */}
        <section className="min-w-0 space-y-5 lg:space-y-6">{children}</section>
      </div>
    </main>
  );
};