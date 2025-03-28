import { useSession } from '@/modules/auth/hooks/use-session';
import { useSyncLocalSessions } from '@/modules/pomodoro/hooks/use-pomodoro-sessions';
import { clearLocalPomodoroData } from '@/modules/pomodoro/lib/local-storage';
import { useEffect } from 'react';
import { useSyncLocalTodos } from '../../todo/hooks/use-todos';
import { clearLocalTodosData } from '../../todo/lib/local-storage';

export function useSyncLocalData() {
  const { data: session } = useSession();
  const { mutate: syncSessions } = useSyncLocalSessions();
  const { mutate: syncTodos } = useSyncLocalTodos();

  useEffect(() => {
    if (session.data) {
      console.log('Syncing local data...');
      syncSessions();
      syncTodos();
      clearLocalTodosData();
      clearLocalPomodoroData();
    }
  }, [session, syncSessions, syncTodos]);
} 
