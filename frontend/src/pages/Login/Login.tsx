import { Typography, TextField, Button, IconButton } from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import * as Styles from "./Login.styles";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { LoginRequest, Success } from "../../types/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const { login } = useAuth();

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrorMessage((prev) => ({ ...prev, [field]: "" }));
  };

  // Event handler for form submission
  const handleFormSubmit = async (evt: React.FormEvent) => {
    // -- PREVENTING DEFAULT BEHAVIOUR
    evt.preventDefault();
    // -- DESTRUCTURING
    const { username, password } = credentials;
    // -- VALIDATION: check if username or password is empty
    let hasError = false;
    if (!username.trim()) {
      setErrorMessage((prev) => ({
        ...prev,
        username: "Username is required", // SET ERROR MESSAGE: username is empty
      }));
      hasError = true;
    }
    if (!password.trim()) {
      setErrorMessage((prev) => ({
        ...prev,
        password: "Password is requiered", // SET ERRO MESSAGE: password is empty
      }));
      hasError = true;
    }
    // PREVENTING API REQUEST IF THERE IS AN VALIDATION ERROR
    if (hasError) {
      return;
    }
    // API REQUEST
    try {
      await login(credentials);
      navigate("/todos/", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage({
          username: error.message,
          password: error.message,
        });
      }
    }
  };

  return (
    <Styles.LoginContainer maxWidth="md">
      <Styles.LoginWrapper as="main">
        <Typography color="textPrimary" variant="h1" gutterBottom={true}>
          Login
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Noch keinen Account?{" "}
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("/register/")}
            sx={{ textTransform: "none", padding: 0, minWidth: "unset" }}
          >
            Registrieren
          </Button>
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
            type={showPassword ? "text" : "password"}
            fullWidth={true}
            margin="dense"
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
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
          <Button
            variant="contained"
            size="large"
            fullWidth={true}
            type="submit"
          >
            Login
          </Button>
        </Styles.FormWrapper>
      </Styles.LoginWrapper>
    </Styles.LoginContainer>
  );
}
