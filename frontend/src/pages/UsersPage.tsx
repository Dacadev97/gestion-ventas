import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../hooks/index.ts";
import {
  clearUsersState,
  createUserThunk,
  deleteUserThunk,
  fetchUsersThunk,
  updateUserThunk,
} from "../features/users/usersSlice.ts";
import { RoleName } from "../types/index.ts";
import type { User } from "../types/index.ts";
import { UserFormDialog } from "../components/Users/UserFormDialog.tsx";
import type { UserFormValues } from "../components/Users/UserFormDialog.tsx";
import { UsersTable } from "../components/Users/UsersTable.tsx";
import { ConfirmDialog } from "../components/ConfirmDialog.tsx";
import { showSnackbar } from "../features/ui/uiSlice.ts";

export function UsersPage() {
  const dispatch = useAppDispatch();
  const usersState = useAppSelector((state) => state.users);
  const authState = useAppSelector((state) => state.auth);
  const { items, status } = usersState;
  const { user } = authState;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersThunk());

    return () => {
      dispatch(clearUsersState());
    };
  }, [dispatch]);

  const canManageUsers = user?.role === RoleName.ADMIN;

  if (!canManageUsers) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Acceso restringido
        </Typography>
        <Typography>Solo los administradores pueden gestionar los usuarios.</Typography>
      </Box>
    );
  }

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    setIsFormOpen(true);
  };

  const handleDelete = (userToDelete: User) => {
    setSelectedUser(userToDelete);
    setIsDeleteOpen(true);
  };

  const submitUser = (values: UserFormValues) => {
    if (selectedUser) {
      const payload = {
        id: selectedUser.id,
        data: {
          name: values.name,
          email: values.email,
          role: values.role,
          ...(values.password ? { password: values.password } : {}),
        },
      };

      dispatch(updateUserThunk(payload))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({ message: "Usuario actualizado", severity: "success" }));
          setIsFormOpen(false);
          setSelectedUser(null);
        })
        .catch((error) => {
          const message = typeof error === "string" ? error : "No fue posible actualizar el usuario";
          dispatch(showSnackbar({ message, severity: "error" }));
        });
    } else {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password ?? "",
        role: values.role,
      };

      dispatch(createUserThunk(payload))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({ message: "Usuario creado", severity: "success" }));
          setIsFormOpen(false);
          setSelectedUser(null);
        })
        .catch((error) => {
          const message = typeof error === "string" ? error : "No fue posible crear el usuario";
          dispatch(showSnackbar({ message, severity: "error" }));
        });
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      dispatch(deleteUserThunk(selectedUser.id))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({ message: "Usuario eliminado", severity: "success" }));
          setIsDeleteOpen(false);
          setSelectedUser(null);
        })
        .catch((error) => {
          const message = typeof error === "string" ? error : "No fue posible eliminar el usuario";
          dispatch(showSnackbar({ message, severity: "error" }));
        });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de usuarios
      </Typography>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Usuarios registrados</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleCreate} disabled={status === "loading"}>
              Crear usuario
            </Button>
          </Box>

          {status === "loading" ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <UsersTable users={items} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        open={isFormOpen}
        isEdit={Boolean(selectedUser)}
        initialValues={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          password: "",
          role: typeof selectedUser.role === "string" ? selectedUser.role : selectedUser.role.name,
        } : undefined}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={submitUser}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        title="Eliminar usuario"
        description="¿Deseas eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
}
