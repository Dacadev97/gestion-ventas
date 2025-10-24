import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { login } from "../../api/auth.ts";
import { fetchSalesThunk } from "../sales/salesSlice.ts";
import { fetchUsersThunk } from "../users/usersSlice.ts";
import { showSnackbar } from "../ui/uiSlice.ts";
import type { AuthResponse, LoginPayload, User } from "../../types/index.ts";
import { RoleName } from "../../types/index.ts";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

/**
 * AuthState represents the state of the authentication process.
 * It holds the user information, the authentication token,
 * the status of the authentication process, and any error that occurred.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const loadInitialState = (): Pick<AuthState, "user" | "token"> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);

  try {
    return {
      token,
      user: userRaw ? (JSON.parse(userRaw) as User) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const initialData = loadInitialState();

const initialState: AuthState = {
  user: initialData.user,
  token: initialData.token,
  status: "idle",
  error: null,
};

export const loginThunk = createAsyncThunk<AuthResponse, LoginPayload>(
  "auth/login",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await login(payload);

      dispatch(showSnackbar({ message: "Inicio de sesión exitoso", severity: "success" }));

      return response;
    } catch (error: unknown) {
      let message = "Error inesperado al iniciar sesión";

      if (axios.isAxiosError(error)) {
        message = (error.response?.data as { message?: string })?.message ?? error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      dispatch(showSnackbar({ message, severity: "error" }));
      return rejectWithValue(message);
    }
  },
);

const persistAuth = ({ token, user }: { token: string | null; user: User | null }) => {
  if (token && user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      persistAuth({ token: null, user: null });
    },
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      persistAuth({ token: state.token, user: state.user });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistAuth({ token: state.token, user: state.user });
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "No se pudo iniciar sesión";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
