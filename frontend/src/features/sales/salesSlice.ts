import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { createSale, deleteSale, fetchSaleById, fetchSales, updateSale } from "../../api/sales";
import type {
  CreateSalePayload,
  ProductType,
  Sale,
  SalesListResponse,
  UpdateSalePayload,
} from "../../types";

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

export const deleteSaleThunk = createAsyncThunk<number, number>(
  "sales/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteSale(id);
      return id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No fue posible eliminar la venta");
    }
  },
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSalesState(state) {
      state.list = [];
      state.totalRequestedAmount = 0;
      state.selectedSale = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSalesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.data;
        state.totalRequestedAmount = action.payload.totalRequestedAmount;
      })
      .addCase(fetchSalesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "No fue posible obtener las ventas";
      })
      .addCase(fetchSaleByIdThunk.fulfilled, (state, action) => {
        state.selectedSale = action.payload;
      })
      .addCase(createSaleThunk.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.totalRequestedAmount += action.payload.requestedAmount;
      })
      .addCase(updateSaleThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((sale) => sale.id === action.payload.id);

        if (index >= 0) {
          const previousAmount = state.list[index].requestedAmount;
          state.list[index] = action.payload;
          state.totalRequestedAmount += action.payload.requestedAmount - previousAmount;
        }
      })
      .addCase(deleteSaleThunk.fulfilled, (state, action) => {
        const sale = state.list.find((item) => item.id === action.payload);

        if (sale) {
          state.totalRequestedAmount -= sale.requestedAmount;
        }

        state.list = state.list.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearSalesState } = salesSlice.actions;
export const salesReducer = salesSlice.reducer;
