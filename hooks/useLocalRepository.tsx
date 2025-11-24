'use client';

import { useEffect, useState } from 'react';

export const useLocalRepository = <T,>(key: string, defaultValue: T[]) => {
  const [items, setItems] = useState<T[]>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(key);
    if (stored) {
      setItems(JSON.parse(stored) as T[]);
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(items));
  }, [hydrated, items, key]);

  return { items, setItems, hydrated } as const;
};
