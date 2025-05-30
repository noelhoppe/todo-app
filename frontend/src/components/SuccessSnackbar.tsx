import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

export default function SuccessSnackbar({
  message,
  open,
  onClose
} : {
  message: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert 
        severity="success"
        variant='filled'
      >
        {message}
      </Alert>
    </Snackbar>
  )
}