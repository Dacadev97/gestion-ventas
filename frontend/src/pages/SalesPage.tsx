import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Chip,
  Pagination,
} from "@mui/material";
import { Add, Delete, Edit, MoreVert, Refresh, Visibility } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "../hooks/index.ts";
import {
  clearSalesState,
  createSaleThunk,
  deleteSaleThunk,
  fetchSalesThunk,
  updateSaleStatusThunk,
  updateSaleThunk,
} from "../features/sales/salesSlice.ts";
import { ProductType, RoleName, SaleStatus } from "../types";
import { getRoleFromToken } from "../utils/jwt.ts";
import type { Sale } from "../types";
import { SaleFormDialog } from "../components/Sales/SaleFormDialog.tsx";
import type { SaleFormValues } from "../components/Sales/SaleFormDialog.tsx";
import { ConfirmDialog } from "../components/ConfirmDialog.tsx";
import { formatCurrency, formatDateTime } from "../utils/format.ts";
import { SaleDetailDialog } from "../components/Sales/SaleDetailDialog.tsx";
import { showSnackbar } from "../features/ui/uiSlice.ts";

interface SalesFilters {
  product?: ProductType | "";
  createdFrom?: string;
  createdTo?: string;
}

export function SalesPage() {
  const dispatch = useAppDispatch();
  const salesState = useAppSelector((state) => state.sales);
  const authState = useAppSelector((state) => state.auth);
  const { list, totalRequestedAmount, status } = salesState;
  const { token } = authState;
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [detailSale, setDetailSale] = useState<Sale | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLButtonElement>, sale: Sale) => {
    setSelectedSale(sale);
    setStatusMenuAnchorEl(event.currentTarget);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchorEl(null);
    setSelectedSale(null);
  };

  const handleStatusChange = (status: SaleStatus) => {
    if (selectedSale) {
      dispatch(updateSaleStatusThunk({ id: selectedSale.id, status }))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({ message: "Estado actualizado correctamente", severity: "success" }));
        })
        .catch((error) => {
          const message = typeof error === "string" ? error : "No fue posible actualizar el estado";
          dispatch(showSnackbar({ message, severity: "error" }));
        });
    }
    handleCloseStatusMenu();
  };

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<SalesFilters>({
    defaultValues: {
      product: "",
      createdFrom: "",
      createdTo: "",
    },
  });

  useEffect(() => {
    dispatch(fetchSalesThunk(undefined));

    return () => {
      dispatch(clearSalesState());
    };
  }, [dispatch]);

  const onSubmitFilters = (values: SalesFilters) => {
    const params = {
      product: values.product || undefined,
      createdFrom: values.createdFrom || undefined,
      createdTo: values.createdTo || undefined,
    };

    dispatch(fetchSalesThunk(params));
  };

  const resetFilters = () => {
    reset({ product: "", createdFrom: "", createdTo: "" });
    dispatch(fetchSalesThunk(undefined));
  };

  const handleCreateSale = () => {
    setSelectedSale(null);
    setIsFormOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsFormOpen(true);
  };

  const handleViewSale = (sale: Sale) => {
    setDetailSale(sale);
    setIsDetailOpen(true);
  };

  const handleDeleteSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteOpen(true);
  };

  const handleSubmitSale = (values: SaleFormValues) => {
    if (selectedSale) {
      dispatch(updateSaleThunk({ id: selectedSale.id, data: values }))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({ message: "Venta actualizada correctamente", severity: "success" }));
          setIsFormOpen(false);
          setSelectedSale(null);
        })
        .catch((error) => {
          const message = typeof error === "string" ? error : "No fue posible actualizar la venta";
          dispatch(showSnackbar({ message, severity: "error" }));
        });
    } else {
      dispatch(createSaleThunk(values))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({ message: "Venta creada correctamente", severity: "success" }));
          setIsFormOpen(false);
          setSelectedSale(null);
        })
        .catch((error) => {
          const message = typeof error === "string" ? error : "No fue posible crear la venta";
          dispatch(showSnackbar({ message, severity: "error" }));
        });
    }
  };

  const confirmDeleteSale = () => {
    if (selectedSale) {
      dispatch(deleteSaleThunk(selectedSale.id))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({ message: "Venta eliminada", severity: "success" }));
          setIsDeleteOpen(false);
          setSelectedSale(null);
        })
        .catch((error) => {
          const message = typeof error === "string" ? error : "No fue posible eliminar la venta";
          dispatch(showSnackbar({ message, severity: "error" }));
        });
    }
  };

  const filteredSales = useMemo(() => list, [list]);

  const tokenRole = getRoleFromToken(token);
  const canManageSales = tokenRole === RoleName.ADMIN || tokenRole === RoleName.ADVISOR;

  const statusColorMap: Record<SaleStatus, "info" | "warning" | "success"> = {
    [SaleStatus.OPEN]: "info",
    [SaleStatus.IN_PROGRESS]: "warning",
    [SaleStatus.CLOSED]: "success",
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ventas registradas
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmitFilters)}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(4, minmax(0, 1fr))" },
                alignItems: "flex-end",
              }}
            >
              <Box>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Producto" fullWidth>
                      <MenuItem value="">Todos</MenuItem>
                      {Object.values(ProductType).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="createdFrom"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Desde"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="createdTo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Hasta"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button type="submit" variant="contained" startIcon={<Refresh />}>
                  Aplicar
                </Button>
                <Button variant="outlined" onClick={resetFilters}>
                  Limpiar
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Listado de ventas</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <Typography variant="subtitle1">
                Total cupo solicitado: <strong>{formatCurrency(totalRequestedAmount)}</strong>
              </Typography>
              {canManageSales && (
                <Button variant="contained" startIcon={<Add />} onClick={handleCreateSale}>
                  Radicar venta
                </Button>
              )}
            </Box>
          </Box>

          {status === "loading" ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="table" width="100%" sx={{ borderCollapse: "collapse" }}>
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" textAlign="left" sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                    Producto
                  </Box>
                  <Box component="th" textAlign="left" sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                    Cupo solicitado
                  </Box>
                  <Box component="th" textAlign="left" sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                    Franquicia / Tasa
                  </Box>
                  <Box component="th" textAlign="left" sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                    Fecha creación
                  </Box>
                  <Box component="th" textAlign="left" sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                    Creado por
                  </Box>
                  <Box component="th" textAlign="left" sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                    Estado
                  </Box>
                  <Box component="th" textAlign="left" sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                    Acciones
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                {filteredSales.map((sale) => (
                  <Box component="tr" key={sale.id}>
                    <Box component="td" sx={{ borderBottom: "1px solid #f0f0f0", py: 1 }}>
                      {sale.product}
                    </Box>
                    <Box component="td" sx={{ borderBottom: "1px solid #f0f0f0", py: 1 }}>
                      {formatCurrency(sale.requestedAmount)}
                    </Box>
                    <Box component="td" sx={{ borderBottom: "1px solid #f0f0f0", py: 1 }}>
                      {sale.product === ProductType.CREDIT_CARD
                        ? sale.franchise ?? "-"
                        : sale.rate !== null && sale.rate !== undefined
                          ? `${sale.rate.toFixed(2)}%`
                          : "-"}
                    </Box>
                    <Box component="td" sx={{ borderBottom: "1px solid #f0f0f0", py: 1 }}>
                      {formatDateTime(sale.createdAt)}
                    </Box>
                    <Box component="td" sx={{ borderBottom: "1px solid #f0f0f0", py: 1 }}>
                      {sale.createdBy.name}
                    </Box>
                    <Box component="td" sx={{ borderBottom: "1px solid #f0f0f0", py: 1 }}>
                      <Chip label={sale.status} size="small" color={statusColorMap[sale.status]} />
                    </Box>
                    <Box component="td" sx={{ borderBottom: "1px solid #f0f0f0", py: 1 }}>
                      <Box display="flex" gap={0.5}>
                        <IconButton size="small" color="primary" onClick={() => handleViewSale(sale)}>
                          <Visibility />
                        </IconButton>
                        {canManageSales && (
                          <>
                            <IconButton size="small" color="primary" onClick={() => handleEditSale(sale)}>
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteSale(sale)}>
                              <Delete />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => handleOpenStatusMenu(e, sale)}>
                              <MoreVert />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
                {filteredSales.length === 0 && (
                  <Box component="tr">
                    <Box component="td" colSpan={7} textAlign="center" sx={{ py: 3 }}>
                      No se encontraron ventas registradas.
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Menu
        anchorEl={statusMenuAnchorEl}
        open={Boolean(statusMenuAnchorEl)}
        onClose={handleCloseStatusMenu}
      >
        {Object.values(SaleStatus).map((status) => (
          <MenuItem key={status} onClick={() => handleStatusChange(status)}>
            {status}
          </MenuItem>
        ))}
      </Menu>

      <SaleFormDialog
        open={isFormOpen}
        initialValues={selectedSale ? {
          product: selectedSale.product,
          requestedAmount: selectedSale.requestedAmount,
          franchise: selectedSale.franchise ?? null,
          rate: selectedSale.rate ?? null,
        } : undefined}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSale(null);
        }}
        onSubmit={handleSubmitSale}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        title="Eliminar venta"
        description="¿Deseas eliminar esta venta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        onConfirm={confirmDeleteSale}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <SaleDetailDialog
        open={isDetailOpen}
        sale={detailSale}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailSale(null);
        }}
      />
    </Box>
  );
}
