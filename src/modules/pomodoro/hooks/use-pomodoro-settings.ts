import type { SelectPomodoroSettings } from '@/modules/database/schema/pomodoro-settings';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchPomodoroSettings, updatePomodoroSettings } from '../lib/fetchers';
import {
  DEFAULT_POMODORO_CONFIG,
  getLocalSettings,
  setLocalSettings,
} from '../lib/local-storage';
import type { PomodoroSettingsSchema } from '../schemas/pomodoro-schema';

const POMODORO_SETTINGS_QUERY_KEY = 'POMODORO_SETTINGS_QUERY_KEY';

type PomodoroSettingsOptions = {
  onSuccess?: (data: PomodoroSettingsSchema) => void;
};

export function usePomodoroSettings({
  onSuccess,
}: PomodoroSettingsOptions = {}) {
  const { data: user } = useCurrentUserDataQuery();

  const query = useQuery<SelectPomodoroSettings, Error>({
    queryKey: [POMODORO_SETTINGS_QUERY_KEY],
    queryFn: user ? fetchPomodoroSettings : getLocalSettings,
    enabled: true,
  });

  useEffect(() => {
    if (query.isSuccess && user) {
      onSuccess?.(query.data);
    }
  }, [onSuccess, query.data, query.isSuccess, user]);

  return { ...query, data: query.data ?? DEFAULT_POMODORO_CONFIG };
}

export function useUpdatePomodoroSettings() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUserDataQuery();

  return useMutation<SelectPomodoroSettings, Error, PomodoroSettingsSchema>({
    mutationFn: async (settings) => {
      if (user) {
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
      queryClient.invalidateQueries({
        queryKey: [POMODORO_SETTINGS_QUERY_KEY],
      });
    },
  });
}
