export const NAV_ITEMS = [
  { id: 'overview', label: 'Tableau de bord', description: 'Vue d’ensemble', icon: '🏠' },
  { id: 'timers', label: 'Timers', description: 'Créer & gérer', icon: '⏱️' },
  { id: 'sessions', label: 'Sessions', description: 'Enchaînements', icon: '📋' },
  { id: 'live', label: 'Live', description: 'Lecture en direct', icon: '▶️' }
] as const;

export type NavSection = (typeof NAV_ITEMS)[number]['id'];