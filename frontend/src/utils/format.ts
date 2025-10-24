import dayjs from "dayjs";

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(value);

export const formatDateTime = (value: string | Date): string => dayjs(value).format("DD/MM/YYYY HH:mm");

export const formatDate = (value: string | Date): string => dayjs(value).format("DD/MM/YYYY");
