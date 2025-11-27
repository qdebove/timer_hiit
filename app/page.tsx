'use client';

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
import { useMemo, useState } from 'react';

const navItems = [
  { id: 'overview', label: 'Tableau de bord', description: 'Vision globale et actions clés' },
  { id: 'timers', label: 'Timers', description: 'Créer et gérer vos timers' },
  { id: 'sessions', label: 'Sessions', description: 'Composer vos enchaînements' },
  { id: 'live', label: 'Lecture en direct', description: 'Piloter timers et sessions' }
] as const;

const quickLinks = [
  { id: 'timers', title: 'Créer un timer', detail: 'Compte à rebours ou chronomètre', tone: 'bg-primary-600 text-white' },
  { id: 'sessions', title: 'Créer une session', detail: 'Enchaînez vos timers existants', tone: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-100' },
  { id: 'live', title: 'Piloter en direct', detail: 'Contrôler timers et sessions', tone: 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-100' }
] as const;

type NavSection = (typeof navItems)[number]['id'];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const {
    timers,
    addTimer,
    start,
    pause,
    reset,
    removeTimer,
    duplicate,
    edit,
    addLap,
    updateLapLabel,
    removeLap
  } = useTimerManager();
  const { sessions, createSession, removeSession, duplicate: duplicateSession } = useSessionManager();
  const playback = useSessionPlayback(sessions);

  const stats = useMemo(
    () => ({
      timersTotal: timers.length,
      runningTimers: timers.filter((timer) => timer.isRunning).length,
      countdowns: timers.filter((timer) => timer.kind === 'countdown').length,
      stopwatches: timers.filter((timer) => timer.kind === 'stopwatch').length,
      sessions: sessions.length,
      totalLaps: timers.reduce((total, timer) => total + (timer.laps?.length ?? 0), 0)
    }),
    [sessions.length, timers]
  );

  const timerLibrary = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Bibliothèque</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mes timers</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Un seul endroit pour vos comptes à rebours et chronomètres.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-primary-700 dark:bg-primary-500/10 dark:text-primary-100">
            {timers.length} timers
          </span>
          <span className="text-slate-400">•</span>
          <span>{stats.totalLaps} étapes</span>
        </div>
      </div>

      {timers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          <p className="font-semibold">Aucun timer pour l&apos;instant.</p>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            👉 Créez un premier timer ou inspirez-vous d&apos;une session HIIT prête à l&apos;emploi.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
            <button
              type="button"
              onClick={() => setActiveSection('timers')}
              className="rounded-full bg-primary-600 px-4 py-2 text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Créer un timer
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('sessions')}
              className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Découvrir un exemple de session
            </button>
          </div>
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
              onLapLabelChange={updateLapLabel}
              onLapRemove={removeLap}
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
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Lecture en direct</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pilotez vos timers et sessions</h3>
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
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/70 lg:grid-cols-[360px,1fr]">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Timers</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Créer et gérer vos timers</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Choisissez un compte à rebours ou un chronomètre, prévisualisez le rendu puis enregistrez-le.
                </p>
              </div>
              <TimerForm onCreate={(payload) => addTimer({ ...payload, sound: 'bell', note: 'Terminez en beauté !' })} />
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 p-4 dark:border-primary-900/60 dark:bg-primary-500/10">
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-200">Astuce chrono</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Inspirez-vous de vos sessions : ajoutez des étapes nommées, renommez-les ou supprimez-les directement depuis la carte du chrono.
                </p>
              </div>
              {timerLibrary}
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
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Sessions</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Composer vos sessions</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Assemblez des timers existants ou créez des segments ad hoc.</p>
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
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 shadow-card dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Tableau de bord</p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Bienvenue dans vos timers</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Visualisez l&apos;essentiel puis lancez-vous : créez un timer, assemblez une session ou ouvrez la lecture en direct.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                {quickLinks.map((link, index) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => setActiveSection(link.id as NavSection)}
                    className={`rounded-full px-4 py-2 shadow-inner transition hover:-translate-y-0.5 hover:shadow-lg ${link.tone} ${index === 0 ? 'font-bold' : ''}`}
                  >
                    {link.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Timers</p>
                <p className="text-2xl font-black text-primary-600 dark:text-primary-300">{stats.timersTotal}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rebours {stats.countdowns} • Chronos {stats.stopwatches}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sessions</p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{stats.sessions}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assemblages prêts à lancer</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">En cours</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-300">{stats.runningTimers}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Timers actifs en un coup d&apos;œil</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Chronos favoris</p>
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stats.totalLaps} étapes notées</span>
            </div>
            {timerLibrary}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950">
      <main className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[280px,1fr] xl:grid-cols-[320px,1fr]">
          <aside className="space-y-4">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Navigation</p>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Pilotage</h2>
              </div>
              <ThemeToggle />
            </div>
            <nav className="space-y-2 rounded-3xl border border-slate-200 bg-white/70 p-3 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Choisir une vue</p>
              {navItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`relative w-full overflow-hidden rounded-2xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                      active
                        ? 'border-primary-300 bg-white/90 text-slate-900 dark:border-primary-800 dark:bg-slate-900/70 dark:text-white'
                        : 'border-slate-200 bg-white/60 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100'
                    }`}
                    aria-label={`Ouvrir : ${item.label}`}
                  >
                    {active && <span className="absolute left-0 top-0 h-full w-1 bg-primary-500" aria-hidden />}
                    <p className="text-sm font-bold">{item.label}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate">{item.description}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        Ouvrir
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Lecture en direct</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Retrouvez en bas de l&apos;écran le player live : play/pause, suivant et accès aux sessions.
              </p>
            </div>
          </aside>

          <section className="space-y-6">{renderSection()}</section>
        </div>
      </main>

      <FloatingTimerAction timers={timers} onCreateTimer={addTimer} onStartTimer={start} />
      <MiniLiveBar timers={timers} sessions={sessions} onStartTimer={start} onPauseTimer={pause} onResetTimer={reset} playback={playback} />
    </div>
  );
}
