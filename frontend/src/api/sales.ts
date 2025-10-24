import { http } from "./http";
import type {
  CreateSalePayload,
  ProductType,
  SalesListResponse,
  UpdateSalePayload,
  Sale,
  SaleStatus,
} from "../types";

export const fetchSales = async (params?: {
  product?: ProductType;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
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

export async function deleteSale(id: number): Promise<void> {
  await http.delete(`/sales/${id}`);
}

export async function updateSaleStatus(id: number, status: SaleStatus): Promise<Sale> {
  const { data } = await http.patch<Sale>(`/sales/${id}/status`, { status });

  return data;
}
