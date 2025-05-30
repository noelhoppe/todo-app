import { ModalContainer, ModalContent } from "./Modal.styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack, Typography } from "@mui/material";

export default function Modal({
  isOpen,
  title,
  onClose,
  children,
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalContainer>
      <ModalContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography component="h1" variant="h3">
            {title}
          </Typography>
          <IconButton aria-label="Close modal" size="large" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {children}
      </ModalContent>
    </ModalContainer>
  );
}
