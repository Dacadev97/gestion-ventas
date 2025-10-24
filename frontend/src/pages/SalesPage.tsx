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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Stack,
  TablePagination,
} from "@mui/material";
import { Add, Delete, Edit, MoreVert, Refresh, Visibility, FilterList } from "@mui/icons-material";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<SalesFilters>({
    product: "",
    createdFrom: "",
    createdTo: "",
  });

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
    const params = {
      product: filters.product || undefined,
      createdFrom: filters.createdFrom || undefined,
      createdTo: filters.createdTo || undefined,
    };
    dispatch(fetchSalesThunk(params));

    return () => {
      dispatch(clearSalesState());
    };
  }, [dispatch, filters]);

  const onSubmitFilters = (values: SalesFilters) => {
    setFilters({
      product: values.product,
      createdFrom: values.createdFrom,
      createdTo: values.createdTo,
    });
  };

  const resetFilters = () => {
    reset({ product: "", createdFrom: "", createdTo: "" });
    setFilters({ product: "", createdFrom: "", createdTo: "" });
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  
  // Aplicar paginación
  const paginatedSales = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredSales.slice(startIndex, endIndex);
  }, [filteredSales, page, rowsPerPage]);

  const tokenRole = getRoleFromToken(token);
  const canManageSales = tokenRole === RoleName.ADMIN || tokenRole === RoleName.ADVISOR;

  const statusColorMap: Record<SaleStatus, "info" | "warning" | "success"> = {
    [SaleStatus.OPEN]: "info",
    [SaleStatus.IN_PROGRESS]: "warning",
    [SaleStatus.CLOSED]: "success",
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Gestión de Ventas
        </Typography>
        {canManageSales && (
          <Button 
            variant="contained" 
            size="large"
            startIcon={<Add />} 
            onClick={handleCreateSale}
            sx={{ minWidth: 180 }}
          >
            Radicar venta
          </Button>
        )}
      </Stack>

      <Card sx={{ mb: 3, width: "100%" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <FilterList color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Filtros
            </Typography>
          </Stack>
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

      <Card sx={{ width: "100%" }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                Listado de ventas
              </Typography>
              <Chip 
                label={`Total: ${formatCurrency(totalRequestedAmount)}`}
                color="primary"
                sx={{ fontWeight: 600, fontSize: '0.95rem', px: 1 }}
              />
            </Stack>
          </Box>

          {status === "loading" ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : filteredSales.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron ventas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar los filtros o crear una nueva venta
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cupo solicitado</TableCell>
                      <TableCell>Franquicia / Tasa</TableCell>
                      <TableCell>Fecha creación</TableCell>
                      <TableCell>Creado por</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedSales.map((sale) => (
                    <TableRow 
                      key={sale.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {sale.product}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(sale.requestedAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {sale.product === ProductType.CREDIT_CARD
                          ? sale.franchise ?? "-"
                          : sale.rate !== null && sale.rate !== undefined
                            ? `${sale.rate.toFixed(2)}%`
                            : "-"}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(sale.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>{sale.createdBy.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={sale.status} 
                          size="small" 
                          color={statusColorMap[sale.status]}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Ver detalle">
                            <IconButton size="small" color="primary" onClick={() => handleViewSale(sale)}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {canManageSales && (
                            <>
                              <Tooltip title="Editar">
                                <IconButton size="small" color="primary" onClick={() => handleEditSale(sale)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton size="small" color="error" onClick={() => handleDeleteSale(sale)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cambiar estado">
                                <IconButton size="small" onClick={(e) => handleOpenStatusMenu(e, sale)}>
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredSales.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            />
          </>
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
