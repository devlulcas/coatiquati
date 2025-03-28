import type { TodoSelect } from "@/modules/database/schema/todos";

const STORAGE_KEYS = {
  TODOS: 'pomodoro_todos',
} as const;

export function getLocalTodos(): TodoSelect[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TODOS);
  return stored ? JSON.parse(stored) : [];
}

export function setLocalTodos(todos: TodoSelect[]): void {
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
}

export function addLocalTodo(todo: TodoSelect): void {
  const todos = getLocalTodos();
  todos.push(todo);
  setLocalTodos(todos);
}

export function updateLocalTodo(id: number, todo: TodoSelect): void {
  const todos = getLocalTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos[index] = todo;
    setLocalTodos(todos);
  }
}

export function deleteLocalTodo(id: number): void {
  const todos = getLocalTodos();
  setLocalTodos(todos.filter(t => t.id !== id));
}

export function clearLocalTodosData(): void {
  localStorage.removeItem(STORAGE_KEYS.TODOS);
} 
