import { http } from "./http";

interface SalesByAdvisor {
  advisorId: number;
  advisorName: string;
  count: number;
  total: number;
}

interface AmountByProduct {
  product: string;
  count: number;
  total: number;
}

interface SalesByDate {
  date: string;
  count: number;
  total: number;
}

export interface SalesStats {
  salesByAdvisor: SalesByAdvisor[];
  amountByProduct: AmountByProduct[];
  salesByDate: SalesByDate[];
}

export const getSalesStats = async (): Promise<SalesStats> => {
  const { data } = await http.get<SalesStats>("/sales/stats");
  return data;
};
