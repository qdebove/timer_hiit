'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { TimerCard } from '@/components/TimerCard';
import { TimerForm } from '@/components/TimerForm';
import { SessionBuilder } from '@/components/SessionBuilder';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useTimerManager } from '@/hooks/useTimerManager';

export default function HomePage() {
  const { timers, addTimer, start, pause, reset, removeTimer, duplicate } = useTimerManager();
  const { sessions, createSession, removeSession, duplicate: duplicateSession } = useSessionManager();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">PWA Next.js + Tailwind</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Timer HIIT</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Créez des compteurs, orchestrez vos sessions et synchronisez vos efforts.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <TimerForm
            onCreate={(payload) =>
              addTimer({ ...payload, sound: 'bell', note: 'Terminez en beauté !' })
            }
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mes timers</h2>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {timers.length} actifs
            </span>
          </div>
          {timers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
              Aucun timer créé pour l&apos;instant. Ajoutez un compte à rebours ou un chrono pour démarrer.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {timers.map((timer) => (
                <TimerCard
                  key={timer.id}
                  timer={timer}
                  onStart={start}
                  onPause={pause}
                  onReset={reset}
                  onRemove={removeTimer}
                  onDuplicate={duplicate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <SessionBuilder
          sessions={sessions}
          onCreate={createSession}
          onRemove={removeSession}
          onDuplicate={duplicateSession}
        />
      </section>
    </main>
  );
}
