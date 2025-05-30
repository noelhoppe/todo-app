import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import Modal from "../../components/Modal";
import { DatePicker } from "@mui/x-date-pickers";
import { TodoItemRequest } from "../../types/todo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchPostTodos } from "../../services/todo";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import { PickerValue } from "@mui/x-date-pickers/internals";

export default function TodoCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [todo, setTodo] = useState<TodoItemRequest>({
    title: "",
    due_to: null,
    is_done: false,
  });

  const [errorMessage, setErrorMessage] = useState({
    title: "",
    due_to: "",
  });

  const [successOpen, setSucccessOpen] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    // prevent the default form submission behavior
    evt.preventDefault();

    // validate the form data before sending to the server
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
      setSucccessOpen(true);
      onClose(); // close the modal after successful creation
    } catch (error) {
      console.log("Error creating todo:", error);
    }
  };

  useEffect(() => {
    setErrorMessage({
      title: "",
      due_to: "",
    });
  }, [isOpen]); // reset all error messages when the modal opens

  const handleTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const title = evt.target.value;
    setTodo((prevTodo) => ({
      ...prevTodo,
      title: title,
    }));
    setErrorMessage((prevErrorMessage) => ({
      ...prevErrorMessage,
      title: title.trim() ? "" : "Title is required",
    }));
  };

  const handleDateChange = (value: PickerValue) => {
    if (!value) {
      return;
    }

    const selectedDate = dayjs(value);

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

  return (
    <>
      <Modal title="Add New Todo" isOpen={isOpen} onClose={onClose}>
        <Stack
          component="form"
          spacing={4}
          direction="column"
          useFlexGap={true}
          margin={"2rem 0"}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Title"
            value={todo.title}
            onChange={handleTitleChange}
            error={errorMessage.title.length > 0}
            helperText={errorMessage.title}
          />
          <DatePicker
            label="Due Date"
            value={todo.due_to ? dayjs(todo.due_to) : null}
            onChange={handleDateChange}
            onError={(reason) => {
              if (reason === "minDate") {
                setErrorMessage((prev) => ({
                  ...prev,
                  due_to: "Due date cannot be in the past",
                }));
              } else {
                setErrorMessage((prev) => ({
                  ...prev,
                  due_to: "",
                }));
              }
            }}
            disablePast={true}
            slotProps={{
              textField: {
                error: errorMessage.due_to.length > 0,
                helperText: errorMessage.due_to,
              },
            }}
          />
          <Select
            value={todo.is_done ? "Done" : "Open"}
            onChange={(evt) =>
              setTodo((prevTodo) => ({
                ...prevTodo,
                is_done: evt.target.value === "Done",
              }))
            }
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </Modal>

      <SuccessSnackbar
        message="Todo created successfully!"
        open={successOpen}
        onClose={() => setSucccessOpen(false)}
      />
    </>
  );
}
