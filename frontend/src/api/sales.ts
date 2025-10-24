import { http } from "./http";
import type {
  CreateSalePayload,
  ProductType,
  SalesListResponse,
  UpdateSalePayload,
  Sale,
} from "../types";

export const fetchSales = async (params?: {
  product?: ProductType;
  createdFrom?: string;
  createdTo?: string;
}): Promise<SalesListResponse> => {
  const { data } = await http.get<SalesListResponse>("/sales", { params });
  return data;
};

export const fetchSaleById = async (id: number): Promise<Sale> => {
  const { data } = await http.get<Sale>(`/sales/${id}`);
  return data;
};

export const createSale = async (payload: CreateSalePayload): Promise<Sale> => {
  const { data } = await http.post<Sale>("/sales", payload);
  return data;
};

export const updateSale = async (id: number, payload: UpdateSalePayload): Promise<Sale> => {
  const { data } = await http.put<Sale>(`/sales/${id}`, payload);
  return data;
};

export const deleteSale = async (id: number): Promise<void> => {
  await http.delete(`/sales/${id}`);
};
