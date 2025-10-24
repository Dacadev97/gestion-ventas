import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";

import { FranchiseType, ProductType } from "../../types";

const schema = z
  .object({
    product: z.nativeEnum(ProductType),
    requestedAmount: z.number().min(1, "El cupo debe ser mayor a 0"),
    franchise: z.nativeEnum(FranchiseType).nullable().optional(),
    rate: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const requiresFranchise = data.product === ProductType.CREDIT_CARD;
    const requiresRate =
      data.product === ProductType.CONSUMER_CREDIT || data.product === ProductType.PAYROLL_LOAN;

    if (requiresFranchise && !data.franchise) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe seleccionar una franquicia",
        path: ["franchise"],
      });
    }

    if (!requiresFranchise && data.franchise) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La franquicia solo aplica para tarjetas de crédito",
        path: ["franchise"],
      });
    }

    if (requiresRate) {
      if (data.rate === null || data.rate === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debe ingresar la tasa",
          path: ["rate"],
        });
      } else if (data.rate < 0 || data.rate > 99.99) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La tasa debe estar entre 0 y 99.99",
          path: ["rate"],
        });
      }
    }

    if (!requiresRate && data.rate !== null && data.rate !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La tasa solo aplica para créditos o libranzas",
        path: ["rate"],
      });
    }
  });

export type SaleFormValues = z.infer<typeof schema>;

interface SaleFormDialogProps {
  open: boolean;
  initialValues?: SaleFormValues;
  onClose: () => void;
  onSubmit: (values: SaleFormValues) => void;
}

export function SaleFormDialog({ open, initialValues, onClose, onSubmit }: SaleFormDialogProps) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      product: ProductType.CREDIT_CARD,
      requestedAmount: 1,
      franchise: null,
      rate: null,
    },
  });

  const product = watch("product");
  const requiresFranchise = product === ProductType.CREDIT_CARD;
  const requiresRate = product === ProductType.CONSUMER_CREDIT || product === ProductType.PAYROLL_LOAN;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  useEffect(() => {
    if (open) {
      setTimeout(() => setFocus("product"), 0);
    }
  }, [open, setFocus]);

  useEffect(() => {
    if (!requiresFranchise) {
      setValue("franchise", null);
    }

    if (!requiresRate) {
      setValue("rate", null);
    }
  }, [requiresFranchise, requiresRate, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = (values: SaleFormValues) => {
    const payload: SaleFormValues = {
      ...values,
      franchise: requiresFranchise ? values.franchise ?? null : null,
      rate: requiresRate ? values.rate ?? null : null,
    };

    onSubmit(payload);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Editar venta" : "Crear venta"}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            mt: 1,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <Box>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <TextField select label="Producto" fullWidth {...field} error={Boolean(errors.product)} autoFocus>
                  {Object.values(ProductType).map((productOption) => (
                    <MenuItem key={productOption} value={productOption}>
                      {productOption}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box>
            <Controller
              name="requestedAmount"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ""}
                  onValueChange={(values: { floatValue?: number }) => {
                    field.onChange(values.floatValue ?? 0);
                  }}
                  customInput={TextField}
                  label="Cupo solicitado"
                  fullWidth
                  error={Boolean(errors.requestedAmount)}
                  helperText={errors.requestedAmount?.message}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$"
                  allowNegative={false}
                  decimalScale={0}
                />
              )}
            />
          </Box>

          {requiresFranchise && (
            <Box sx={{ gridColumn: { xs: "auto", sm: "span 2" } }}>
              <Controller
                name="franchise"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === "" ? null : value);
                    }}
                    select
                    label="Franquicia"
                    fullWidth
                    error={Boolean(errors.franchise)}
                    helperText={errors.franchise?.message}
                  >
                    <MenuItem value="">
                      Seleccionar
                    </MenuItem>
                    {Object.values(FranchiseType).map((franchise) => (
                      <MenuItem key={franchise} value={franchise}>
                        {franchise}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>
          )}

          {requiresRate && (
            <Box sx={{ gridColumn: { xs: "auto", sm: "span 2" } }}>
              <Controller
                name="rate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const { value } = event.target;
                      const numericValue = value === "" ? null : Number(value);
                      field.onChange(numericValue === null || Number.isNaN(numericValue) ? null : numericValue);
                    }}
                    label="Tasa (%)"
                    type="number"
                    fullWidth
                    error={Boolean(errors.rate)}
                    helperText={errors.rate?.message ?? ""}
                    inputProps={{ min: 0, max: 99.99, step: 0.01 }}
                  />
                )}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit(submit)} variant="contained">
          {initialValues ? "Guardar cambios" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
