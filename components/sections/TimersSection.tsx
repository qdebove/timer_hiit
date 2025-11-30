import { TimerForm } from '@/components/TimerForm';
import { TimerLibrary } from '@/components/timers/TimerLibrary';
import { Modal } from '@/components/ui/Modal';
import { PillButton } from '@/components/ui/PillButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { TimerConfig } from '@/types/timer';
import { useState } from 'react';

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

const ChronoTip = () => (
  <aside className="max-w-xs rounded-2xl border border-dashed border-primary-200/70 bg-primary-50/70 px-3 py-2 text-xs sm:text-sm dark:border-primary-900/60 dark:bg-primary-500/10">
    <p className="font-semibold text-primary-700 dark:text-primary-200">
      Astuce chrono
    </p>
    <p className="mt-1 text-slate-600 dark:text-slate-300">
      Inspirez-vous de vos sessions : ajoutez des étapes nommées, renommez-les ou
      supprimez-les directement depuis la carte du chrono.
    </p>
  </aside>
);

export const TimersSection = ({
  stats,
  timers,
  onCreateTimer,
  ...timerHandlers
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (payload: any) => {
    onCreateTimer(payload);
    setIsModalOpen(false);
  };

  return (
    <section className="space-y-5 lg:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader
          eyebrow="Timers"
          title="Créer et gérer vos timers"
          description="Gérez votre bibliothèque de chronomètres et comptes à rebours."
        />
        <div className="flex shrink-0 items-center gap-3">
          <PillButton onClick={() => setIsModalOpen(true)}>
            + Nouveau timer
          </PillButton>
        </div>
      </div>

      {/* Tip visible on desktop if needed, or integrated elsewhere. For now, keeping it simple or removing if clutter. 
          Let's keep it but maybe below header or as a side note if layout permits. 
          Actually, let's put it in the list or just remove it to clean up as requested. 
          User asked for "better UX" and "make it easy". Less clutter is better. 
          I will remove the ChronoTip from the main view to simplify.
      */}

      <TimerLibrary
        timers={timers}
        stats={{ totalLaps: stats.totalLaps }}
        {...timerHandlers}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau timer"
      >
        <TimerForm
          onCreate={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </section>
  );
};
