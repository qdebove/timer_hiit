'use client';

import { TimerForm } from '@/components/TimerForm';
import { TimerLibrary } from '@/components/timers/TimerLibrary';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { TimerConfig } from '@/types/timer';

interface Stats {
  totalLaps: number;
}

interface Props {
  stats: Stats;
  timers: TimerConfig[];
  onCreateTimer: (payload: any) => void;
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

export const TimersSection = ({
  stats,
  timers,
  onCreateTimer,
  ...timerHandlers
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/70 lg:grid-cols-[360px,1fr]">
        <div className="space-y-3">
          <SectionHeader
            eyebrow="Timers"
            title="Créer et gérer vos timers"
            description="Choisissez un compte à rebours ou un chronomètre, prévisualisez, puis enregistrez."
          />
          <TimerForm onCreate={onCreateTimer} />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 p-4 dark:border-primary-900/60 dark:bg-primary-500/10">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-200">Astuce chrono</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Inspirez-vous de vos sessions : ajoutez des étapes nommées, renommez-les ou supprimez-les directement depuis la carte du chrono.
            </p>
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