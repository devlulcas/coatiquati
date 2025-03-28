import { useSession } from '@/modules/auth/hooks/use-session';
import type { TodoSelect } from '@/modules/database/schema/todos';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from '../lib/fetchers';
import { addLocalTodo, deleteLocalTodo, getLocalTodos, setLocalTodos, updateLocalTodo } from '../lib/local-storage';
import type { TodoInput } from '../types/todo';

export const TODOS_QUERY_KEY = 'TODOS_QUERY_KEY';

export function useTodos() {
  const { data: session } = useSession();

  return useQuery<TodoSelect[], Error>({
    queryKey: [TODOS_QUERY_KEY],
    queryFn: session.data ? fetchTodos : getLocalTodos,
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<TodoSelect, Error, TodoInput>({
    mutationFn: async (todoInput) => {
      if (session.data) {
        return createTodo(todoInput);
      } else {
        const localTodo: TodoSelect = {
          id: Date.now(),
          userId: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          completed: Boolean(todoInput.completed),
          text: todoInput.text,
        };
        addLocalTodo(localTodo);
        return localTodo;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<TodoSelect, Error, { id: number; todo: TodoInput }>({
    mutationFn: async ({ id, todo }) => {
      if (session.data) {
        return updateTodo(id, todo);
      } else {
        const localTodo: TodoSelect = {
          id: Date.now(),
          userId: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          completed: Boolean(todo.completed),
          text: todo.text,
        };
        updateLocalTodo(id, localTodo);
        return localTodo;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      if (session.data) {
        return deleteTodo(id);
      } else {
        deleteLocalTodo(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useSyncLocalTodos() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!session) return;

      const localTodos = getLocalTodos();
      if (localTodos.length === 0) return;

      // Sync each local todo to the server
      await Promise.all(
        localTodos.map(todo =>
          createTodo({
            text: todo.text,
            completed: todo.completed,
          })
        )
      );

      // Clear local todos after successful sync
      setLocalTodos([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
} 
