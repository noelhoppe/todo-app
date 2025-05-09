import { styled } from "styled-components";

export const LoginContainer = styled.div`
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  background-color: lightblue;
`;

export const LoginFormTitle = styled.h1`
  text-transform: uppercase;
  background-color: inherit;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: inherit;
`;

export const Label = styled.label`
  background-color: inherit;
`;

export const Input = styled.input`
  background-color: inherit;
  padding: 1rem;
  background-color: lightgrey;
  border: none;
  width: 100%;
`;

export const PasswordWrapper = styled.div`
  background-color: inherit;
  position: relative;
  width: 100%;
`;

export const IconButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.5rem;
  background-color: lightgrey;
  border: none;
  cursor: pointer;
  
  > svg {
    width: 1.5rem;
    height: 1.5rem;
    background-color: inherit;
  }
`;