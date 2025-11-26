'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatDuration, parseDurationToMs } from '@/lib/utils';
import type { TimerConfig, TimerKind } from '@/types/timer';

interface Props {
  timer: TimerConfig;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate: (id: string, payload: { name: string; durationMs: number; color: string; kind: TimerKind }) => void;
  onLap: (id: string) => void;
}

export const TimerCard = ({ timer, onStart, onPause, onReset, onRemove, onDuplicate, onUpdate, onLap }: Props) => {
  const hasTarget = timer.kind === 'countdown' || timer.durationMs > 0;
  const progress = hasTarget ? Math.min(100, (timer.elapsedMs / (timer.durationMs || 1)) * 100 || 0) : 0;
  const displayTime = timer.kind === 'countdown' ? formatDuration(timer.remainingMs) : formatDuration(timer.elapsedMs);
  const [showAdmin, setShowAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(timer.name);
  const [kind, setKind] = useState<TimerKind>(timer.kind);
  const [minutes, setMinutes] = useState(() => Math.floor(timer.durationMs / 60000));
  const [seconds, setSeconds] = useState(() => Math.floor((timer.durationMs % 60000) / 1000));
  const [color, setColor] = useState(timer.color);

  useEffect(() => {
    if (kind === 'stopwatch') {
      setMinutes(0);
      setSeconds(0);
    }
  }, [kind]);

  useEffect(() => {
    setName(timer.name);
    setKind(timer.kind);
    setMinutes(Math.floor(timer.durationMs / 60000));
    setSeconds(Math.floor((timer.durationMs % 60000) / 1000));
    setColor(timer.color);
    setEditMode(false);
  }, [timer]);

  const handleSave = () => {
    if (timer.isRunning) return;
    const durationMs = parseDurationToMs(minutes, seconds);
    onUpdate(timer.id, { name, durationMs, color, kind });
    setEditMode(false);
  };

  const canEdit = useMemo(() => !timer.isRunning, [timer.isRunning]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-white/80 to-slate-50/80 p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {timer.kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre'}
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{timer.name}</h3>
        </div>
        <span className="h-3 w-3 rounded-full" style={{ background: timer.color }} />
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-slate-900/90 px-4 py-3 text-white shadow-inner dark:bg-slate-800">
        <button
          type="button"
          onClick={() => (timer.isRunning ? onPause(timer.id) : onStart(timer.id))}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-lg font-black text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          {timer.isRunning ? '❚❚' : '▶'}
        </button>
        <div className="flex flex-col">
          <span className="text-4xl font-mono font-black tracking-tight">{displayTime}</span>
          {timer.durationMs > 0 && timer.kind === 'stopwatch' && (
            <span className="text-xs font-semibold text-emerald-100/80">cible {formatDuration(timer.durationMs)}</span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs uppercase tracking-wide text-slate-200">
          <button
            type="button"
            onClick={() => onPause(timer.id)}
            className="rounded-full bg-white/10 px-3 py-2 font-semibold shadow-inner transition hover:bg-white/20"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={() => onReset(timer.id)}
            className="rounded-full bg-white/10 px-3 py-2 font-semibold shadow-inner transition hover:bg-white/20"
          >
            Reset
          </button>
          {timer.kind === 'stopwatch' && (
            <button
              type="button"
              onClick={() => onLap(timer.id)}
              className="rounded-full bg-white/10 px-3 py-2 font-semibold shadow-inner transition hover:bg-white/20"
            >
              Étape
            </button>
          )}
        </div>
      </div>

      {hasTarget ? (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-700" style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Chrono libre en cours
        </div>
      )}

      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>{timer.isRunning ? 'Lecture en cours' : 'Prêt à démarrer'}</span>
        <button
          type="button"
          onClick={() => setShowAdmin((prev) => !prev)}
          className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Gestion
        </button>
      </div>

      {showAdmin && (
        <div className="space-y-3 rounded-xl border border-dashed border-slate-200 p-3 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onDuplicate(timer.id)}
              className="rounded-full border border-slate-200 px-3 py-2 text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Dupliquer
            </button>
            <button
              type="button"
              onClick={() => onRemove(timer.id)}
              className="rounded-full border border-rose-200 px-3 py-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950"
            >
              Supprimer
            </button>
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => setEditMode((prev) => !prev)}
              className="rounded-full border border-primary-200 px-3 py-2 text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary-900/60 dark:text-primary-200 dark:hover:bg-primary-500/10"
            >
              {editMode ? 'Fermer' : 'Éditer'}
            </button>
          </div>

          {timer.kind === 'stopwatch' && timer.laps.length > 0 && (
            <div className="rounded-lg bg-white/70 p-3 text-xs shadow-inner dark:bg-slate-900/60">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Étapes</p>
              <ul className="mt-1 space-y-1">
                {timer.laps.map((lap) => (
                  <li
                    key={lap.id}
                    className="flex items-center justify-between rounded-md bg-slate-100/70 px-2 py-1 font-mono text-[12px] font-semibold text-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
                  >
                    <span>{lap.label}</span>
                    <span>{formatDuration(lap.elapsedMs)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {editMode && (
            <div className="space-y-2 rounded-lg bg-slate-50/80 p-3 text-xs dark:bg-slate-800/60">
              {!canEdit && (
                <p className="text-rose-500 dark:text-rose-300">Pausez le timer pour pouvoir le modifier.</p>
              )}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <label className="space-y-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Nom
                  </span>
                  <input
                    value={name}
                    disabled={!canEdit}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </label>
                <label className="space-y-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Minutes
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={minutes}
                    disabled={!canEdit}
                    onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </label>
                <label className="space-y-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Secondes
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={seconds}
                    disabled={!canEdit}
                    onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </label>
                <label className="space-y-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Type
                  </span>
                  <select
                    value={kind}
                    disabled={!canEdit}
                    onChange={(e) => setKind(e.target.value as TimerKind)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="countdown">Compte à rebours</option>
                    <option value="stopwatch">Chronomètre</option>
                  </select>
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Couleur
                  </span>
                  <input
                    type="color"
                    value={color}
                    disabled={!canEdit}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
                  />
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canEdit}
                  className="rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
