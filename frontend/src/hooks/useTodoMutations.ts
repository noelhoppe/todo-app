import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDeleteTodo, fetchPatchTodo, fetchPostTodos } from "../services/todo";
import { ToDoUpdateRequest } from "../types/todo";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchPostTodos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.log(`Error creating todo: ${error.message}`);
    }
  });

}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, todo }: { id: number; todo: ToDoUpdateRequest }) => {
      return fetchPatchTodo(id, todo)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.log(`Error updating todo ${error.message}`);
    }
  });

}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchDeleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.log(`Error deleting todo ${error.message}`)
    }
  });

}
