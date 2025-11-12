import type { SelectPomodoroSession } from '@/modules/database/schema/pomodoro-sessions';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPomodoroSession } from '../lib/fetchers';
import {
  addLocalSession,
  getLocalSessions,
  setLocalSessions,
} from '../lib/local-storage';
import type { PomodoroSessionSchema } from '../schemas/pomodoro-schema';

const POMODORO_SESSIONS_QUERY_KEY = 'POMODORO_SESSIONS_QUERY_KEY';

export function useCreatePomodoroSession() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUserDataQuery();

  return useMutation<SelectPomodoroSession, Error, PomodoroSessionSchema>({
    mutationFn: async (sessionInput) => {
      if (user) {
        return createPomodoroSession(sessionInput);
      } else {
        const localSession: SelectPomodoroSession = {
          id: Date.now(),
          userId: 'userId',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          ...sessionInput,
        };
        addLocalSession(localSession);
        return localSession;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [POMODORO_SESSIONS_QUERY_KEY],
      });
    },
  });
}

export function useSyncLocalSessions() {
  const { data: user } = useCurrentUserDataQuery();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!user) return;

      const localSessions = getLocalSessions();
      if (localSessions.length === 0) return;

      // Sync each local session to the server
      await Promise.all(
        localSessions.map((session) =>
          createPomodoroSession({
            startTime: session.startTime,
            endTime: session.endTime,
            type: session.type,
            completed: session.completed,
          })
        )
      );

      // Clear local sessions after successful sync
      setLocalSessions([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [POMODORO_SESSIONS_QUERY_KEY],
      });
    },
  });
}
