import { http } from "./http";
import type { AuthResponse, LoginPayload } from "../types";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await http.post<AuthResponse>("/auth/login", payload);
  return data;
};
