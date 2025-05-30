export type TodoItemRequest = {
  title: string;
  due_to?: string | null;
  is_done: boolean;
}

export type TodoItemResponse = TodoItemRequest & {
  id: number;
}

export type ToDoUpdateRequest = Partial<TodoItemRequest>;