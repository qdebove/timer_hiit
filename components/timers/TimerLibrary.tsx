'use client';

import { TimerCard } from '@/components/TimerCard';
import type { TimerConfig } from '@/types/timer';

interface Props {
  timers: TimerConfig[];
  stats: {
    totalLaps: number;
  };
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate: (id: string, payload: any) => void;
  onLap: (id: string, label?: string) => void;
  onLapLabelChange: (timerId: string, lapId: string, label: string) => void;
  onLapRemove: (timerId: string, lapId: string) => void;
  onCreateTimerClick?: () => void;
  onDiscoverSessionClick?: () => void;
}

export const TimerLibrary = ({
  timers,
  stats,
  onStart,
  onPause,
  onReset,
  onRemove,
  onDuplicate,
  onUpdate,
  onLap,
  onLapLabelChange,
  onLapRemove,
  onCreateTimerClick,
  onDiscoverSessionClick
}: Props) => {
  const hasTimers = timers.length > 0;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
            Bibliothèque
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Mes timers
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Vos comptes à rebours et chronomètres, au même endroit.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800/70 dark:text-slate-100">
          <span>{timers.length} timers</span>
          <span className="text-slate-400">•</span>
          <span>{stats.totalLaps} étapes</span>
        </div>
      </header>

      {!hasTimers ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          <p className="font-semibold">Aucun timer pour l&apos;instant.</p>
          <p className="mt-1">
            Créez un premier timer ou inspirez-vous d&apos;une session HIIT prête à
            l&apos;emploi.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
            {onCreateTimerClick && (
              <button
                type="button"
                onClick={onCreateTimerClick}
                className="rounded-full bg-primary-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Créer un timer
              </button>
            )}
            {onDiscoverSessionClick && (
              <button
                type="button"
                onClick={onDiscoverSessionClick}
                className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Voir un exemple de session
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {timers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onStart={onStart}
              onPause={onPause}
              onReset={onReset}
              onRemove={onRemove}
              onDuplicate={onDuplicate}
              onUpdate={onUpdate}
              onLap={onLap}
              onLapLabelChange={onLapLabelChange}
              onLapRemove={onLapRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
