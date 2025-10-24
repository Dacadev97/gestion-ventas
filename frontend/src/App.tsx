import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./routes/AppRouter.tsx";
import { NotificationSnackbar } from "./components/NotificationSnackbar";

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
