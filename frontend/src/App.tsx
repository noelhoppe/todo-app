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
import ServerWakeupIndicator from "./components/ServerWakeupIndicator";
import { useEffect, useState } from "react";

export const theme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // = 5 minutes
      retry: 1, // Retry failed queries once
    },
  },
});

// Connect Your TanStack Query DevTools to your application
// To use TanStack Query DevTools, add this code to your application where you create your QueryClient:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const ping = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/docs/`, {
          method: "GET",
        });
        if (res.ok && isMounted) {
          setServerReady(true);
        } else if (isMounted) {
          setServerReady(false)
        }
      } catch {
        if (isMounted) {
          setServerReady(false);
        }
      }
    };

    ping()

    const interval = setInterval(() => {
        ping()
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    }
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BrowserRouter>
              <AuthProvider>
                <CssBaseline />
                <AppRoutes />
                {!serverReady && <ServerWakeupIndicator />}
              </AuthProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
