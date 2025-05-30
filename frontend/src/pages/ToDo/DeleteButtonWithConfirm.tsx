import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteButtonWithConfirm({
  isOpen,
  onClose,
  onConfirm,
  onOpen
} : {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onOpen: () => void;
}) {
  return (
    <>
      <IconButton onClick={onOpen} color="error" aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Delete ToDo?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Willst du das Todo wirklich löschen? Diese Aktion kann nicht
            rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button onClick={() => {
            onConfirm();
            onClose();
          }} color="error" autoFocus>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
