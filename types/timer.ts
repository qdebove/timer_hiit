export type TimerKind = 'stopwatch' | 'countdown';

export interface TimerConfig {
  id: string;
  name: string;
  kind: TimerKind;
  color: string;
  durationMs: number;
  sound?: string;
  note?: string;
  isRunning: boolean;
  elapsedMs: number;
  remainingMs: number;
  lastStartedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SessionSegment {
  id: string;
  label: string;
  durationMs: number;
  restMs?: number;
  repetitions: number;
  color: string;
}

export interface TimerSession {
  id: string;
  name: string;
  segments: SessionSegment[];
  delayBetweenMs?: number;
  autoStartNext: boolean;
  createdAt: number;
  updatedAt: number;
}
