'use client';

import { SessionBuilder } from '@/components/SessionBuilder';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { TimerConfig, TimerSession } from '@/types/timer';

interface Props {
  sessions: TimerSession[];
  timers: TimerConfig[];
  onCreateSession: (session: {
    name: string;
    segments: any[];
    delayBetweenMs?: number;
    autoStartNext: boolean;
  }) => void;
  onRemoveSession: (id: string) => void;
  onDuplicateSession: (id: string) => void;
}

export const SessionsSection = ({
  sessions,
  timers,
  onCreateSession,
  onRemoveSession,
  onDuplicateSession
}: Props) => {
  return (
    <div className="space-y-5 lg:space-y-6">
      <SectionHeader
        eyebrow="Sessions"
        title="Composer vos sessions"
        description="Assemblez des timers existants ou créez des segments ad hoc."
        rightSlot={
          <Badge variant="soft">
            {sessions.length} session{sessions.length > 1 ? 's' : ''} définie
            {sessions.length > 1 ? 's' : ''}
          </Badge>
        }
      />

      <SessionBuilder
        sessions={sessions}
        timers={timers}
        onCreate={onCreateSession}
        onRemove={onRemoveSession}
        onDuplicate={onDuplicateSession}
      />
    </div>
  );
};