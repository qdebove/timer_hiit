'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { formatDuration } from '@/lib/utils';
import type { TimerConfig } from '@/types/timer';

interface Props {
  timers: TimerConfig[];
  onStartTimer: (id: string) => void;
  onPauseTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
}

export const LiveTimersList = ({ timers, onStartTimer, onPauseTimer, onResetTimer }: Props) => {
  const hasTimers = timers.length > 0;

  return (
    <Card variant="surface" className="h-full">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
          Chronos en cours
        </p>
        <Badge variant="soft">
          {timers.length} chrono{timers.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="mt-3 space-y-2">
        {!hasTimers && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Créez un chrono pour le lancer ici.
          </p>
        )}

        {timers.map((timer) => {
          const label =
            timer.kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre';
          const time =
            timer.kind === 'countdown'
              ? formatDuration(timer.remainingMs)
              : formatDuration(timer.elapsedMs);

          return (
            <div
              key={timer.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-inner dark:border-slate-700 dark:bg-slate-900/60"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: timer.color }}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {timer.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {label} · {time}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PillButton
                  size="xs"
                  variant="primary"
                  onClick={() =>
                    timer.isRunning ? onPauseTimer(timer.id) : onStartTimer(timer.id)
                  }
                >
                  {timer.isRunning ? 'Pause' : 'Démarrer'}
                </PillButton>
                <PillButton
                  size="xs"
                  variant="outline"
                  onClick={() => onResetTimer(timer.id)}
                >
                  Reset
                </PillButton>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};