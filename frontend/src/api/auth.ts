import { http } from "./http";
import type { AuthResponse, LoginPayload, User } from "../types";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await http.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await http.get<User>("/auth/me");
  return data;
};
