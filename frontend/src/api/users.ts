import { http } from "./http";
import type { CreateUserPayload, UpdateUserPayload, User } from "../types";

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await http.get<User[]>("/users");
  return data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await http.post<User>("/users", payload);
  return data;
};

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<User> => {
  const { data } = await http.put<User>(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await http.delete(`/users/${id}`);
};
