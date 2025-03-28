import type { TodoSelect } from '@/modules/database/schema/todos';
import type { TodoInput } from '../types/todo';

export async function fetchTodos(): Promise<TodoSelect[]> {
  const response = await fetch('/api/todos');
  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}

export async function createTodo(todo: TodoInput): Promise<TodoSelect> {
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

export async function updateTodo(id: number, todo: TodoInput): Promise<TodoSelect> {
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
