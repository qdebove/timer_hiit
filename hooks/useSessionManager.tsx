'use client';

import { createId, parseDurationToMs } from '@/lib/utils';
import { useLocalRepository } from './useLocalRepository';
import type { SessionSegment, TimerSession } from '@/types/timer';

const SESSION_STORAGE_KEY = 'timer-hiit:sessions';

interface SessionInput {
  name: string;
  segments: SessionSegment[];
  delayBetweenMs?: number;
  autoStartNext: boolean;
}

export const useSessionManager = () => {
  const { items: sessions, setItems: setSessions, hydrated } = useLocalRepository<TimerSession>(
    SESSION_STORAGE_KEY,
    []
  );

  const createSession = (input: SessionInput) => {
    const now = Date.now();
    setSessions((prev) => [
      ...prev,
      {
        ...input,
        id: createId(),
        createdAt: now,
        updatedAt: now
      }
    ]);
  };

  const updateSession = (id: string, updater: (session: TimerSession) => TimerSession) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? updater(session) : session)));
  };

  const removeSession = (id: string) => setSessions((prev) => prev.filter((session) => session.id !== id));

  const duplicate = (id: string) => {
    const session = sessions.find((item) => item.id === id);
    if (!session) return;
    createSession({
      name: `${session.name} (copie)`,
      segments: session.segments.map((segment) => ({ ...segment, id: createId() })),
      delayBetweenMs: session.delayBetweenMs,
      autoStartNext: session.autoStartNext
    });
  };

  const appendSegment = (sessionId: string, segment: SessionSegment) => {
    updateSession(sessionId, (session) => ({
      ...session,
      segments: [...session.segments, segment],
      updatedAt: Date.now()
    }));
  };

  const buildSegment = (label: string, minutes: number, seconds: number, repetitions: number) => ({
    id: createId(),
    label,
    durationMs: parseDurationToMs(minutes, seconds),
    repetitions: Math.max(1, repetitions),
    color: '#38bdf8'
  });

  return {
    sessions,
    hydrated,
    createSession,
    updateSession,
    removeSession,
    duplicate,
    appendSegment,
    buildSegment
  } as const;
};
