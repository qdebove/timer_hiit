'use client';

import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
      aria-label="Basculer le thème"
    >
      <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary-500 to-primary-700" />
      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    </button>
  );
};
