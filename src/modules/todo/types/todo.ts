import type { TodoInsert } from "@/modules/database/schema/todos";

export type TodoInput = Omit<TodoInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
