import { createSlice } from "@reduxjs/toolkit";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface UiState {
  snackbar: SnackbarState;
}

const initialState: UiState = {
  snackbar: {
    open: false,
    message: "",
    severity: "info",
  },
};

interface ShowSnackbarPayload {
  message: string;
  severity?: SnackbarSeverity;
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showSnackbar(state, action: { payload: ShowSnackbarPayload }) {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity ?? "info",
      };
    },
    hideSnackbar(state) {
      state.snackbar.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
