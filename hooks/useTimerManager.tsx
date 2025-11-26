'use client';

import { useEffect, useMemo } from 'react';
import { createId } from '@/lib/utils';
import { useLocalRepository } from './useLocalRepository';
import type { TimerConfig, TimerKind, TimerLap } from '@/types/timer';

const TIMER_STORAGE_KEY = 'timer-hiit:timers';

interface TimerInput {
  name: string;
  kind: TimerKind;
  durationMs: number;
  color: string;
  sound?: string;
  note?: string;
}

export const useTimerManager = () => {
  const { items: timers, setItems: setTimers, hydrated } = useLocalRepository<TimerConfig>(
    TIMER_STORAGE_KEY,
    []
  );

  useEffect(() => {
    if (!hydrated) return;
    setTimers((prev) => prev.map((timer) => ({ ...timer, laps: timer.laps ?? [] })));
  }, [hydrated, setTimers]);

  const hasRunning = useMemo(() => timers.some((timer) => timer.isRunning), [timers]);

  useEffect(() => {
    if (!hasRunning) return;
    const interval = window.setInterval(() => {
      setTimers((prev) =>
        prev.map((timer) => {
          if (!timer.isRunning || !timer.lastStartedAt) return timer;
          const now = Date.now();
          const delta = now - timer.lastStartedAt;
          const updatedElapsed = timer.elapsedMs + delta;

          if (timer.kind === 'countdown') {
            const nextRemaining = Math.max(timer.durationMs - updatedElapsed, 0);
            const finished = nextRemaining === 0;
            return {
              ...timer,
              elapsedMs: finished ? timer.durationMs : updatedElapsed,
              remainingMs: nextRemaining,
              isRunning: !finished,
              lastStartedAt: finished ? undefined : now,
              updatedAt: now
            };
          }

          const stopwatchTarget = timer.durationMs > 0 ? timer.durationMs : Number.POSITIVE_INFINITY;
          const cappedElapsed = Math.min(updatedElapsed, stopwatchTarget);
          const finished = cappedElapsed >= stopwatchTarget;
          return {
            ...timer,
            elapsedMs: cappedElapsed,
            remainingMs: Math.max(stopwatchTarget - cappedElapsed, 0),
            isRunning: !finished,
            lastStartedAt: finished ? undefined : now,
            updatedAt: now
          };
        })
      );
    }, 250);

    return () => window.clearInterval(interval);
  }, [hasRunning, setTimers]);

  const addTimer = (input: TimerInput) => {
    const now = Date.now();
    const id = createId();
    setTimers((prev) => [
      ...prev,
      {
        ...input,
        id,
        elapsedMs: 0,
        remainingMs: input.kind === 'countdown' ? input.durationMs : input.durationMs,
        isRunning: false,
        laps: [],
        createdAt: now,
        updatedAt: now
      }
    ]);

    return id;
  };

  const updateTimer = (id: string, updater: (timer: TimerConfig) => TimerConfig) => {
    setTimers((prev) => prev.map((timer) => (timer.id === id ? updater(timer) : timer)));
  };

  const removeTimer = (id: string) => setTimers((prev) => prev.filter((timer) => timer.id !== id));

  const start = (id: string) => {
    const now = Date.now();
    updateTimer(id, (timer) => ({
      ...timer,
      isRunning: true,
      lastStartedAt: now,
      updatedAt: now
    }));
  };

  const pause = (id: string) => {
    const now = Date.now();
    updateTimer(id, (timer) => {
      if (!timer.isRunning || !timer.lastStartedAt) return timer;
      const delta = now - timer.lastStartedAt;
      const elapsed = timer.elapsedMs + delta;
      const remaining = Math.max(timer.durationMs - elapsed, 0);
      return {
        ...timer,
        elapsedMs: timer.kind === 'countdown' ? Math.min(elapsed, timer.durationMs) : elapsed,
        remainingMs: timer.kind === 'countdown' ? remaining : Math.max(timer.durationMs - elapsed, 0),
        isRunning: false,
        lastStartedAt: undefined,
        updatedAt: now
      };
    });
  };

  const reset = (id: string) => {
    const now = Date.now();
    updateTimer(id, (timer) => ({
      ...timer,
      isRunning: false,
      elapsedMs: 0,
      remainingMs: timer.durationMs,
      lastStartedAt: undefined,
      laps: [],
      updatedAt: now
    }));
  };

  const addLap = (id: string, label?: string) => {
    const now = Date.now();
    updateTimer(id, (timer) => {
      if (timer.kind !== 'stopwatch') return timer;
      const laps = timer.laps ?? [];
      const liveElapsed =
        timer.isRunning && timer.lastStartedAt ? timer.elapsedMs + (now - timer.lastStartedAt) : timer.elapsedMs;
      const lap: TimerLap = {
        id: createId(),
        label: label ?? `Étape ${laps.length + 1}`,
        elapsedMs: liveElapsed,
        createdAt: now
      };

      return {
        ...timer,
        elapsedMs: liveElapsed,
        remainingMs: Math.max(timer.durationMs - liveElapsed, 0),
        lastStartedAt: timer.isRunning ? now : timer.lastStartedAt,
        laps: [...laps, lap],
        updatedAt: now
      };
    });
  };

  const duplicate = (id: string) => {
    const timer = timers.find((item) => item.id === id);
    if (!timer) return;
    addTimer({
      name: `${timer.name} (copie)`,
      kind: timer.kind,
      durationMs: timer.durationMs,
      color: timer.color,
      sound: timer.sound,
      note: timer.note
    });
  };

  const edit = (id: string, payload: { name: string; kind: TimerKind; durationMs: number; color: string }) => {
    const now = Date.now();
    updateTimer(id, (timer) => {
      if (timer.isRunning) return timer;
      return {
        ...timer,
        ...payload,
        elapsedMs: 0,
        remainingMs: payload.durationMs,
        lastStartedAt: undefined,
        updatedAt: now
      };
    });
  };

  return {
    timers,
    hydrated,
    addTimer,
    updateTimer,
    removeTimer,
    start,
    pause,
    reset,
    addLap,
    duplicate,
    edit
  } as const;
};
