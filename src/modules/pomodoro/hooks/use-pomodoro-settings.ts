import { useSession } from '@/modules/auth/hooks/use-session';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PomodoroSettings } from '../../database/schema/pomodoro-settings';
import { fetchPomodoroSettings, updatePomodoroSettings } from '../lib/fetchers';
import { DEFAULT_POMODORO_CONFIG, getLocalSettings, setLocalSettings } from '../lib/local-storage';
import type { PomodoroSettingsInput } from '../types/pomodoro';

export const POMODORO_SETTINGS_QUERY_KEY = 'POMODORO_SETTINGS_QUERY_KEY';

type PomodoroSettingsOptions = {
  onSuccess?: (data: PomodoroSettings) => void;
}

export function usePomodoroSettings({ onSuccess }: PomodoroSettingsOptions = {}) {
  const { data: session } = useSession();

  const query = useQuery<PomodoroSettings, Error>({
    queryKey: [POMODORO_SETTINGS_QUERY_KEY],
    queryFn: session.data ? fetchPomodoroSettings : getLocalSettings,
    enabled: true,
    onSuccess
  });

  return { ...query, data: query.data ?? DEFAULT_POMODORO_CONFIG };
}

export function useUpdatePomodoroSettings() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<PomodoroSettings, Error, PomodoroSettingsInput>({
    mutationFn: async (settings) => {
      if (session.data) {
        return updatePomodoroSettings(settings);
      } else {
        const localSettings = getLocalSettings();
        const updatedSettings = { ...localSettings, ...settings };
        console.log('updatedSettings', updatedSettings);
        setLocalSettings(updatedSettings);
        return updatedSettings;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POMODORO_SETTINGS_QUERY_KEY] });
    },
  });
} 
