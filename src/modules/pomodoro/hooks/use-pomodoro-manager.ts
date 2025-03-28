import { env } from '@/env';
import { useCreatePomodoroSession } from '@/modules/pomodoro/hooks/use-pomodoro-sessions';
import { usePomodoroSettings, useUpdatePomodoroSettings } from '@/modules/pomodoro/hooks/use-pomodoro-settings';
import { type PomodoroTimerState, type PomodoroTimerType } from '@/modules/pomodoro/types/pomodoro';
import { useToast } from '@/shared/components/ui/use-toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_POMODORO_CONFIG } from '../lib/local-storage';

export function usePomodoroManager() {
  const { toast } = useToast();
  const { mutate: updateSettings } = useUpdatePomodoroSettings();
  const { mutate: createSession } = useCreatePomodoroSession();

  const alarmSound = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new window.Audio(env.NEXT_PUBLIC_WEBSITE + '/audio/alarm-clock.wav');
  }, []);

  const [timerState, setTimerState] = useState<PomodoroTimerState>({
    previousType: 'pomodoro',
    type: 'pomodoro',
    timeRemaining: DEFAULT_POMODORO_CONFIG.pomodoroDuration,
    state: 'idle',
  });

  const { data: settings, isLoading: isLoadingSettings } = usePomodoroSettings({
    onSuccess: (data) => {
      setTimerState((prev) => ({
        ...prev,
        timeRemaining: data.pomodoroDuration,
      }));
    }
  });


  const startNextTimer = useCallback(() => {
    let nextType: PomodoroTimerType;
    let nextDuration: number;

    // POMODORO -> SHORT_BREAK -> POMODORO -> LONG_BREAK -> POMODORO -> SHORT_BREAK -> POMODORO -> ...

    if (timerState.type === 'pomodoro') {
      if (timerState.previousType === 'short_break') {
        nextType = 'long_break';
        nextDuration = settings.longBreakDuration;
      }

      if (timerState.previousType === 'long_break' || timerState.previousType === 'pomodoro') {
        nextType = 'short_break';
        nextDuration = settings.shortBreakDuration;
      }
    }

    // Depois de um break, sempre volta para o pomodoro
    if (timerState.type === 'short_break' || timerState.type === 'long_break') {
      nextType = 'pomodoro';
      nextDuration = settings.pomodoroDuration;
    }

    setTimerState((prev) => ({
      previousType: prev.type,
      type: nextType,
      timeRemaining: nextDuration,
      state: 'running',
    }));
  }, [settings.longBreakDuration, settings.pomodoroDuration, settings.shortBreakDuration, timerState.previousType, timerState.type]);

  const handleTimerComplete = useCallback(() => {
    setTimerState(prev => ({ ...prev, state: 'completed' }));
    alarmSound?.play();

    createSession({
      startTime: new Date(Date.now() - (settings.pomodoroDuration) * 1000),
      endTime: new Date(),
      type: timerState.type,
      completed: true,
      deletedAt: null,
    });

    const descriptions: Record<PomodoroTimerType, string> = {
      pomodoro: 'um pomodoro',
      short_break: 'uma pausa curta',
      long_break: 'uma pausa longa',
    };

    const titles: Record<PomodoroTimerType, string> = {
      pomodoro: 'Pomodoro finalizado!',
      short_break: 'Pausa curta finalizada!',
      long_break: 'Pausa longa finalizada!',
    };

    toast({
      title: titles[timerState.type],
      description: `Parabéns você completou ${descriptions[timerState.type]}!`,
      variant: 'success',
    });

    // Auto-start next timer based on settings
    let timeout: NodeJS.Timeout;

    if (settings.autoStartBreaks && timerState.type === 'pomodoro') {
      timeout = setTimeout(() => {
        startNextTimer();
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    alarmSound,
    createSession,
    settings.autoStartBreaks,
    settings.pomodoroDuration,
    startNextTimer,
    timerState.type,
    toast,
  ]);

  // useEffect responsável pelo timer e pelo complete do timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.state === 'running') {
      if (timerState.timeRemaining > 0) {
        interval = setInterval(() => {
          setTimerState(prev => ({
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          }));
        }, 1000);
      } else {
        handleTimerComplete();
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [handleTimerComplete, timerState.state, timerState.timeRemaining]);

  const toggleTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      state: prev.state === 'running' ? 'paused' : 'running',
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState({
      timeRemaining: settings.pomodoroDuration,
      type: 'pomodoro',
      previousType: 'pomodoro',
      state: 'idle',
    });
  }, [settings.pomodoroDuration]);

  const skipTimer = useCallback(() => {
    startNextTimer();
  }, [startNextTimer]);

  return {
    timerState,
    isLoadingSettings,
    settings,
    toggleTimer,
    resetTimer,
    skipTimer,
    updateSettings,
  };
}
