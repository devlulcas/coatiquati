'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PerfStore = {
  perfMode: boolean;
  togglePerfMode: () => void;
};

export const usePerfStore = create<PerfStore>()(
  persist(
    set => ({
      perfMode: false,
      togglePerfMode: () => set(state => ({ perfMode: !state.perfMode })),
    }),
    {
      name: 'perf-mode-store',
    },
  ),
);
