'use client';

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

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {timer.kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre'}
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{timer.name}</h3>
        </div>
        <span className="h-3 w-3 rounded-full" style={{ background: timer.color }} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-4xl font-mono font-bold text-slate-900 dark:text-slate-50">
        {displayTime}
        {timer.durationMs > 0 && timer.kind === 'stopwatch' && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            cible {formatDuration(timer.durationMs)}
          </span>
        )}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button
          type="button"
          onClick={() => (timer.isRunning ? onPause(timer.id) : onStart(timer.id))}
          className="rounded-full bg-primary-600 px-4 py-2 text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {timer.isRunning ? 'Pause' : 'Démarrer'}
        </button>
        <button
          type="button"
          onClick={() => onReset(timer.id)}
          className="rounded-full border border-slate-200 px-3 py-2 text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Reset
        </button>
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
          className="ml-auto rounded-full border border-rose-200 px-3 py-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};
