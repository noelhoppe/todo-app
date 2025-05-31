import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import FilterBar from "./FilterBar";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetchDeleteTodo,
  fetchGetTodos,
  fetchPatchTodo,
  fetchPostTodos,
} from "../../services/todo";
import { TodoItemRequest, TodoItemResponse } from "../../types/todo";
import DeleteButtonWithConfirm from "./DeleteButtonWithConfirm";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import TodoModal from "./TodoModal";

export default function FilterableTodoTable() {
  const [rows, setRows] = useState<TodoItemResponse[]>([]);

  // --- FOR CREATING AND UPDATING TODOS ---
  const [todo, setTodo] = useState<TodoItemRequest>({
    title: "",
    due_to: null,
    is_done: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- FILTER STATES ---
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "done">(
    "all"
  );
  const [titleFilter, setTitleFilter] = useState<string>("");

  // --- FOR ERROR HANDLING ---
  // --- MODAL STATES ---
  const [errorMessage, setErrorMessage] = useState({
    title: "",
    due_to: "",
  });
  const [modalOpen, setModalOpen] = useState<
    "create" | "update" | "delete" | null
  >(null);
  const [successOpen, setSucccessOpen] = useState<
    "create" | "update" | "delete" | null
  >(null);

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
              onOpen={() => handleTodoDeleteOpen(params.id as number)}
              isOpen={modalOpen === "delete" && editingId === params.id}
              onClose={handleTodoDeleteClose}
              onConfirm={handleDelete}
            />
            <IconButton
              color="primary"
              onClick={() => handleTodoUpdateOpen(params.id as number)}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
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

  // --- BEGIN HANDLE TODO DELETE ---
  const handleTodoDeleteOpen = (editingId: number) => {
    setEditingId(editingId);
    setModalOpen("delete");
  };

  const handleTodoDeleteClose = () => {
    setEditingId(null);
    setModalOpen(null);
  };

  const handleDelete = async () => {
    if (editingId === null) {
      throw new Error("No todo ID provided for deletion (DELETE /todos/:id)");
    }
    try {
      await fetchDeleteTodo(editingId);
      setEditingId(null);
      setModalOpen(null);
      setSucccessOpen("delete");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  // --- END HANDLE TODO DELETE ---

  // --- BEGIN HANDLE TODO CREATE ---
  const handleTodoCreateOpen = () => {
    setTodo({
      title: "",
      due_to: null,
      is_done: false,
    });
    setErrorMessage({
      title: "",
      due_to: "",
    });
    setModalOpen("create");
  };

  const handleTodoCreateClose = () => {
    setModalOpen(null);
    setTodo({
      title: "",
      due_to: null,
      is_done: false,
    })
    setErrorMessage({
      title: "",
      due_to: "",
    });
  }

  const handleTitleChange = (title: string) => {
    setTodo((prevTodo) => ({
      ...prevTodo,
      title: title,
    }));
    setErrorMessage((prevErrorMessage) => ({
      ...prevErrorMessage,
      title: title.trim() ? "" : "Title is required",
    }));
  };

  const handleDateChange = (date: PickerValue) => {
    if (!date) {
      return;
    }
    const selectedDate = dayjs(date);
    if (!selectedDate.isValid()) {
      return;
    }
    if (selectedDate.isBefore(dayjs(), "day")) {
      setErrorMessage((prev) => ({
        ...prev,
        due_to: "Due date cannot be in the past",
      }));
      return;
    }
    setTodo((prev) => ({
      ...prev,
      due_to: selectedDate.toISOString(),
    }));
    setErrorMessage((prev) => ({
      ...prev,
      due_to: "",
    }));
  };

  const handleStatusChange = (isDone: boolean) => {
    setTodo((prevTodo) => ({
      ...prevTodo,
      is_done: isDone,
    }));
  };

  const handleCreate = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    let isValid =
      errorMessage.title.length === 0 && errorMessage.due_to.length === 0;
    if (!todo.title.trim()) {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        title: "Title is required",
      }));
      isValid = false;
    }
    if (errorMessage.due_to.length > 0) {
      isValid = false;
    }
    // if the form is not valid, do not send the request
    if (!isValid) {
      return;
    }
    // send the request to the server
    try {
      const res = await fetchPostTodos(todo);
      setSucccessOpen("create");
      setModalOpen(null); // close the modal after successful creation
      setTodo({
        title: "",
        due_to: null,
        is_done: false,
      });
      setErrorMessage({
        title: "",
        due_to: "",
      });
    } catch (error) {
      console.log("Error creating todo:", error);
    }
  };
  // --- END HANDLE TODO CREATE ---

  // --- HANDLE TODO UPDATE ---
  const handleTodoUpdateOpen = (editingId: number) => {
    setEditingId(editingId);
    setTodo(
      rows.find((row) => row.id === editingId) || {
        title: "",
        due_to: null,
        is_done: false,
      }
    );
    setErrorMessage({
      title: "",
      due_to: "",
    });
    setModalOpen("update");
  };

  const handleTodoUpdateClose = () => {
    setEditingId(null);
    setTodo({
      title: "",
      due_to: null,
      is_done: false,
    });
    setErrorMessage({
      title: "",
      due_to: "",
    });
    setModalOpen(null);
  };

  const handleUpdate = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (editingId === null) {
      return;
    }
    try {
      await fetchPatchTodo(editingId, todo);
      setSucccessOpen("update");
      setModalOpen(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const resolveSubmitHandler = () => {
    if (modalOpen === "create") {
      return handleCreate;
    } else if (modalOpen === "update") {
      return handleUpdate;
    } else {
      throw new Error("Invalid modal state");
    }
  };

  const resolveOnCloseHandler = () => {
    if (modalOpen === "create") {
      return handleTodoCreateClose;
    } else if (modalOpen === "update") {
      return handleTodoUpdateClose;
    } else {
      throw new Error("Invalid modal state");
    }
  }

  // -- BEGIN HANDLE TODO FILTERING BY STATUS AND TITLE ---
  const filteredRows = rows
    .filter((row) => {
      // filter by status
      switch (statusFilter) {
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
        .includes(titleFilter.trim().toLowerCase());
    });
  // -- END HANDLE TODO FILTERING BY STATUS AND TITLE ---

  return (
    <Stack
      margin="20px"
      component="main"
      flexDirection="column"
      useFlexGap={true}
      spacing={2}
    >
      <SuccessSnackbar
        open={successOpen !== null}
        onClose={() => setSucccessOpen(null)}
        message={
          successOpen === "create"
            ? "Todo created successfully!"
            : successOpen === "update"
            ? "Todo updated successfully!"
            : "Todo deleted successfully!"
        }
      />
      <TodoModal
        isOpen={modalOpen === "create" || modalOpen === "update"}
        title={modalOpen === "create" ? "Create Todo" : modalOpen === "update" ? "Update Todo" : ""}
        onClose={resolveOnCloseHandler}
        onSubmit={resolveSubmitHandler}
        onTitleChange={handleTitleChange}
        onDueDateChange={handleDateChange}
        onStatusChange={handleStatusChange}
        todo={todo}
        errorMessage={errorMessage}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography id="title" variant="h3" component="h1">
          My Todos
        </Typography>

        {/* Create Todo */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleTodoCreateOpen}
        >
          Create Todo
        </Button>

        {/* TODO: Logout Button */}
      </Stack>
      <FilterBar
        statusFilter={statusFilter}
        onStatusClick={setStatusFilter}
        onTitleChange={setTitleFilter}
      />
      <DataGrid
        aria-labelledby="title"
        rows={filteredRows}
        columns={columns}
        disableColumnMenu={true}
      />
    </Stack>
  );
}
