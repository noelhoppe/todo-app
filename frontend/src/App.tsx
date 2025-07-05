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
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

export const theme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5*60*1000, // = 5 minutes 
      retry: 1, // Retry failed queries once
    }
  }
});

// Connect Your App
// To use TanStack Query DevTools, add this code to your application where you create your QueryClient:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: 
      import("@tanstack/query-core").QueryClient;
  }
}
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </>
  );
}

export default App;
