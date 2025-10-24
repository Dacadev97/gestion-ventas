import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "../features/auth/authSlice.ts";
import { captchaReducer } from "../features/captcha/captchaSlice.ts";
import { salesReducer } from "../features/sales/salesSlice.ts";
import { usersReducer } from "../features/users/usersSlice.ts";
import { uiReducer } from "../features/ui/uiSlice.ts";
import { setupInterceptors } from "../api/http.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    captcha: captchaReducer,
    sales: salesReducer,
    users: usersReducer,
    ui: uiReducer,
  },
});

setupInterceptors(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
