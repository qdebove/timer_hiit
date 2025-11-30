'use client';

import { PillButton } from '@/components/ui/PillButton';
import { formatDuration, parseDurationToMs } from '@/lib/utils';
import type { TimerKind } from '@/types/timer';
import { useEffect, useState } from 'react';

interface TimerData {
  name: string;
  kind: TimerKind;
  durationMs: number;
  color: string;
}

interface Props {
  initialValues?: TimerData;
  onCreate: (payload: TimerData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const TimerForm = ({ initialValues, onCreate, onCancel, submitLabel = 'Créer' }: Props) => {
  const [name, setName] = useState(initialValues?.name ?? 'Nouveau chrono');
  const [kind, setKind] = useState<TimerKind>(initialValues?.kind ?? 'countdown');

  const initialMinutes = initialValues ? Math.floor(initialValues.durationMs / 60000) : 0;
  const initialSeconds = initialValues ? Math.floor((initialValues.durationMs % 60000) / 1000) : 30;

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [color, setColor] = useState(initialValues?.color ?? '#6366f1');

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bloc paramètres */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nom du timer
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {/* Type */}
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Type
            </p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {[
                { value: 'countdown', label: 'Compte à rebours', icon: '⬇️' },
                { value: 'stopwatch', label: 'Chronomètre', icon: '⏱️' }
              ].map((option) => {
                const active = kind === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setKind(option.value as TimerKind)}
                    className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs sm:text-sm font-semibold leading-snug whitespace-normal transition ${active
                      ? 'border-primary-400 bg-primary-50 text-primary-800 dark:border-primary-700 dark:bg-primary-500/20 dark:text-primary-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                      }`}
                  >
                    <span aria-hidden>{option.icon}</span>
                    <span className="flex-1">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minutes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Minutes
            </label>
            <input
              type="number"
              min={0}
              value={minutes}
              disabled={kind === 'stopwatch'}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800"
            />
          </div>

          {/* Secondes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Secondes
            </label>
            <input
              type="number"
              min={0}
              value={seconds}
              disabled={kind === 'stopwatch'}
              onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800"
            />
          </div>

          {/* Couleur */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Couleur
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Aperçu & CTA */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: color }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre'}
              </span>
            </div>
          </div>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
            {kind === 'stopwatch' ? '00:00' : formatDuration(computedDuration)}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Annuler
          </button>
          <PillButton type="submit">
            {submitLabel}
          </PillButton>
        </div>
      </div>
    </form>
  );
};
