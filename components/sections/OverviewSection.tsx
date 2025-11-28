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
    <div className="space-y-5 lg:space-y-6">
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
        <SectionHeader
          eyebrow="Tableau de bord"
          title="Bienvenue dans vos timers"
          description="Visualisez l’essentiel puis lancez-vous : timers, sessions ou lecture en direct."
        />

        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelectSection(link.id as NavSection)}
              className="rounded-full bg-slate-50 px-4 py-2 shadow-inner transition hover:-translate-y-0.5 hover:shadow md:px-5 dark:bg-slate-800/80"
            >
              {link.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            label="Timers"
            value={stats.timersTotal}
            sub={`Rebours ${stats.countdowns} • Chronos ${stats.stopwatches}`}
          />
          <StatCard label="Sessions" value={stats.sessions} sub="Assemblages prêts à lancer" tone="amber" />
          <StatCard label="En cours" value={stats.runningTimers} sub="Timers actifs" tone="emerald" />
        </div>
      </div>

      <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
        <div className="flex items-center justify-between gap-3">
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
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-2xl font-black ${toneClass}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
};