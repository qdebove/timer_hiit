'use client';

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
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionHeader
        eyebrow="Lecture en direct"
        title="Session en cours"
        description="Suivez votre session étape par étape."
      />

      <Card variant="surface" className="p-1 shadow-lg">
        <SessionRunner sessions={sessions} playback={playback} />
      </Card>
    </div>
  );
};