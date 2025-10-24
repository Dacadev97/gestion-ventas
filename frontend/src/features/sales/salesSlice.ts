import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createSale,
  deleteSale,
  fetchSales,
  updateSale,
  updateSaleStatus,
} from "../../api/sales.ts";
import type { CreateSalePayload, Sale, SaleStatus, UpdateSalePayload } from "../../types";
import type { RootState } from "../../store";

type SalesStatus = "idle" | "loading" | "succeeded" | "failed";

interface SalesState {
  list: Sale[];
  totalRequestedAmount: number;
  selectedSale: Sale | null;
  status: SalesStatus;
  error: string | null;
}

const initialState: SalesState = {
  list: [],
  totalRequestedAmount: 0,
  selectedSale: null,
  status: "idle",
  error: null,
};

export const fetchSalesThunk = createAsyncThunk<
  SalesListResponse,
  { product?: ProductType; createdFrom?: string; createdTo?: string } | undefined
>("sales/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await fetchSales(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("No fue posible obtener las ventas");
  }
});

export const fetchSaleByIdThunk = createAsyncThunk<Sale, number>(
  "sales/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchSaleById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No fue posible obtener la venta");
    }
  },
);

export const createSaleThunk = createAsyncThunk<Sale, CreateSalePayload>(
  "sales/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createSale(payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No fue posible crear la venta");
    }
  },
);

export const updateSaleThunk = createAsyncThunk<Sale, { id: number; data: UpdateSalePayload }>(
  "sales/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateSale(id, data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No fue posible actualizar la venta");
    }
  },
);

export const deleteSaleThunk = createAsyncThunk<number, number, { rejectValue: string }>(
  "sales/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteSale(id);

      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Ocurrió un error inesperado");
    }
  },
);

export const updateSaleStatusThunk = createAsyncThunk<
  Sale,
  { id: number; status: SaleStatus },
  { rejectValue: string }
>("sales/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const updatedSale = await updateSaleStatus(id, status);

    return updatedSale;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Ocurrió un error inesperado");
  }
});

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSalesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSalesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.data;
        state.totalRequestedAmount = action.payload.totalRequestedAmount;
      })
      .addCase(fetchSalesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Ocurrió un error inesperado";
      })
      .addCase(createSaleThunk.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.totalRequestedAmount += action.payload.requestedAmount;
      })
      .addCase(updateSaleThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((sale) => sale.id === action.payload.id);
        if (index !== -1) {
          const originalSale = state.list[index];
          state.totalRequestedAmount -= originalSale.requestedAmount;
          state.totalRequestedAmount += action.payload.requestedAmount;
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteSaleThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((sale) => sale.id === action.payload);
        if (index !== -1) {
          const originalSale = state.list[index];
          state.totalRequestedAmount -= originalSale.requestedAmount;
          state.list.splice(index, 1);
        }
      })
      .addCase(updateSaleStatusThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((sale) => sale.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { clearSalesState } = salesSlice.actions;
export const salesReducer = salesSlice.reducer;
