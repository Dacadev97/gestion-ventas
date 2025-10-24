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

import { RoleName } from "../../types";

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  email: z.string().email("Correo electrónico inválido").max(50, "Máximo 50 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(20, "Máximo 20 caracteres").optional(),
  role: z.nativeEnum(RoleName),
});

export type UserFormValues = z.infer<typeof schema>;

interface UserFormDialogProps {
  open: boolean;
  initialValues?: UserFormValues;
  isEdit?: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}

export function UserFormDialog({ open, initialValues, isEdit = false, onClose, onSubmit }: UserFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(
      schema.refine((data) => (isEdit ? true : Boolean(data.password)), {
        message: "La contraseña es obligatoria",
        path: ["password"],
      }),
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: RoleName.ADVISOR,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        email: initialValues.email,
        password: "",
        role: typeof initialValues.role === "string" ? initialValues.role : initialValues.role.name,
      });
    }
  }, [initialValues, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = (values: UserFormValues) => {
    if (isEdit && !values.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = values;
      onSubmit(rest as UserFormValues);
    } else {
      onSubmit(values);
    }
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Editar usuario" : "Crear usuario"}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            mt: 1,
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Correo electrónico"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contraseña"
                type="password"
                fullWidth
                error={Boolean(errors.password)}
                helperText={isEdit ? "Dejar vacío para mantener la contraseña" : errors.password?.message}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Rol"
                fullWidth
                error={Boolean(errors.role)}
              >
                {Object.values(RoleName).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit(submit)} variant="contained">
          {isEdit ? "Guardar cambios" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
