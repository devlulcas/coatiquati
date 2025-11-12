import { useSyncLocalSessions } from '@/modules/pomodoro/hooks/use-pomodoro-sessions';
import { clearLocalPomodoroData } from '@/modules/pomodoro/lib/local-storage';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { useEffect } from 'react';
import { useSyncLocalTodos } from '../../todo/hooks/use-todos';
import { clearLocalTodosData } from '../../todo/lib/local-storage';

export function useSyncLocalData() {
  const { mutate: syncSessions } = useSyncLocalSessions();
  const { mutate: syncTodos } = useSyncLocalTodos();
  const { data: user } = useCurrentUserDataQuery();

  useEffect(() => {
    if (user) {
      console.log('Syncing local data...');
      syncSessions();
      syncTodos();
      clearLocalTodosData();
      clearLocalPomodoroData();
    }
  }, [syncSessions, syncTodos, user]);
}
