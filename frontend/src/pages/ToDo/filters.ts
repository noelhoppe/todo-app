import { ToDoItem } from "../../types/todo";

// export const generateBooleanFilter = <T extends keyof ToDoItem>(accessor: T) => (row: ToDoItem, filterValue: ToDoItem[T]) => {
//   if (typeof filterValue !== "boolean" || typeof row[accessor] !== "boolean") {
//     throw new Error(`The column ${accessor} has type ${typeof filterValue} and not type boolean`);
//   }
//   return filterValue ? row[accessor] : !row[accessor];
// }

export const generateIncludesStringFilter = <T extends keyof ToDoItem>(accessor: T) => (row: ToDoItem, filteredValue: ToDoItem[T]) => {
  if (typeof filteredValue !== "string" || typeof row[accessor] !== "string") {
    throw new Error(`The column ${accessor} has type ${typeof filteredValue} and not type string`)
  }
  return row[accessor].trim().toLowerCase().includes(filteredValue.trim().toLowerCase());
}