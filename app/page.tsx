'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { TimerCard } from '@/components/TimerCard';
import { TimerForm } from '@/components/TimerForm';
import { FloatingTimerAction } from '@/components/FloatingTimerAction';
import { SessionBuilder } from '@/components/SessionBuilder';
import { SessionRunner } from '@/components/SessionRunner';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useTimerManager } from '@/hooks/useTimerManager';

export default function HomePage() {
  const { timers, addTimer, start, pause, reset, removeTimer, duplicate, edit } = useTimerManager();
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px,1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Composer un nouveau chrono</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Séparez création et lecture : conservez vos paramètres ici, puis déclenchez vos compte à rebours depuis le bouton flottant.
            </p>
          </div>
          <TimerForm
            onCreate={(payload) =>
              addTimer({ ...payload, sound: 'bell', note: 'Terminez en beauté !' })
            }
          />
        </aside>

        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Bibliothèque</p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mes timers</h2>
              </div>
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
                    onUpdate={edit}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <SessionBuilder
              sessions={sessions}
              timers={timers}
              onCreate={createSession}
              onRemove={removeSession}
              onDuplicate={duplicateSession}
            />
          </section>

          <section>
            <SessionRunner sessions={sessions} />
          </section>
        </div>
      </div>

      <FloatingTimerAction timers={timers} onCreateTimer={addTimer} onStartTimer={start} />
    </main>
  );
}
