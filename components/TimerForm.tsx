'use client';

import { useState } from 'react';
import { parseDurationToMs } from '@/lib/utils';
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Minutes
          </label>
          <input
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Secondes
          </label>
          <input
            type="number"
            min={0}
            value={seconds}
            onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Type</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as TimerKind)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="countdown">Compte à rebours</option>
            <option value="stopwatch">Chronomètre</option>
          </select>
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

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Ajouter un timer
      </button>
    </form>
  );
};
