'use client';

import { formatDuration } from '@/lib/utils';
import type { useSessionPlayback } from '@/hooks/useSessionPlayback';
import type { TimerConfig, TimerSession } from '@/types/timer';

interface Props {
  timers: TimerConfig[];
  sessions: TimerSession[];
  onStartTimer: (id: string) => void;
  onPauseTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  playback: ReturnType<typeof useSessionPlayback>;
}

export const MiniLiveBar = ({ timers, sessions, onStartTimer, onPauseTimer, onResetTimer, playback }: Props) => {
  const { currentStep, nextStep, start, pause, isRunning, activeSessionId, setActiveSessionId } = playback;

  const activeTimers = timers.filter((timer) => timer.isRunning || timer.elapsedMs > 0);
  const fallbackTimers = timers.slice(0, 3);

  return (
    <div className="fixed bottom-4 left-4 z-40 w-full max-w-xl rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-2xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Live</p>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Mini-bar des flux</h4>
        </div>
        <span className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-500/20 dark:text-primary-100">
          {activeTimers.length} chronos
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        {(activeTimers.length ? activeTimers : fallbackTimers).map((timer) => (
          <div
            key={timer.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-inner dark:border-slate-700 dark:bg-slate-900/60"
          >
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: timer.color }} />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{timer.name}</span>
                <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {timer.kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre'} ·{' '}
                  {timer.kind === 'countdown' ? formatDuration(timer.remainingMs) : formatDuration(timer.elapsedMs)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
              <button
                type="button"
                onClick={() => (timer.isRunning ? onPauseTimer(timer.id) : onStartTimer(timer.id))}
                className="rounded-full bg-primary-100 px-3 py-1 text-primary-700 transition hover:bg-primary-200 dark:bg-primary-500/20 dark:text-primary-50"
              >
                {timer.isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={() => onResetTimer(timer.id)}
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100"
              >
                Stop
              </button>
            </div>
          </div>
        ))}
      </div>

      {sessions.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-gradient-to-r from-primary-50 via-white to-emerald-50 p-3 text-sm shadow-inner dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Session</span>
                <select
                  value={activeSessionId}
                  onChange={(event) => setActiveSessionId(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-xs font-semibold text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-100">
              <button
                type="button"
                onClick={start}
                className="rounded-full bg-primary-600 px-3 py-1 text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                ▶
              </button>
              <button
                type="button"
                onClick={pause}
                disabled={!currentStep || !isRunning}
                className="rounded-full bg-white/50 px-3 py-1 text-slate-800 shadow-inner transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                ❚❚
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-primary-500/20 px-2 py-0.5 font-semibold text-primary-700 dark:text-primary-200">
                {currentStep ? currentStep.label : 'Prêt à lancer'}
              </span>
              {nextStep && <span className="text-[11px] text-slate-500 dark:text-slate-400">Ensuite : {nextStep.label}</span>}
            </div>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {currentStep ? formatDuration(currentStep.durationMs) : '--:--'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
