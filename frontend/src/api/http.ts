import axios, { type AxiosError } from "axios";
import type { EnhancedStore } from "@reduxjs/toolkit";

import { logout } from "../features/auth/authSlice";
import { showSnackbar } from "../features/ui/uiSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setupInterceptors = (store: EnhancedStore) => {
  http.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
        window.location.href = "/login";
      }

      if (error.response?.status === 403) {
        store.dispatch(
          showSnackbar({ message: "No tienes permisos para realizar esta acción", severity: "warning" })
        );
        // Redirigir a inicio si la ruta actual es sensible
        // Evitamos bucles de redirección forzada; la UI decide en la mayoría de casos
      }

      return Promise.reject(error);
    },
  );
};

export { API_BASE_URL };
