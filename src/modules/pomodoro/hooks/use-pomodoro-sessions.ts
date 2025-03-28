import { useSession } from '@/modules/auth/hooks/use-session';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PomodoroSession } from '../../database/schema/pomodoro';
import { createPomodoroSession, fetchPomodoroSessions } from '../lib/fetchers';
import { addLocalSession, getLocalSessions, setLocalSessions } from '../lib/local-storage';
import type { PomodoroSessionInput } from '../types/pomodoro';

export const POMODORO_SESSIONS_QUERY_KEY = 'POMODORO_SESSIONS_QUERY_KEY';

export function usePomodoroSessions() {
  const { data: session } = useSession();

  return useQuery<PomodoroSession[], Error>({
    queryKey: [POMODORO_SESSIONS_QUERY_KEY],
    queryFn: session.data ? fetchPomodoroSessions : getLocalSessions,
    enabled: true,
  });
}

export function useCreatePomodoroSession() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<PomodoroSession, Error, PomodoroSessionInput>({
    mutationFn: async (sessionInput) => {
      if (session.data) {
        return createPomodoroSession(sessionInput);
      } else {
        const localSession: PomodoroSession = {
          id: Date.now(),
          userId: '0',
          ...sessionInput,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addLocalSession(localSession);
        return localSession;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POMODORO_SESSIONS_QUERY_KEY] });
    },
  });
}

export function useSyncLocalSessions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!session) return;

      const localSessions = getLocalSessions();
      if (localSessions.length === 0) return;

      // Sync each local session to the server
      await Promise.all(
        localSessions.map(session =>
          createPomodoroSession({
            startTime: session.startTime,
            endTime: session.endTime,
            type: session.type,
            completed: session.completed,
            deletedAt: session.deletedAt,
          })
        )
      );

      // Clear local sessions after successful sync
      setLocalSessions([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POMODORO_SESSIONS_QUERY_KEY] });
    },
  });
} 
