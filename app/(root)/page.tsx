'use client';

import { FloatingTimerAction } from '@/components/FloatingTimerAction';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import type { NavSection } from '@/components/layout/navConfig';
import { MiniLiveBar } from '@/components/MiniLiveBar';
import { LiveSection } from '@/components/sections/LiveSection';
import { OverviewSection } from '@/components/sections/OverviewSection';
import { SessionsSection } from '@/components/sections/SessionsSection';
import { TimersSection } from '@/components/sections/TimersSection';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useSessionPlayback } from '@/hooks/useSessionPlayback';
import { useTimerManager } from '@/hooks/useTimerManager';
import { useMemo, useState } from 'react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 pb-16 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950 lg:pb-0">
      <AppShell activeSection={activeSection} onSectionChange={setActiveSection}>
        {activeSection === 'overview' && (
          <OverviewSection
            stats={stats}
            timers={timers}
            onSelectSection={setActiveSection}
            onTimerStart={start}
            onTimerPause={pause}
            onTimerReset={reset}
            onTimerRemove={removeTimer}
            onTimerDuplicate={duplicate}
            onTimerUpdate={edit}
            onTimerLap={addLap}
            onTimerLapLabelChange={updateLapLabel}
            onTimerLapRemove={removeLap}
          />
        )}

        {activeSection === 'timers' && (
          <TimersSection
            stats={{ totalLaps: stats.totalLaps }}
            timers={timers}
            onCreateTimer={(payload) => addTimer({ ...payload, sound: 'bell', note: 'Terminez en beauté !' })}
            onTimerStart={start}
            onTimerPause={pause}
            onTimerReset={reset}
            onTimerRemove={removeTimer}
            onTimerDuplicate={duplicate}
            onTimerUpdate={edit}
            onTimerLap={addLap}
            onTimerLapLabelChange={updateLapLabel}
            onTimerLapRemove={removeLap}
          />
        )}

        {activeSection === 'sessions' && (
          <SessionsSection
            sessions={sessions}
            timers={timers}
            onCreateSession={createSession}
            onRemoveSession={removeSession}
            onDuplicateSession={duplicateSession}
          />
        )}

        {activeSection === 'live' && (
          <LiveSection
            sessions={sessions}
            timers={timers}
            playback={playback}
            onTimerStart={start}
            onTimerPause={pause}
            onTimerReset={reset}
          />
        )}
      </AppShell>

      {/* Actions flottantes */}
      <FloatingTimerAction timers={timers} onCreateTimer={addTimer} onStartTimer={start} />

      {/* Mini live bar légèrement au-dessus de la bottom nav sur mobile */}
      <MiniLiveBar
        timers={timers}
        sessions={sessions}
        onStartTimer={start}
        onPauseTimer={pause}
        onResetTimer={reset}
        playback={playback}
      />

      {/* Bottom nav mobile */}
      <BottomNav activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  );
}