import { useQuery } from "@tanstack/react-query";
import { fetchGetTodos } from "../services/todo";

export function useTodoQuery() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchGetTodos,
  })
}