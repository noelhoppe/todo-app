import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import FilterBar from "./FilterBar";
import TodoCreateModal from "./TodoCreateModal";
import {
  fetchDeleteTodo,
  fetchGetTodos,
  fetchPatchTodo,
} from "../../services/todo";
import { TodoItemResponse } from "../../types/todo";
import DeleteButtonWithConfirm from "./DeleteButtonWithConfirm";
import EditIcon from "@mui/icons-material/Edit";

export default function FilterableTodoTable() {
  const [rows, setRows] = useState<TodoItemResponse[]>([]);

  // filter states
  const [status, setStatus] = useState<"all" | "open" | "done">("all");
  const [title, setTitle] = useState<string>("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);



  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      disableReorder: true,
      filterable: false,
      flex: 1,
      hideable: false,
      sortable: true,
    },
    {
      field: "due_to",
      headerName: "Due to",
      disableReorder: true,
      filterable: false,
      flex: 1,
      hideable: false,
    },
    {
      field: "is_done",
      headerName: "Status",
      hideable: false,
      disableReorder: true,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const isDone: boolean = params.value;

        return (
          <span
            style={{
              color: isDone ? "green" : "inherit",
            }}
          >
            {isDone ? "Done" : "Open"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      disableReorder: true,
      filterable: false,
      flex: 0.3,
      hideable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <DeleteButtonWithConfirm
              onOpen={() => setOpenDialogId(params.id as number)}
              isOpen={openDialogId === params.id}
              onClose={() => setOpenDialogId(null)}
              onConfirm={() => handleDelete(params.id as number)}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos: TodoItemResponse[] = await fetchGetTodos();
        setRows(todos);
      } catch (error) {
        console.log("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleDelete = (id: number) => {
    fetchDeleteTodo(id);
  };


  const filteredRows = rows
    .filter((row) => {
      // filter by status
      switch (status) {
        case "all":
          return true;
        case "done":
          return row.is_done === true;
        case "open":
          return row.is_done === false;
        default:
          return true;
      }
    })
    .filter((row) => {
      // filter by title
      return row.title
        .trim()
        .toLowerCase()
        .includes(title.trim().toLowerCase());
    });

  return (
    <Stack
      margin="20px"
      component="main"
      flexDirection="column"
      useFlexGap={true}
      spacing={2}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography id="title" variant="h3" component="h1">
          My Todos
        </Typography>

        {/* Create Todo */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Todo
        </Button>
        <TodoCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Stack>
      <FilterBar status={status} setStatus={setStatus} setTitle={setTitle} />
      <DataGrid
        aria-labelledby="title"
        rows={filteredRows}
        columns={columns}
        disableColumnMenu={true}
      />
    </Stack>
  );
}
