export type ToDoItemAPI = {
  id: number;
  title: string;
  dueTo?: string | null;
  isDone?: boolean;
}

export type ToDoItem = {
  id: number;
  title: string;
  dueTo?: Date;
  isDone?: boolean;
}

export type Column<T extends keyof ToDoItem> = {
  accessor: T;
  label: string;
  jsxElement?: (e: ToDoItem) => React.JSX.Element;
  isSortable: boolean;
  sorted?: "asc" | "desc" | null;
  sortingFunction?: (a: ToDoItem, b: ToDoItem) => number;
  isFilterable: boolean
}

export type ColumnFilter<T extends keyof ToDoItem> = {
  accessor: T
  filterValue: ToDoItem[T]
  filterFunction: (row: ToDoItem, filterValue: ToDoItem[T]) => boolean;
}