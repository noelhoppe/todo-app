import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { columns, sampleTodos } from './models';
import { useEffect, useState } from 'react';
import { ToDoItem } from '../../types/todo';
import { Chip, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import FilterBar from './FilterBar';

export default function FilterableToDoTable() {
  const [rows, setRows] = useState<ToDoItem[]>([]);

  // filter states
  const [status, setStatus] = useState<"all" | "open" | "done">("all");
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    setRows(sampleTodos);
  }, []);

  const filteredRows = rows.filter((row) => {
    // filter by status
    switch(status) {
      case "all": return true;
      case "done": return row.isDone;
      case "open": return !row.isDone;
      default: return true;
    }
  })
  .filter((row) => {
    // filter by title
    return row.title.trim().toLowerCase().includes(title.trim().toLowerCase())
  })

  return (
    <Stack
      margin="20px"
      component="main"
      flexDirection="column"
      useFlexGap={true}
      spacing={2}
    >
      <Typography
        id='title'
        variant='h3'
        component="h1"
      >My Todos</Typography>
      <FilterBar
        status={status}  
        setStatus={setStatus}
        setTitle={setTitle}
      />
      <DataGrid 
        aria-labelledby='title'
        rows={filteredRows}
        columns={columns}
        disableColumnMenu={true}
      />
    </Stack>
  )
}