'use client';

import { LiveTimersList } from '@/components/live/LiveTimersList';
import { SessionRunner } from '@/components/SessionRunner';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { useSessionPlayback } from '@/hooks/useSessionPlayback';
import type { TimerConfig, TimerSession } from '@/types/timer';

interface Props {
  sessions: TimerSession[];
  timers: TimerConfig[];
  playback: ReturnType<typeof useSessionPlayback>;
  onTimerStart: (id: string) => void;
  onTimerPause: (id: string) => void;
  onTimerReset: (id: string) => void;
}

export const LiveSection = ({
  sessions,
  timers,
  playback,
  onTimerStart,
  onTimerPause,
  onTimerReset
}: Props) => {
  const activeTimers = timers.filter(
    (t) => t.isRunning || t.elapsedMs > 0 || t.remainingMs < t.durationMs
  );

  return (
    <div className="space-y-4">
      <Card variant="accent" className="p-5">
        <SectionHeader
          eyebrow="Lecture en direct"
          title="Pilotez vos timers et sessions"
          description="Lancez, mettez en pause ou passez une étape sans quitter la page."
          rightSlot={
            <div className="rounded-2xl bg-white/70 px-4 py-3 text-right text-xs font-semibold text-slate-700 shadow-inner dark:bg-slate-900/60 dark:text-slate-100">
              <p className="uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Sessions prêtes
              </p>
              <p className="text-xl font-black">{sessions.length}</p>
            </div>
          }
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <Card variant="surface" className="p-4">
          <SessionRunner sessions={sessions} playback={playback} />
        </Card>

        <LiveTimersList
          timers={activeTimers}
          onStartTimer={onTimerStart}
          onPauseTimer={onTimerPause}
          onResetTimer={onTimerReset}
        />
      </div>
    </div>
  );
};