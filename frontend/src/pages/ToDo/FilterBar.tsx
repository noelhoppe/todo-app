import { Chip, Stack, TextField, Typography } from "@mui/material";

export default function FilterBar({
  statusFilter,
  onStatusClick,
  onTitleChange,
}: {
  statusFilter: "all" | "open" | "done";
  onStatusClick: (status: "all" | "open" | "done") => void;
  onTitleChange: (title: string) => void;
}) {
  return (
    <Stack
      spacing={2}
      useFlexGap={true}
      direction="column"
    >
      <TextField
        label="Search by Title"
        onChange={(evt) => onTitleChange(evt.target.value)}
      />
      <Stack
        direction="row"
        spacing={2}
        useFlexGap={true}
        alignItems="center"
      >
        <Typography
          variant="subtitle2"
          component="h2"
        >Set status filter
        </Typography>
        <Chip
          label="All"
          component="button"
          variant={statusFilter === "all" ? "filled" : "outlined"}
          clickable={true}
          aria-label="Show all todos"
          onClick={() => onStatusClick("all")}
        />
        <Chip
          label="Open"
          component="button"
          variant={statusFilter === "open" ? "filled" : "outlined"}
          clickable={true}
          aria-label="Show open todos"
          onClick={() => onStatusClick("open")}
        />
        <Chip
          label="Done"
          component="button"
          variant={statusFilter === "done" ? "filled" : "outlined"}
          clickable={true}
          aria-label="Show done todos"
          onClick={() => onStatusClick("done")}
        />
      </Stack>
    </Stack>
  );
}
