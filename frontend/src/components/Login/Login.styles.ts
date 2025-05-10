import styled from "styled-components";
import { Box } from "@mui/material";
import { Container } from "@mui/material";

export const LoginContainer = styled(Container)`
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginWrapper = styled(Box)`
  padding: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

export const FormWrapper = styled.form``;
