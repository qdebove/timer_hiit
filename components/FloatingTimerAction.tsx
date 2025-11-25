'use client';

import { useMemo, useState } from 'react';
import { parseDurationToMs } from '@/lib/utils';
import type { TimerConfig, TimerKind } from '@/types/timer';

interface Props {
  timers: TimerConfig[];
  onCreateTimer: (payload: { name: string; kind: TimerKind; durationMs: number; color: string }) => string;
  onStartTimer: (id: string) => void;
}

export const FloatingTimerAction = ({ timers, onCreateTimer, onStartTimer }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Démarrage rapide');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [kind, setKind] = useState<TimerKind>('countdown');

  const favoriteCountdowns = useMemo(
    () => timers.filter((timer) => timer.kind === 'countdown').slice(0, 3),
    [timers]
  );

  const handleQuickStart = (event: React.FormEvent) => {
    event.preventDefault();
    const durationMs = parseDurationToMs(minutes, seconds);
    const id = onCreateTimer({ name, kind, durationMs, color: '#f59e0b' });
    onStartTimer(id);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-2xl backdrop-blur-sm transition dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Rapide</p>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Créer &amp; lancer</h4>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full bg-slate-100 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleQuickStart} className="mt-3 space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Nom
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Minutes
                </label>
                <input
                  type="number"
                  min={0}
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Secondes
                </label>
                <input
                  type="number"
                  min={0}
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Mode
                </label>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as TimerKind)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="countdown">Compte à rebours</option>
                  <option value="stopwatch">Chronomètre</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">▶</span>
              Créer et lancer
            </button>
          </form>

          {favoriteCountdowns.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Timers prêts
              </p>
              <div className="space-y-2">
                {favoriteCountdowns.map((timer) => (
                  <button
                    key={timer.id}
                    type="button"
                    onClick={() => {
                      onStartTimer(timer.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-left text-sm font-semibold text-slate-800 transition hover:border-primary-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: timer.color }} />
                      {timer.name}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-primary-600 dark:text-primary-300">Lancer</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-2xl transition hover:-translate-y-1 hover:shadow-primary-400/40"
        aria-label="Créer ou lancer un timer"
      >
        {open ? '–' : '+'}
      </button>
    </div>
  );
};
