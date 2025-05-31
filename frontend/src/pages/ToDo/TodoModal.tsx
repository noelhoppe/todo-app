import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import Modal from "../../components/Modal";
import { DatePicker } from "@mui/x-date-pickers";
import { TodoItemRequest, ToDoUpdateRequest } from "../../types/todo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchPostTodos } from "../../services/todo";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import { PickerValue } from "@mui/x-date-pickers/internals";

export default function TodoModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  onTitleChange,
  onDueDateChange,
  onStatusChange,
  todo,
  errorMessage,
}: {
  isOpen: boolean;
  title: string,
  onClose: () => void;
  onSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (title: string) => void;
  onDueDateChange: (dueDate: PickerValue) => void;
  onStatusChange: (isDone: boolean) => void;
  todo: ToDoUpdateRequest;
  errorMessage: { title: string; due_to: string };
}) {
  return (
    <>
      <Modal title={title} isOpen={isOpen} onClose={onClose}>
        <Stack
          component="form"
          spacing={4}
          direction="column"
          useFlexGap={true}
          margin={"2rem 0"}
          onSubmit={onSubmit}
        >
          <TextField
            label="Title"
            value={todo?.title}
            onChange={(evt) => onTitleChange(evt.target.value)}
            error={errorMessage.title.length > 0}
            helperText={errorMessage.title}
          />
          <DatePicker
            label="Due Date"
            value={todo.due_to ? dayjs(todo.due_to) : null}
            onChange={onDueDateChange}
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
            onChange={(evt) => onStatusChange(evt.target.value === "Done")}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
