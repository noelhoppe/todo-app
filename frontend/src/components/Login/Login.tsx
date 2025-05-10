import { 
  Typography,
  TextField,
  Button
} from "@mui/material";
import * as Styles from "./Login.styles"
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { LoginRequest } from "../../types/auth";

function Login() {
  // const [username, setUsername] = useState<string|null>(null);
  // const [password, setPassword] = useState<string|null>(null);
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: ""
  });
  // const [error, setError] = useState<string|null>(null);
  const { login } = useAuth()

  return (
    <Styles.LoginContainer maxWidth="md">
      <Styles.LoginWrapper as="main" >
        <Typography
          color="textPrimary"
          variant="h1"
          gutterBottom={true}
        >Login
        </Typography>
        {/* TODO: Link to regsitration page */}
        <Styles.FormWrapper>
          {/* TODO: using user icon */}
          <TextField
          id="username"
          label="Username"
          variant="filled"
          required={true}
          type="text"
          fullWidth={true}
          margin="dense"
          // TODO: UI error handling
          onChange={(evt) => { // tracking 
            setCredentials((prev) => ({
              ... prev,
              username: evt.target.value
            }));
            // setError(null);
          }}
          // helperText={error}
          // error={error ? true : false}
        />
        <TextField 
          // TODO: Toggling password visibility with icon
          // TODO: using password icon
          id="password"
          label="Password"
          variant="filled"
          required={true}
          type="password"
          fullWidth={true}
          margin="dense"
          // TODO: UI error handling
          onChange={(evt) => {
            setCredentials((prev) => ({
              ...prev, 
              password: evt.target.value
            }))
            // setError(null)
          }}
          // helperText={error}
          // error={error ? true : false}
        />
        <Button
          variant="contained"
          size="large"
          fullWidth={true}
          type="submit"
          // TODO: UI error handling
          onClick={(evt) => login(evt, credentials)}
        >Login
        </Button>   
        </Styles.FormWrapper>
      </Styles.LoginWrapper>
    </Styles.LoginContainer>
  )
}

export default Login;