'use client';

import { useState } from 'react';
import { formatDuration } from '@/lib/utils';
import type { TimerConfig } from '@/types/timer';

interface Props {
  timer: TimerConfig;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const TimerCard = ({ timer, onStart, onPause, onReset, onRemove, onDuplicate }: Props) => {
  const progress = Math.min(100, (timer.elapsedMs / timer.durationMs) * 100 || 0);
  const displayTime = timer.kind === 'countdown' ? formatDuration(timer.remainingMs) : formatDuration(timer.elapsedMs);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-white/80 to-slate-50/80 p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {timer.kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre'}
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{timer.name}</h3>
        </div>
        <span className="h-3 w-3 rounded-full" style={{ background: timer.color }} />
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-slate-900/90 px-4 py-3 text-white shadow-inner dark:bg-slate-800">
        <button
          type="button"
          onClick={() => (timer.isRunning ? onPause(timer.id) : onStart(timer.id))}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-lg font-black text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          {timer.isRunning ? '❚❚' : '▶'}
        </button>
        <div className="flex flex-col">
          <span className="text-4xl font-mono font-black tracking-tight">{displayTime}</span>
          {timer.durationMs > 0 && timer.kind === 'stopwatch' && (
            <span className="text-xs font-semibold text-emerald-100/80">cible {formatDuration(timer.durationMs)}</span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs uppercase tracking-wide text-slate-200">
          <button
            type="button"
            onClick={() => onPause(timer.id)}
            className="rounded-full bg-white/10 px-3 py-2 font-semibold shadow-inner transition hover:bg-white/20"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={() => onReset(timer.id)}
            className="rounded-full bg-white/10 px-3 py-2 font-semibold shadow-inner transition hover:bg-white/20"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>{timer.isRunning ? 'Lecture en cours' : 'Prêt à démarrer'}</span>
        <button
          type="button"
          onClick={() => setShowAdmin((prev) => !prev)}
          className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Gestion
        </button>
      </div>

      {showAdmin && (
        <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onDuplicate(timer.id)}
            className="rounded-full border border-slate-200 px-3 py-2 text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Dupliquer
          </button>
          <button
            type="button"
            onClick={() => onRemove(timer.id)}
            className="rounded-full border border-rose-200 px-3 py-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};
