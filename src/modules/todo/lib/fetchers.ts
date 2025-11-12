import type { SelectTodo } from '@/modules/database/schema/todos';
import type { TodoSchema } from '../schemas/todo-schema';

export async function fetchTodos(): Promise<SelectTodo[]> {
  const response = await fetch('/api/todos');
  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}

export async function createTodo(todo: TodoSchema): Promise<SelectTodo> {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}

export async function updateTodo(
  id: number,
  todo: TodoSchema
): Promise<SelectTodo> {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }
}
