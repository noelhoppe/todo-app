import { Column, ToDoItem } from "../../types/todo";

const columns: Column<keyof ToDoItem>[] = [
  {
    accessor: "title",
    label: "Title",
    isSortable: false,
    isFilterable: true
  },
  {
    accessor: "dueTo",
    label: "Due to",
    isSortable: true,
    isFilterable: false
  }
]