'use client';

import { useMemo, useState } from 'react';
import { FloatingTimerAction } from '@/components/FloatingTimerAction';
import { MiniLiveBar } from '@/components/MiniLiveBar';
import { SessionBuilder } from '@/components/SessionBuilder';
import { SessionRunner } from '@/components/SessionRunner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TimerCard } from '@/components/TimerCard';
import { TimerForm } from '@/components/TimerForm';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useSessionPlayback } from '@/hooks/useSessionPlayback';
import { useTimerManager } from '@/hooks/useTimerManager';

const navItems = [
  { id: 'overview', label: 'Tableau de bord', description: 'Synthèse et ambiance pastel' },
  { id: 'timers', label: 'Chronos & rebours', description: 'Créer, éditer, dupliquer' },
  { id: 'sessions', label: 'Sessions', description: 'Assembler et préparer' },
  { id: 'live', label: 'Cockpit', description: 'Lecture et contrôle' }
] as const;

type NavSection = (typeof navItems)[number]['id'];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const { timers, addTimer, start, pause, reset, removeTimer, duplicate, edit, addLap } = useTimerManager();
  const { sessions, createSession, removeSession, duplicate: duplicateSession } = useSessionManager();
  const playback = useSessionPlayback(sessions);

  const stats = useMemo(
    () => ({
      runningTimers: timers.filter((timer) => timer.isRunning).length,
      countdowns: timers.filter((timer) => timer.kind === 'countdown').length,
      stopwatches: timers.filter((timer) => timer.kind === 'stopwatch').length,
      sessions: sessions.length
    }),
    [sessions.length, timers]
  );

  const library = (
    <div className="space-y-3">
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
              onLap={addLap}
            />
          ))}
        </div>
      )}
    </div>
  );

  const sessionsBuilder = (
    <SessionBuilder
      sessions={sessions}
      timers={timers}
      onCreate={createSession}
      onRemove={removeSession}
      onDuplicate={duplicateSession}
    />
  );

  const livePanel = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl bg-gradient-to-br from-primary-50 via-white to-emerald-50 p-5 shadow-card dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Lecture live</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pilotez vos sessions</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Lancez, mettez en pause ou passez une étape sans quitter la page.
              </p>
            </div>
            <div className="flex flex-col items-end rounded-2xl bg-white/70 px-4 py-3 text-right shadow-inner dark:bg-slate-900/60">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Prêtes</span>
              <span className="text-2xl font-black text-primary-600 dark:text-primary-300">{sessions.length}</span>
            </div>
          </div>
          <div className="mt-4">
            <SessionRunner sessions={sessions} playback={playback} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Chronos en cours</p>
          <div className="mt-3 space-y-2">
            {timers.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Créez un chrono pour le lancer ici.</p>
            )}
            {timers.map((timer) => (
              <div
                key={timer.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-inner dark:border-slate-700 dark:bg-slate-900/60"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: timer.color }} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{timer.name}</span>
                    <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {timer.kind === 'countdown' ? 'Rebours' : 'Chrono libre'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
                  <button
                    type="button"
                    onClick={() => (timer.isRunning ? pause(timer.id) : start(timer.id))}
                    className="rounded-full bg-primary-100 px-3 py-1 text-primary-700 transition hover:bg-primary-200 dark:bg-primary-500/20 dark:text-primary-50"
                  >
                    {timer.isRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    type="button"
                    onClick={() => reset(timer.id)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100"
                  >
                    Stop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    if (activeSection === 'timers') {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 rounded-3xl bg-white/70 p-6 shadow-card dark:bg-slate-900/70 lg:grid-cols-[360px,1fr]">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Studio</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Créer un chrono / rebours</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Configurez vos durées ou un chrono libre puis déclenchez-les depuis le bouton flottant.
                </p>
              </div>
              <TimerForm
                onCreate={(payload) =>
                  addTimer({ ...payload, sound: 'bell', note: 'Terminez en beauté !' })
                }
              />
            </div>
            <div className="space-y-2">
              <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 p-4 dark:border-primary-900/60 dark:bg-primary-500/10">
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-200">
                  Astuce chrono sans durée
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Utilisez le type « Chronomètre » pour enregistrer des étapes (laps) à la volée sans imposer de fin.
                </p>
              </div>
              {library}
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === 'sessions') {
      return (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Assemblage</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Composer des sessions HIIT</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Empilez vos rebours, choisissez les repos, dupliquez et réutilisez.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right text-sm font-semibold text-slate-700 shadow-inner dark:bg-slate-800 dark:text-slate-100">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Sessions</p>
                <p className="text-xl font-black">{sessions.length}</p>
              </div>
            </div>
          </div>
          {sessionsBuilder}
        </div>
      );
    }

    if (activeSection === 'live') {
      return livePanel;
    }

    return (
      <div className="space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 shadow-card dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Dashboard</p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Timer HIIT pastel</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Organisez vos chronos, sessions et contrôlez-les depuis une seule interface.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">En cours</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-300">{stats.runningTimers}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Rebours</p>
                <p className="text-2xl font-black text-primary-600 dark:text-primary-300">{stats.countdowns}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Chronos</p>
                <p className="text-2xl font-black text-orange-500">{stats.stopwatches}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sessions</p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{stats.sessions}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Chronos favoris</p>
            {library}
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Sessions prêtes</p>
            {sessionsBuilder}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[250px,1fr]">
          <aside className="space-y-4">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Navigation</p>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Pilotage</h2>
              </div>
              <ThemeToggle />
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                      active
                        ? 'border-primary-300 bg-white/90 text-slate-900 dark:border-primary-800 dark:bg-slate-900/70 dark:text-white'
                        : 'border-slate-200 bg-white/60 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100'
                    }`}
                  >
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                  </button>
                );
              })}
            </nav>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Mini-bar</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Retrouvez en bas à gauche les actions rapides pour vos chronos et sessions en cours.
              </p>
            </div>
          </aside>

          <section className="space-y-4">{renderSection()}</section>
        </div>
      </main>

      <FloatingTimerAction timers={timers} onCreateTimer={addTimer} onStartTimer={start} />
      <MiniLiveBar timers={timers} sessions={sessions} onStartTimer={start} onPauseTimer={pause} onResetTimer={reset} playback={playback} />
    </div>
  );
}
