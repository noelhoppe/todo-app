import { Button, IconButton, TextField, Typography } from "@mui/material";
import * as Styles from "./Register.styles";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { use, useState } from "react";
import { RegisterRequest } from "../../types/auth";
import { fetchRegister } from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import { replace, useNavigate } from "react-router-dom";

export default function Register() {
  const [credentials, setCredentials] = useState<RegisterRequest>({
    username: "",
    password: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    repeatPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState<RegisterRequest>({
    username: "",
    password: "",
    repeatPassword: "",
  });
  const handleChange = (field: keyof RegisterRequest, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrorMessage((prev) => ({ ...prev, [field]: "" }));
  };
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleFormSubmit = async (evt: React.FormEvent) => {
    // -- PREVENTING DEFAULT BEHAVIOUR
    evt.preventDefault();
    // -- DESTRUCTURING
    const { username, password, repeatPassword } = credentials;
    // -- VALIDATION: check if username or password is empty
    let hasError = false;
    if (!username.trim()) {
      setErrorMessage((prev) => ({
        ...prev,
        username: "Username is required",
      }));
      hasError = true;
    }
    if (!password.trim()) {
      setErrorMessage((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      hasError = true;
    }
    if (password !== repeatPassword) {
      setErrorMessage((prev) => ({
        ...prev,
        repeatPassword: "Passwords do not match",
      }));
      hasError = true;
    }
    // PREVENTING API REQUEST IF THERE IS AN VALIDATION ERROR
    if (hasError) {
      return;
    }
    try {
      const {username, password} = credentials;
      await fetchRegister({ username, password });
      await login({ username, password });
      navigate("/todos/", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage({
          username: error.message,
          password: error.message,
          repeatPassword: error.message,
        })
      }
    }
  };

  return (
    <Styles.RegisterContainer maxWidth="md">
      <Styles.RegisterWrapper as="main">
        <Typography color="textPrimary" variant="h1" gutterBottom={true}>
          Register
        </Typography>
        <Styles.FormWrapper onSubmit={handleFormSubmit}>
          <TextField
            id="username"
            label="Username"
            variant="filled"
            autoFocus={true}
            type="text"
            fullWidth={true}
            margin="dense"
            onChange={(evt) => handleChange("username", evt.target.value)}
            helperText={errorMessage.username}
            error={Boolean(errorMessage.username)}
          ></TextField>
          <TextField
            id="password"
            label="Password"
            variant="filled"
            type={showPassword.password ? "text" : "password"}
            fullWidth={true}
            margin="dense"
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        password: !showPassword.password,
                      })
                    }
                  >
                    {showPassword.password ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                ),
              },
            }}
            onChange={(evt) => handleChange("password", evt.target.value)}
            helperText={errorMessage.password}
            error={Boolean(errorMessage.password)}
          />
          <TextField
            id="password"
            label="Repeat Password"
            variant="filled"
            type={showPassword.repeatPassword ? "text" : "password"}
            fullWidth={true}
            margin="dense"
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        repeatPassword: !showPassword.repeatPassword,
                      })
                    }
                  >
                    {showPassword.repeatPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                ),
              },
            }}
            onChange={(evt) => handleChange("repeatPassword", evt.target.value)}
            helperText={errorMessage.repeatPassword}
            error={Boolean(errorMessage.repeatPassword)}
          />
          <Button
            variant="contained"
            size="large"
            fullWidth={true}
            type="submit"
          >
            Register
          </Button>
        </Styles.FormWrapper>
      </Styles.RegisterWrapper>
    </Styles.RegisterContainer>
  );
}
