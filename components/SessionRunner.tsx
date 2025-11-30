'use client';

import { formatDuration } from '@/lib/utils';
import type { TimerSession } from '@/types/timer';
import type { useSessionPlayback } from '@/hooks/useSessionPlayback';

interface Props {
  sessions: TimerSession[];
  playback: ReturnType<typeof useSessionPlayback>;
}

export const SessionRunner = ({ sessions, playback }: Props) => {
  const {
    activeSessionId,
    setActiveSessionId,
    currentIndex,
    currentStep,
    nextStep,
    remainingMs,
    isRunning,
    completed,
    steps,
    start,
    pause,
    resetStep,
    stop,
    skip,
    sessionDuration
  } = playback;

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Aucune session disponible. Créez-en une pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 dark:bg-slate-900 sm:rounded-2xl">
      {/* Header: Selection & Progress */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={activeSessionId}
          onChange={(e) => setActiveSessionId(e.target.value)}
          className="rounded-lg border-none bg-slate-100 px-4 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:text-white"
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {completed ? 'Terminé' : `Étape ${currentIndex + 1} / ${steps.length}`}
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center py-8">
        <div
          className="text-7xl font-black tabular-nums tracking-tight text-slate-900 dark:text-white sm:text-8xl"
          style={{ color: currentStep?.color }}
        >
          {formatDuration(remainingMs)}
        </div>

        {currentStep && (
          <div className="mt-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: currentStep.color }} />
            <span className="text-lg font-medium text-slate-700 dark:text-slate-200">
              {currentStep.label}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {currentStep.type === 'rest' ? 'Repos' : 'Effort'}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={start}
            disabled={completed || !currentStep}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-105 hover:bg-emerald-600 disabled:opacity-50"
          >
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition hover:scale-105 hover:bg-amber-600"
          >
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          </button>
        )}

        <button
          onClick={resetStep}
          disabled={!currentStep}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
          title="Recommencer l'étape"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>

        <button
          onClick={skip}
          disabled={!nextStep}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
          title="Passer à l'étape suivante"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Next Step Preview */}
      {nextStep && (
        <div className="mt-8 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            À suivre
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full" style={{ background: nextStep.color }} />
              <span className="font-medium text-slate-700 dark:text-slate-200">{nextStep.label}</span>
            </div>
            <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {formatDuration(nextStep.durationMs)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
