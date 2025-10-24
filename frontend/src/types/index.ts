export enum RoleName {
  ADMIN = "Administrador",
  ADVISOR = "Asesor",
}

export enum ProductType {
  CONSUMER_CREDIT = "Credito de Consumo",
  PAYROLL_LOAN = "Libranza Libre Inversión",
  CREDIT_CARD = "Tarjeta de Credito",
}

export enum FranchiseType {
  AMEX = "AMEX",
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
}

export enum SaleStatus {
  OPEN = "Abierto",
  IN_PROGRESS = "En Proceso",
  CLOSED = "Finalizado",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleName;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  captchaId: string;
  captchaValue: string;
}

export interface Captcha {
  id: string;
  data: string;
  expiresAt: number;
}

export interface Sale {
  id: number;
  product: ProductType;
  status: SaleStatus;
  requestedAmount: number;
  franchise?: FranchiseType | null;
  rate?: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy?: User | null;
}

export interface SalesListResponse {
  data: Sale[];
  totalRequestedAmount: number;
  count: number;
  page: number;
  limit: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: RoleName;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: RoleName;
}

export interface CreateSalePayload {
  product: ProductType;
  requestedAmount: number;
  franchise?: FranchiseType | null;
  rate?: number | null;
}

export type UpdateSalePayload = CreateSalePayload;
