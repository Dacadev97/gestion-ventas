import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

import { formatCurrency, formatDateTime } from "../../utils/format.ts";
import { ProductType } from "../../types/index.ts";
import type { Sale } from "../../types/index.ts";

interface SaleDetailDialogProps {
  open: boolean;
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailDialog({ open, sale, onClose }: SaleDetailDialogProps) {
  if (!sale) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalle de la venta #{sale.id}</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Producto
            </Typography>
            <Typography>{sale.product}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Cupo solicitado
            </Typography>
            <Typography>{formatCurrency(sale.requestedAmount)}</Typography>
          </Box>

          {sale.product === ProductType.CREDIT_CARD ? (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Franquicia
              </Typography>
              <Typography>{sale.franchise ?? "-"}</Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Tasa
              </Typography>
              <Typography>{sale.rate !== null && sale.rate !== undefined ? `${sale.rate.toFixed(2)}%` : "-"}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Creado por
            </Typography>
            <Typography>{sale.createdBy.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de creación
            </Typography>
            <Typography>{formatDateTime(sale.createdAt)}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Actualizado por
            </Typography>
            <Typography>{sale.updatedBy ? sale.updatedBy.name : "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de actualización
            </Typography>
            <Typography>{formatDateTime(sale.updatedAt)}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
