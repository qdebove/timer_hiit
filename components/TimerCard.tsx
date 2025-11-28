'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { formatDuration, parseDurationToMs } from '@/lib/utils';
import type { TimerConfig, TimerKind } from '@/types/timer';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  timer: TimerConfig;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate: (id: string, payload: { name: string; durationMs: number; color: string; kind: TimerKind }) => void;
  onLap: (id: string, label?: string) => void;
  onLapLabelChange: (timerId: string, lapId: string, label: string) => void;
  onLapRemove: (timerId: string, lapId: string) => void;
}

export const TimerCard = ({
  timer,
  onStart,
  onPause,
  onReset,
  onRemove,
  onDuplicate,
  onUpdate,
  onLap,
  onLapLabelChange,
  onLapRemove
}: Props) => {
  const hasTarget = timer.kind === 'countdown' || timer.durationMs > 0;
  const progress = hasTarget
    ? Math.min(100, (timer.elapsedMs / (timer.durationMs || 1)) * 100 || 0)
    : 0;
  const displayTime =
    timer.kind === 'countdown'
      ? formatDuration(timer.remainingMs)
      : formatDuration(timer.elapsedMs);
  const laps = timer.laps ?? [];

  const [showAdmin, setShowAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(timer.name);
  const [kind, setKind] = useState<TimerKind>(timer.kind);
  const [minutes, setMinutes] = useState(() => Math.floor(timer.durationMs / 60000));
  const [seconds, setSeconds] = useState(
    () => Math.floor((timer.durationMs % 60000) / 1000)
  );
  const [color, setColor] = useState(timer.color);
  const [customLapLabel, setCustomLapLabel] = useState('');

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

  const handleCustomLap = () => {
    const label = customLapLabel.trim();
    onLap(timer.id, label.length > 0 ? label : undefined);
    setCustomLapLabel('');
  };

  const canEdit = useMemo(() => !timer.isRunning, [timer.isRunning]);

  const typeLabel =
    timer.kind === 'countdown' ? 'Compte à rebours' : 'Chronomètre';

  // Icône principale selon type + état
  const mainIcon = timer.isRunning
    ? '❚❚'
    : timer.kind === 'countdown'
      ? '▶'
      : '⏱️';

  return (
    <Card
      variant="surface"
      className={[
        'relative flex flex-col gap-3 transition-all duration-200',
        timer.isRunning
          ? 'border-primary-300/80 shadow-primary-500/20 ring-1 ring-primary-300/60 dark:border-primary-700/70 dark:ring-primary-500/40'
          : 'hover:-translate-y-0.5 hover:shadow-lg'
      ].join(' ')}
    >
      {/* Halo animé quand le timer tourne */}
      {timer.isRunning && (
        <span
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-primary-500/5 blur-sm"
          aria-hidden
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span aria-hidden>{timer.kind === 'countdown' ? '⬇️' : '⏱️'}</span>
            {typeLabel}
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {timer.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={timer.isRunning ? 'soft' : 'default'}>
            {timer.isRunning ? 'En cours' : 'Prêt'}
          </Badge>
          <div className="relative h-3 w-3">
            {/* Ping animé quand en cours */}
            {timer.isRunning && (
              <span
                className="absolute inset-0 rounded-full bg-primary-500/40 animate-ping"
                aria-hidden
              />
            )}
            <span
              className="absolute inset-0 rounded-full border border-white/50 shadow-sm"
              style={{ background: timer.color }}
            />
          </div>
        </div>
      </div>

      {/* Zone principale chrono */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-900/95 px-4 py-3 text-white shadow-inner transition-colors duration-200 dark:bg-slate-800 md:flex-nowrap">
        <button
          type="button"
          onClick={() => (timer.isRunning ? onPause(timer.id) : onStart(timer.id))}
          aria-pressed={timer.isRunning}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-lg font-black text-emerald-950 shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          {mainIcon}
        </button>

        <div className="flex flex-col">
          <span className="text-4xl font-mono font-black tracking-tight tabular-nums">
            {displayTime}
          </span>
          {timer.durationMs > 0 && timer.kind === 'stopwatch' && (
            <span className="text-xs font-semibold text-emerald-100/80">
              Cible {formatDuration(timer.durationMs)}
            </span>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-200">
          <PillButton
            size="xs"
            variant="outline"
            onClick={() => onPause(timer.id)}
          >
            Arrêt
          </PillButton>
          <PillButton
            size="xs"
            variant="outline"
            onClick={() => onReset(timer.id)}
          >
            Reset
          </PillButton>
          {timer.kind === 'stopwatch' && (
            <PillButton
              size="xs"
              variant="outline"
              onClick={() => onLap(timer.id)}
            >
              Étape
            </PillButton>
          )}
        </div>
      </div>

      {/* Barre de progression / état libre */}
      {hasTarget ? (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Chrono libre en cours
        </div>
      )}

      {/* Footer statut */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span
            className={[
              'h-2 w-2 rounded-full',
              timer.isRunning
                ? 'bg-emerald-400'
                : 'bg-slate-300 dark:bg-slate-600'
            ].join(' ')}
          />
          {timer.isRunning ? 'Lecture en cours' : 'Prêt à démarrer'}
        </span>
        <PillButton
          size="xs"
          variant="outline"
          onClick={() => setShowAdmin((prev) => !prev)}
        >
          {showAdmin ? 'Fermer' : 'Gestion'}
        </PillButton>
      </div>

      {/* Panneau admin : apparition avec micro transition */}
      {showAdmin && (
        <div className="space-y-4 rounded-2xl border border-dashed border-slate-200 p-3 text-sm font-medium text-slate-600 shadow-inner transition-all duration-200 ease-out animate-[fadeIn_150ms_ease-out] dark:border-slate-700 dark:text-slate-300">
          {/* Actions timer */}
          <div className="flex flex-wrap gap-2">
            <PillButton
              size="sm"
              variant="outline"
              onClick={() => onDuplicate(timer.id)}
            >
              Dupliquer
            </PillButton>
            <PillButton
              size="sm"
              variant="danger"
              onClick={() => onRemove(timer.id)}
            >
              Supprimer
            </PillButton>
            <PillButton
              size="sm"
              variant="outline"
              disabled={!canEdit}
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? 'Terminer' : 'Éditer'}
            </PillButton>
          </div>

          {/* Laps */}
          {timer.kind === 'stopwatch' && laps.length > 0 && (
            <div className="rounded-xl bg-white/80 p-3 text-xs shadow-inner dark:bg-slate-900/60">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Étapes
                  </span>
                  <Badge variant="default">{laps.length}</Badge>
                </div>
              </div>
              <ul className="space-y-1">
                {laps.map((lap) => (
                  <li
                    key={lap.id}
                    className="flex flex-col gap-1 rounded-md bg-slate-100/80 px-2 py-2 font-mono text-[12px] font-semibold text-slate-700 shadow-sm dark:bg-slate-800/60 dark:text-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        value={lap.label}
                        onChange={(event) =>
                          onLapLabelChange(timer.id, lap.id, event.target.value)
                        }
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] font-semibold text-slate-800 shadow-inner focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <PillButton
                        size="xs"
                        variant="danger"
                        onClick={() => onLapRemove(timer.id, lap.id)}
                      >
                        Suppr
                      </PillButton>
                    </div>
                    <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-300">
                      {formatDuration(lap.elapsedMs)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Edition des propriétés */}
          {editMode && (
            <div className="space-y-2 rounded-xl bg-slate-50/80 p-3 text-xs shadow-inner dark:bg-slate-800/60">
              {!canEdit && (
                <p className="text-rose-500 dark:text-rose-300">
                  Pausez le timer pour pouvoir le modifier.
                </p>
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
                <PillButton
                  size="sm"
                  variant="primary"
                  onClick={handleSave}
                  disabled={!canEdit}
                >
                  Enregistrer
                </PillButton>
              </div>
            </div>
          )}

          {/* Ajout d'étape nommée */}
          {timer.kind === 'stopwatch' && (
            <div className="space-y-2 rounded-xl bg-slate-50/80 p-3 text-xs shadow-inner dark:bg-slate-800/60">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Ajouter une étape nommée
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={customLapLabel}
                  onChange={(event) => setCustomLapLabel(event.target.value)}
                  placeholder="Sprint, repos actif..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <PillButton
                  size="sm"
                  variant="primary"
                  onClick={handleCustomLap}
                >
                  Ajouter l&apos;étape
                </PillButton>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};