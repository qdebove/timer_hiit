'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import type { useSessionPlayback } from '@/hooks/useSessionPlayback';
import { formatDuration } from '@/lib/utils';
import type { TimerConfig, TimerSession } from '@/types/timer';
import { useMemo, useState } from 'react';

interface Props {
  timers: TimerConfig[];
  sessions: TimerSession[];
  onStartTimer: (id: string) => void;
  onPauseTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  playback: ReturnType<typeof useSessionPlayback>;
}

export const MiniLiveBar = ({
  timers,
  sessions,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  playback
}: Props) => {
  const { currentStep, nextStep, start, pause, isRunning, activeSessionId, setActiveSessionId } = playback;
  const [collapsed, setCollapsed] = useState(false);

  const activeTimers = timers.filter((timer) => timer.isRunning || timer.elapsedMs > 0);
  const fallbackTimers = useMemo(() => timers.slice(0, 3), [timers]);
  const displayedTimers = activeTimers.length ? activeTimers : fallbackTimers;

  const sessionSummary = currentStep
    ? `${currentStep.label}${nextStep ? ` · Ensuite ${nextStep.label}` : ''}`
    : sessions.length > 0
      ? 'Prêt à lancer'
      : 'Aucune session';

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-20 left-4 z-40 flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-left text-sm font-semibold text-slate-800 shadow-2xl backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 lg:bottom-4"
        aria-label="Ouvrir le player live"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-100">
          ▶
        </span>
        <div className="flex flex-col text-xs uppercase tracking-wide">
          <span className="font-bold text-slate-900 dark:text-white">Live</span>
          <span className="text-slate-500 dark:text-slate-400">
            {displayedTimers.length} chrono(s) · {sessionSummary}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 w-full max-w-2xl lg:bottom-4">
      <Card variant="surface" className="p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
              Lecture en direct
            </p>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Player unique pour vos timers
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="soft">
              {activeTimers.length} chrono{activeTimers.length > 1 ? 's' : ''}
            </Badge>
            <PillButton
              size="xs"
              variant="outline"
              onClick={() => setCollapsed(true)}
            >
              Réduire
            </PillButton>
          </div>
        </div>

        {/* Timers */}
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {displayedTimers.map((timer) => (
            <div
              key={timer.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm shadow-inner dark:border-slate-700 dark:bg-slate-900/70"
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
                    {timer.kind === 'countdown' ? 'Rebours' : 'Chronomètre'} ·{' '}
                    {timer.kind === 'countdown'
                      ? formatDuration(timer.remainingMs)
                      : formatDuration(timer.elapsedMs)}
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
                  {timer.isRunning ? 'Pause' : 'Start'}
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
          ))}
        </div>

        {/* Sessions */}
        {sessions.length > 0 && (
          <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-gradient-to-r from-primary-50 via-white to-emerald-50 p-3 text-sm shadow-inner dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-500" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
                      Session prête
                    </span>
                    <select
                      value={activeSessionId}
                      onChange={(event) => setActiveSessionId(event.target.value)}
                      className="mt-1 min-w-[180px] rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-xs font-semibold text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Badge variant="default">
                  {sessions.length} session{sessions.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <PillButton
                  size="xs"
                  variant="primary"
                  onClick={start}
                >
                  ▶
                </PillButton>
                <PillButton
                  size="xs"
                  variant="outline"
                  disabled={!currentStep || !isRunning}
                  onClick={pause}
                >
                  ❚❚
                </PillButton>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-primary-500/20 px-2 py-0.5 font-semibold text-primary-700 dark:text-primary-200">
                  {currentStep ? currentStep.label : 'Prêt à lancer'}
                </span>
                {nextStep && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ensuite : {nextStep.label}
                  </span>
                )}
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {currentStep ? formatDuration(currentStep.durationMs) : '--:--'}
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};