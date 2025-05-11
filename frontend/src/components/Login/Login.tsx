import { 
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from "@mui/material";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import * as Styles from "./Login.styles"
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { LoginRequest } from "../../types/auth";

function Login() {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
          autoFocus={true}
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
        >
        </TextField>
        <TextField 
          // TODO: Toggling password visibility with icon
          // TODO: using password icon
          id="password"
          label="Password"
          variant="filled"
          required={true}
          type={showPassword ? "text": "password"}
          fullWidth={true}
          margin="dense"
          // TODO: UI error handling
          slotProps={{
            input: {
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
              )
            }
          }}
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