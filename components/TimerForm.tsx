'use client';

import { useEffect, useState } from 'react';
import { formatDuration, parseDurationToMs } from '@/lib/utils';
import type { TimerKind } from '@/types/timer';

interface Props {
  onCreate: (payload: { name: string; kind: TimerKind; durationMs: number; color: string }) => void;
}

export const TimerForm = ({ onCreate }: Props) => {
  const [name, setName] = useState('Nouveau chrono');
  const [kind, setKind] = useState<TimerKind>('countdown');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [color, setColor] = useState('#6366f1');

  const computedDuration = parseDurationToMs(minutes, seconds);

  useEffect(() => {
    if (kind === 'stopwatch') {
      setMinutes(0);
      setSeconds(0);
    }
  }, [kind]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const durationMs = parseDurationToMs(minutes, seconds);
    onCreate({ name, kind, durationMs, color });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Nom</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Type</p>
          <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[{ value: 'countdown', label: 'Compte à rebours', icon: '⬇️' }, { value: 'stopwatch', label: 'Chronomètre', icon: '⏱️' }].map((option) => {
              const active = kind === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setKind(option.value as TimerKind)}
                  className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${
                    active
                      ? 'border-primary-400 bg-primary-50 text-primary-800 dark:border-primary-700 dark:bg-primary-500/20 dark:text-primary-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                  }`}
                >
                  <span aria-hidden>{option.icon}</span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Minutes</label>
          <input
            type="number"
            min={0}
            value={minutes}
            disabled={kind === 'stopwatch'}
            onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Secondes</label>
          <input
            type="number"
            min={0}
            value={seconds}
            disabled={kind === 'stopwatch'}
            onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Couleur</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 shadow-inner dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aperçu</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre'}
              </span>
            </div>
          </div>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
            {kind === 'stopwatch' ? '00:00' : formatDuration(computedDuration)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {kind === 'stopwatch'
            ? 'Le chronomètre est sans limite, ajoutez des étapes pendant la course.'
            : 'Le compte à rebours se base sur la durée indiquée.'}
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {kind === 'stopwatch' ? 'Créer le chronomètre' : `Créer le timer (${formatDuration(computedDuration)})`}
        </button>
      </div>
    </form>
  );
};
