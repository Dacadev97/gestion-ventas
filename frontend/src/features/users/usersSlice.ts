import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { createUser, deleteUser, fetchUsers, updateUser } from "../../api/users";
import type { CreateUserPayload, UpdateUserPayload, User } from "../../types";

type UsersStatus = "idle" | "loading" | "succeeded" | "failed";

interface UsersState {
  items: User[];
  status: UsersStatus;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchUsersThunk = createAsyncThunk<User[]>("users/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchUsers();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("No fue posible obtener los usuarios");
  }
});

export const createUserThunk = createAsyncThunk<User, CreateUserPayload>(
  "users/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createUser(payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No fue posible crear el usuario");
    }
  },
);

export const updateUserThunk = createAsyncThunk<User, { id: number; data: UpdateUserPayload }>(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateUser(id, data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No fue posible actualizar el usuario");
    }
  },
);

export const deleteUserThunk = createAsyncThunk<number, number>(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No fue posible eliminar el usuario");
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersState(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "No fue posible obtener los usuarios";
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((user) => user.id === action.payload.id);

        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload);
      });
  },
});

export const { clearUsersState } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
