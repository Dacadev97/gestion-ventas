import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./routes/AppRouter.tsx";
import { NotificationSnackbar } from "./components/NotificationSnackbar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchMeThunk } from "./features/auth/authSlice";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#004481",
    },
    secondary: {
      main: "#009fe3",
    },
  },
});

export function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Si hay token pero no hay usuario (o es inconsistente), rehidratar desde backend
    if (token && !user) {
      dispatch(fetchMeThunk());
    }
  }, [token, user, dispatch]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
        <NotificationSnackbar />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
