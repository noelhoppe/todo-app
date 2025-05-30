import Login from "./pages/Login/Login";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AuthProvider from "./contexts/AuthProvider";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// logging API URL environment variable
// console.log(import.meta.env.VITE_API_URL)

export const theme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <AuthProvider>
              <CssBaseline />
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
