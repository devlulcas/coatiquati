import type { SelectTodo } from '@/modules/database/schema/todos';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from '../lib/fetchers';
import {
  addLocalTodo,
  deleteLocalTodo,
  getLocalTodos,
  setLocalTodos,
  updateLocalTodo,
} from '../lib/local-storage';
import type { TodoSchema } from '../schemas/todo-schema';

const TODOS_QUERY_KEY = 'TODOS_QUERY_KEY';

export function useTodos() {
  const { data: user } = useCurrentUserDataQuery();

  return useQuery<SelectTodo[], Error>({
    queryKey: [TODOS_QUERY_KEY],
    queryFn: user ? fetchTodos : getLocalTodos,
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUserDataQuery();

  return useMutation<SelectTodo, Error, TodoSchema>({
    mutationFn: async (todoInput) => {
      if (user) {
        return createTodo(todoInput);
      } else {
        const localTodo: SelectTodo = {
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
  const { data: user } = useCurrentUserDataQuery();

  return useMutation<SelectTodo, Error, { id: number; todo: TodoSchema }>({
    mutationFn: async ({ id, todo }) => {
      if (user) {
        return updateTodo(id, todo);
      } else {
        const localTodo: SelectTodo = {
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
  const { data: user } = useCurrentUserDataQuery();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      if (user) {
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
  const { data: user } = useCurrentUserDataQuery();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!user) return;

      const localTodos = getLocalTodos();
      if (localTodos.length === 0) return;

      // Sync each local todo to the server
      await Promise.all(
        localTodos.map((todo) =>
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
