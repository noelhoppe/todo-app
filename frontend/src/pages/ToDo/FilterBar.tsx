import { Chip, Stack, TextField, Typography } from "@mui/material";

export default function FilterBar({
  status,
  setStatus,
  setTitle,
}: {
  status: "all" | "open" | "done";
  setStatus: (status: "all" | "open" | "done") => void;
  setTitle: (title: string) => void;
}) {
  return (
    <Stack
      spacing={2}
      useFlexGap={true}
      direction="column"
    >
      <TextField
        label="Search by Title"
        onChange={(evt) => setTitle(evt.target.value)}
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
          variant={status === "all" ? "filled" : "outlined"}
          clickable={true}
          aria-label="Show all todos"
          onClick={() => setStatus("all")}
        />
        <Chip
          label="Open"
          component="button"
          variant={status === "open" ? "filled" : "outlined"}
          clickable={true}
          aria-label="Show open todos"
          onClick={() => setStatus("open")}
        />
        <Chip
          label="Done"
          component="button"
          variant={status === "done" ? "filled" : "outlined"}
          clickable={true}
          aria-label="Show done todos"
          onClick={() => setStatus("done")}
        />
      </Stack>
    </Stack>
  );
}
