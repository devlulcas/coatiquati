'use client';

import { cn } from '@/shared/utils/cn';
import { usePerfStore } from '../../stores/perf-mode-store';

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayoutWrapper({ children }: MainLayoutProps) {
  const perfMode = usePerfStore(state => state.perfMode);

  return (
    <div className={cn('min-h-[100dvh]', perfMode ? 'bg-background/75' : 'backdrop-blur-xl')}>
      {children}
    </div>
  );
}
