'use client';

import type { NavSection } from '@/components/layout/AppShell';
import { TimerLibrary } from '@/components/timers/TimerLibrary';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { TimerConfig } from '@/types/timer';

interface Stats {
  timersTotal: number;
  runningTimers: number;
  countdowns: number;
  stopwatches: number;
  sessions: number;
  totalLaps: number;
}

interface Props {
  stats: Stats;
  timers: TimerConfig[];
  onSelectSection: (section: NavSection) => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate: (id: string, payload: any) => void;
  onLap: (id: string, label?: string) => void;
  onLapLabelChange: (timerId: string, lapId: string, label: string) => void;
  onLapRemove: (timerId: string, lapId: string) => void;
}

const QUICK_LINKS = [
  { id: 'timers', title: 'Créer un timer', detail: 'Compte à rebours ou chrono' },
  { id: 'sessions', title: 'Créer une session', detail: 'Enchaînez vos timers' },
  { id: 'live', title: 'Lecture en direct', detail: 'Piloter en live' }
] as const;

export const OverviewSection = ({
  stats,
  timers,
  onSelectSection,
  ...timerHandlers
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 shadow-card dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <SectionHeader
              eyebrow="Tableau de bord"
              title="Bienvenue dans vos timers"
              description="Visualisez l’essentiel puis lancez-vous : timers, sessions ou lecture en direct."
            />

            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onSelectSection(link.id as NavSection)}
                  className="rounded-full bg-white/80 px-4 py-2 shadow-inner transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900/80"
                >
                  {link.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
            <StatCard
              label="Timers"
              value={stats.timersTotal}
              sub={`Rebours ${stats.countdowns} • Chronos ${stats.stopwatches}`}
            />
            <StatCard label="Sessions" value={stats.sessions} sub="Assemblages prêts à lancer" tone="amber" />
            <StatCard label="En cours" value={stats.runningTimers} sub="Timers actifs" tone="emerald" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Chronos favoris</p>
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {stats.totalLaps} étapes notées
            </span>
          </div>

          <TimerLibrary
            timers={timers}
            stats={{ totalLaps: stats.totalLaps }}
            {...timerHandlers}
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  tone?: 'amber' | 'emerald' | 'default';
}

const StatCard = ({ label, value, sub, tone = 'default' }: StatCardProps) => {
  const toneClass =
    tone === 'amber'
      ? 'text-amber-600 dark:text-amber-300'
      : tone === 'emerald'
        ? 'text-emerald-600 dark:text-emerald-300'
        : 'text-primary-600 dark:text-primary-300';

  return (
    <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-2xl font-black ${toneClass}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
};