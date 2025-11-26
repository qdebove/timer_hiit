'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TimerSession } from '@/types/timer';

export type PlaybackStep = {
  id: string;
  label: string;
  durationMs: number;
  type: 'segment' | 'rest';
  color: string;
};

export const useSessionPlayback = (sessions: TimerSession[]) => {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(sessions[0]?.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const lastTickRef = useRef<number>();

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [activeSessionId, sessions]
  );

  const steps = useMemo<PlaybackStep[]>(() => {
    if (!activeSession) return [];
    const baseDelay = activeSession.delayBetweenMs ?? 0;

    const expanded: PlaybackStep[] = [];

    activeSession.segments.forEach((segment, segmentIndex) => {
      for (let repetition = 0; repetition < segment.repetitions; repetition += 1) {
        expanded.push({
          id: `${segment.id}-${repetition}`,
          label: segment.label,
          durationMs: segment.durationMs,
          type: 'segment',
          color: segment.color
        });

        const shouldAddRest = baseDelay > 0 && !(segmentIndex === activeSession.segments.length - 1 && repetition === segment.repetitions - 1);
        if (shouldAddRest) {
          expanded.push({
            id: `${segment.id}-rest-${repetition}`,
            label: 'Repos',
            durationMs: baseDelay,
            type: 'rest',
            color: '#64748b'
          });
        }
      }
    });

    return expanded;
  }, [activeSession]);

  const currentStep = steps[currentIndex];
  const nextStep = steps[currentIndex + 1];

  useEffect(() => {
    if (sessions.length === 0) {
      setActiveSessionId(undefined);
      return;
    }

    if (!activeSessionId || !sessions.some((session) => session.id === activeSessionId)) {
      setActiveSessionId(sessions[0].id);
    }
  }, [activeSessionId, sessions]);

  useEffect(() => {
    setCurrentIndex(0);
    setRemainingMs(steps[0]?.durationMs ?? 0);
    setIsRunning(false);
    setCompleted(false);
  }, [activeSessionId, steps]);

  const handleAdvance = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= steps.length) {
        setIsRunning(false);
        setCompleted(true);
        setRemainingMs(0);
        return prev;
      }
      setRemainingMs(steps[nextIndex].durationMs);
      lastTickRef.current = Date.now();
      return nextIndex;
    });
  }, [steps]);

  useEffect(() => {
    if (!isRunning || !currentStep) return undefined;
    lastTickRef.current = Date.now();

    const interval = window.setInterval(() => {
      setRemainingMs((prev) => {
        const now = Date.now();
        const delta = now - (lastTickRef.current ?? now);
        lastTickRef.current = now;
        const nextRemaining = prev - delta;
        if (nextRemaining <= 0) {
          handleAdvance();
          return 0;
        }
        return nextRemaining;
      });
    }, 200);

    return () => window.clearInterval(interval);
  }, [currentStep, handleAdvance, isRunning]);

  const start = () => {
    if (!currentStep) return;
    setIsRunning(true);
    setCompleted(false);
    if (remainingMs === 0) setRemainingMs(currentStep.durationMs);
    lastTickRef.current = Date.now();
  };

  const pause = () => setIsRunning(false);

  const resetStep = () => {
    if (!currentStep) return;
    setRemainingMs(currentStep.durationMs);
    setCompleted(false);
    setIsRunning(false);
  };

  const stop = () => {
    if (steps.length === 0) return;
    setCurrentIndex(0);
    setRemainingMs(steps[0].durationMs);
    setIsRunning(false);
    setCompleted(false);
  };

  const skip = () => {
    if (!currentStep) return;
    handleAdvance();
  };

  const sessionDuration = useMemo(
    () => steps.reduce((total, step) => total + step.durationMs, 0),
    [steps]
  );

  return {
    activeSessionId,
    setActiveSessionId,
    currentIndex,
    currentStep,
    nextStep,
    remainingMs,
    isRunning,
    completed,
    steps,
    start,
    pause,
    resetStep,
    stop,
    skip,
    sessionDuration
  } as const;
};
