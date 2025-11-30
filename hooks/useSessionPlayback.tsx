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

  // Use endTime to track the target completion time
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>();

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

  // Initialize or reset when session changes
  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  useEffect(() => {
    setCurrentIndex(0);
    setRemainingMs(steps[0]?.durationMs ?? 0);
    setIsRunning(false);
    setCompleted(false);
    endTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [activeSessionId, steps]);

  const handleAdvance = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= steps.length) {
        setIsRunning(false);
        setCompleted(true);
        setRemainingMs(0);
        endTimeRef.current = null;
        return prev;
      }
      const nextStepDuration = steps[nextIndex].durationMs;
      setRemainingMs(nextStepDuration);
      // Set new end time relative to NOW
      endTimeRef.current = Date.now() + nextStepDuration;
      return nextIndex;
    });
  }, [steps]);

  useEffect(() => {
    if (!isRunning || !currentStep) {
      endTimeRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // If starting/resuming, set the end time
    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + remainingMs;
    }

    const loop = () => {
      if (!endTimeRef.current) return;

      const now = Date.now();
      const left = Math.max(0, endTimeRef.current - now);

      setRemainingMs(left);

      if (left <= 0) {
        handleAdvance();
        // The effect will re-run due to dependency change or handleAdvance state update
        // But we need to make sure we don't loop infinitely in one frame
        // handleAdvance sets a new endTimeRef, so the next loop will pick it up
      } else {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, currentStep, handleAdvance]); // Removed remainingMs from dependency to avoid re-creating loop on every tick

  const start = () => {
    if (!currentStep) return;
    setIsRunning(true);
    setCompleted(false);
    if (remainingMs === 0) {
      setRemainingMs(currentStep.durationMs);
    }
  };

  const pause = () => {
    setIsRunning(false);
    endTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const resetStep = () => {
    if (!currentStep) return;
    setIsRunning(false);
    setRemainingMs(currentStep.durationMs);
    endTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const stop = () => {
    if (steps.length === 0) return;
    setCurrentIndex(0);
    setRemainingMs(steps[0].durationMs);
    setIsRunning(false);
    setCompleted(false);
    endTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
