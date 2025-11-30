'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { formatDuration } from '@/lib/utils';
import type { TimerConfig, TimerKind } from '@/types/timer';
import { useState } from 'react';
import { TimerSettingsModal } from '@/components/timers/TimerSettingsModal';

interface Props {
  timer: TimerConfig;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate: (id: string, payload: { name: string; durationMs: number; color: string; kind: TimerKind }) => void;
  onLap: (id: string, label?: string) => void;
  onLapLabelChange: (timerId: string, lapId: string, label: string) => void;
  onLapRemove: (timerId: string, lapId: string) => void;
}

export const TimerCard = ({
  timer,
  onStart,
  onPause,
  onReset,
  onRemove,
  onDuplicate,
  onUpdate,
  onLap,
  onLapLabelChange,
  onLapRemove
}: Props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const hasTarget = timer.kind === 'countdown' || timer.durationMs > 0;
  const progress = hasTarget
    ? Math.min(100, (timer.elapsedMs / (timer.durationMs || 1)) * 100 || 0)
    : 0;
  const displayTime =
    timer.kind === 'countdown'
      ? formatDuration(timer.remainingMs)
      : formatDuration(timer.elapsedMs);

  const typeLabel =
    timer.kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre';

  // Icône principale selon type + état
  const mainIcon = timer.isRunning
    ? '❚❚'
    : timer.kind === 'countdown'
      ? '▶'
      : '⏱️';

  return (
    <>
      <Card
        variant="surface"
        className={[
          'relative flex flex-col gap-3 transition-all duration-200',
          timer.isRunning
            ? 'border-primary-300/80 shadow-primary-500/20 ring-1 ring-primary-300/60 dark:border-primary-700/70 dark:ring-primary-500/40'
            : 'hover:-translate-y-0.5 hover:shadow-lg'
        ].join(' ')}
      >
        {/* Halo animé quand le timer tourne */}
        {timer.isRunning && (
          <span
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-primary-500/5 blur-sm"
            aria-hidden
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <span aria-hidden>{timer.kind === 'countdown' ? '⬇️' : '⏱️'}</span>
              {typeLabel}
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {timer.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={timer.isRunning ? 'soft' : 'default'}>
              {timer.isRunning ? 'En cours' : 'Prêt'}
            </Badge>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Paramètres"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Zone principale chrono */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-900/95 px-4 py-3 text-white shadow-inner transition-colors duration-200 dark:bg-slate-800 md:flex-nowrap">
          <button
            type="button"
            onClick={() => (timer.isRunning ? onPause(timer.id) : onStart(timer.id))}
            aria-pressed={timer.isRunning}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-lg font-black text-emerald-950 shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {mainIcon}
          </button>

          <div className="flex flex-col">
            <span className="text-4xl font-mono font-black tracking-tight tabular-nums">
              {displayTime}
            </span>
            {timer.kind === 'stopwatch' && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-100/80">
                {timer.laps && timer.laps.length > 0 && (
                  <span>
                    Tour {timer.laps.length + 1}: {formatDuration(timer.elapsedMs - (timer.laps[timer.laps.length - 1]?.elapsedMs ?? 0))}
                  </span>
                )}
                {timer.durationMs > 0 && (
                  <span>Cible {formatDuration(timer.durationMs)}</span>
                )}
              </div>
            )}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-200">
            <PillButton
              size="xs"
              variant="outline"
              onClick={() => onPause(timer.id)}
            >
              Arrêt
            </PillButton>
            <PillButton
              size="xs"
              variant="outline"
              onClick={() => onReset(timer.id)}
            >
              Reset
            </PillButton>
            {timer.kind === 'stopwatch' && (
              <PillButton
                size="xs"
                variant="outline"
                onClick={() => onLap(timer.id)}
              >
                Tour
              </PillButton>
            )}
          </div>
        </div>

        {/* Barre de progression / état libre */}
        {hasTarget ? (
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Chrono libre en cours
          </div>
        )}
      </Card>

      <TimerSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        timer={timer}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onDuplicate={onDuplicate}
        onLap={onLap}
        onLapLabelChange={onLapLabelChange}
        onLapRemove={onLapRemove}
      />
    </>
  );
};