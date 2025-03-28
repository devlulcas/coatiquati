import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from '@/modules/todo/hooks/use-todos';
import { useCallback, useState } from 'react';

export function useTodosManager() {
  const { data: todos, isLoading: isLoadingTodos } = useTodos();
  const { mutate: createTodo } = useCreateTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();
  const [newTodo, setNewTodo] = useState('');

  const handleCreateTodo = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodo.trim()) return;

      createTodo({
        text: newTodo.trim(),
        completed: false,
      });

      setNewTodo('');
    },
    [createTodo, newTodo],
  );

  const handleToggleTodo = useCallback(
    (id: number, completed: boolean) => {
      updateTodo({
        id,
        todo: { text: todos?.find(t => t.id === id)?.text ?? '', completed },
      });
    },
    [todos, updateTodo],
  );

  const handleDeleteTodo = useCallback(
    (id: number) => {
      deleteTodo(id);
    },
    [deleteTodo],
  );

  return {
    newTodo,
    setNewTodo,
    isLoadingTodos,
    todos,
    handleCreateTodo,
    handleToggleTodo,
    handleDeleteTodo,
  };
}
