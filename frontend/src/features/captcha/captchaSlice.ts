import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchCaptcha } from "../../api/captcha";
import type { Captcha } from "../../types";

type CaptchaStatus = "idle" | "loading" | "succeeded" | "failed";

interface CaptchaState {
  current: Captcha | null;
  status: CaptchaStatus;
  error: string | null;
}

const initialState: CaptchaState = {
  current: null,
  status: "idle",
  error: null,
};

export const fetchCaptchaThunk = createAsyncThunk<Captcha>("captcha/fetch", async (_, { rejectWithValue }) => {
  try {
    return await fetchCaptcha();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("No fue posible obtener el captcha");
  }
});

const captchaSlice = createSlice({
  name: "captcha",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaptchaThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCaptchaThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchCaptchaThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "No fue posible obtener el captcha";
      });
  },
});

export const captchaReducer = captchaSlice.reducer;
