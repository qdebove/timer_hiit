'use client';

import { TimerForm } from '@/components/TimerForm';
import { Modal } from '@/components/ui/Modal';
import { PillButton } from '@/components/ui/PillButton';
import { formatDuration } from '@/lib/utils';
import type { TimerConfig } from '@/types/timer';
import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    timer: TimerConfig;
    onUpdate: (id: string, payload: any) => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
    onLap: (id: string, label?: string) => void;
    onLapLabelChange: (timerId: string, lapId: string, label: string) => void;
    onLapRemove: (timerId: string, lapId: string) => void;
}

export const TimerSettingsModal = ({
    isOpen,
    onClose,
    timer,
    onUpdate,
    onRemove,
    onDuplicate,
    onLap,
    onLapLabelChange,
    onLapRemove
}: Props) => {
    const [customLapLabel, setCustomLapLabel] = useState('');

    const handleUpdate = (payload: any) => {
        onUpdate(timer.id, payload);
        onClose();
    };

    const handleDuplicate = () => {
        onDuplicate(timer.id);
        onClose();
    };

    const handleRemove = () => {
        onRemove(timer.id);
        onClose();
    };

    const handleCustomLap = () => {
        const label = customLapLabel.trim();
        onLap(timer.id, label.length > 0 ? label : undefined);
        setCustomLapLabel('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Modifier ${timer.name}`}>
            <div className="space-y-6">
                <TimerForm
                    initialValues={timer}
                    onCreate={handleUpdate}
                    onCancel={onClose}
                    submitLabel="Enregistrer"
                />

                {/* Laps Section (Stopwatch only) */}
                {timer.kind === 'stopwatch' && (
                    <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Étapes ({timer.laps?.length ?? 0})
                        </h4>

                        <div className="flex gap-2">
                            <input
                                value={customLapLabel}
                                onChange={(e) => setCustomLapLabel(e.target.value)}
                                placeholder="Nouvelle étape..."
                                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            />
                            <PillButton size="sm" onClick={handleCustomLap}>
                                Ajouter
                            </PillButton>
                        </div>

                        {timer.laps && timer.laps.length > 0 && (
                            <ul className="max-h-40 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-2 dark:bg-slate-900/50">
                                {timer.laps.map((lap) => (
                                    <li key={lap.id} className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800">
                                        <input
                                            value={lap.label}
                                            onChange={(e) => onLapLabelChange(timer.id, lap.id, e.target.value)}
                                            className="flex-1 bg-transparent text-xs font-semibold text-slate-700 focus:outline-none dark:text-slate-200"
                                        />
                                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                            {formatDuration(lap.elapsedMs)}
                                        </span>
                                        <button
                                            onClick={() => onLapRemove(timer.id, lap.id)}
                                            className="text-slate-400 hover:text-rose-500"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Actions Section */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <PillButton variant="outline" onClick={handleDuplicate}>
                        Dupliquer
                    </PillButton>
                    <PillButton variant="danger" onClick={handleRemove}>
                        Supprimer
                    </PillButton>
                </div>
            </div>
        </Modal>
    );
};
