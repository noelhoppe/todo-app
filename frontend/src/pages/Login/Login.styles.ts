import styled from "styled-components";
import { Box } from "@mui/material";
import { Container } from "@mui/material";
import { Theme } from "@mui/material/styles";

export const LoginContainer = styled(Container)`
  min-height: 100dvh;
  display: flex;
  align-items: center;
`;


export const LoginWrapper = styled(Box)<{ theme?: Theme }>`
  border-radius: 20px;
  flex: 1;
  padding: ${({ theme }) => theme?.spacing(3)};
  background-color: ${({ theme }) => theme?.palette.background.paper};
`;

export const FormWrapper = styled.form``;
