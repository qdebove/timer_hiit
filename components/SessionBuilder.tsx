'use client';

import { useState } from 'react';
import { createId, formatDuration, parseDurationToMs } from '@/lib/utils';
import type { SessionSegment, TimerSession } from '@/types/timer';

interface Props {
  sessions: TimerSession[];
  onCreate: (session: { name: string; segments: SessionSegment[]; delayBetweenMs?: number; autoStartNext: boolean }) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const SessionBuilder = ({ sessions, onCreate, onRemove, onDuplicate }: Props) => {
  const [name, setName] = useState('Session HIIT');
  const [segments, setSegments] = useState<SessionSegment[]>([]);
  const [autoStartNext, setAutoStartNext] = useState(true);
  const [delayBetween, setDelayBetween] = useState(5);
  const [segmentForm, setSegmentForm] = useState({ label: 'Sprint', minutes: 0, seconds: 20, repetitions: 1 });

  const addSegment = () => {
    const durationMs = parseDurationToMs(segmentForm.minutes, segmentForm.seconds);
    const newSegment: SessionSegment = {
      id: createId(),
      label: segmentForm.label,
      durationMs,
      repetitions: Math.max(1, segmentForm.repetitions),
      color: '#22c55e',
      restMs: delayBetween * 1000
    };
    setSegments((prev) => [...prev, newSegment]);
  };

  const handleCreateSession = () => {
    onCreate({ name, segments, delayBetweenMs: delayBetween * 1000, autoStartNext });
    setSegments([]);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sessions</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Orchestrateur</h3>
        </div>
        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
          {sessions.length} définies
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Nom de la session</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Délai entre segments (s)</label>
          <input
            type="number"
            min={0}
            value={delayBetween}
            onChange={(e) => setDelayBetween(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-dashed border-slate-200 p-3 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Nom</label>
            <input
              value={segmentForm.label}
              onChange={(e) => setSegmentForm((prev) => ({ ...prev, label: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Minutes</label>
            <input
              type="number"
              min={0}
              value={segmentForm.minutes}
              onChange={(e) =>
                setSegmentForm((prev) => ({ ...prev, minutes: parseInt(e.target.value, 10) || 0 }))
              }
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Secondes</label>
            <input
              type="number"
              min={0}
              value={segmentForm.seconds}
              onChange={(e) =>
                setSegmentForm((prev) => ({ ...prev, seconds: parseInt(e.target.value, 10) || 0 }))
              }
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Répétitions</label>
            <input
              type="number"
              min={1}
              value={segmentForm.repetitions}
              onChange={(e) =>
                setSegmentForm((prev) => ({ ...prev, repetitions: parseInt(e.target.value, 10) || 1 }))
              }
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addSegment}
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Ajouter le segment
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Chaque segment peut inclure un temps de repos de {delayBetween}s
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {segments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Aucun segment ajouté pour l&apos;instant.</p>
        ) : (
          <ul className="space-y-2">
            {segments.map((segment) => (
              <li
                key={segment.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{segment.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDuration(segment.durationMs)} • {segment.repetitions}x
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Repos {delayBetween}s</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={autoStartNext}
            onChange={(e) => setAutoStartNext(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          Lancer automatiquement le segment suivant
        </label>
        <button
          type="button"
          onClick={handleCreateSession}
          className="rounded-full bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Créer la session
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Session</p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50">{session.name}</h4>
              </div>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                {session.segments.length} segments
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-200">
              {session.segments.map((segment) => (
                <li key={segment.id} className="flex items-center justify-between rounded-lg bg-white/80 px-2 py-1 dark:bg-slate-900/60">
                  <span>{segment.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDuration(segment.durationMs)} • {segment.repetitions}x
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2 text-sm font-medium">
              <button
                type="button"
                onClick={() => onDuplicate(session.id)}
                className="rounded-full border border-slate-200 px-3 py-2 text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Dupliquer
              </button>
              <button
                type="button"
                onClick={() => onRemove(session.id)}
                className="rounded-full border border-rose-200 px-3 py-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
