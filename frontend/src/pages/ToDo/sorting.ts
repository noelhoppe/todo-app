import { ToDoItem } from "../../types/todo";

export const generateDatetimeSorting = <T extends keyof ToDoItem>(accessor: T) => (a: ToDoItem, b: ToDoItem) => {
  if (!(a[accessor] instanceof Date) || !(b[accessor] instanceof Date)) {
    throw new Error(`The column ${accessor} doesn't contains only Date objects!`);
  }
  return a[accessor].getTime() - b[accessor].getTime();
}