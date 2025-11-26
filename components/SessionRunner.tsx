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

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sessions</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lecture complète</h3>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Durée totale</p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{formatDuration(sessionDuration)}</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Créez une session pour pouvoir la lancer en continu.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex flex-col text-sm font-semibold text-slate-700 dark:text-slate-200 sm:w-1/2">
              Sélection
              <select
                value={activeSessionId}
                onChange={(event) => setActiveSessionId(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <button
                type="button"
                onClick={start}
                disabled={!currentStep}
                className="rounded-full bg-emerald-500 px-4 py-2 text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                ▶ Lancer
              </button>
              <button
                type="button"
                onClick={pause}
                disabled={!currentStep || !isRunning}
                className="rounded-full border border-slate-200 px-4 py-2 text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                ❚❚ Pause
              </button>
              <button
                type="button"
                onClick={resetStep}
                disabled={!currentStep}
                className="rounded-full border border-slate-200 px-4 py-2 text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Reset étape
              </button>
              <button
                type="button"
                onClick={stop}
                disabled={!currentStep}
                className="rounded-full border border-rose-200 px-4 py-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/60 dark:text-rose-200 dark:hover:bg-rose-950"
              >
                Stop session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-xl border border-slate-200 bg-slate-900/90 p-4 text-white shadow-inner dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/70">
                <span>{completed ? 'Session terminée' : currentStep?.type === 'rest' ? 'Repos' : 'Segment en cours'}</span>
                <span>
                  Étape {Math.min(currentIndex + 1, steps.length)} / {steps.length}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-5xl font-black leading-none">{formatDuration(remainingMs)}</span>
                {currentStep && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ color: currentStep.color }}>
                    {currentStep.label}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: currentStep?.color ?? '#94a3b8' }} />
                  {currentStep?.type === 'rest' ? 'Phase de repos sautable' : "Phase d'effort"}
                </span>
                {currentStep && (
                  <button
                    type="button"
                    onClick={skip}
                    className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition hover:bg-white/20"
                  >
                    Passer cette étape
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-white/90 p-3 text-sm shadow-inner dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aperçu</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {nextStep ? 'À suivre' : 'Fin de session'}
                </span>
              </div>
              {nextStep ? (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: nextStep.color }} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{nextStep.label}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {nextStep.type === 'rest' ? 'Repos' : 'Effort'} • {formatDuration(nextStep.durationMs)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">Préparez-vous</span>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">La session se terminera après cette étape.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
