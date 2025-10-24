import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import type { User } from "../../types";
import { formatDateTime } from "../../utils/format";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Correo electrónico</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell>Creado</TableCell>
          <TableCell>Actualizado</TableCell>
          <TableCell align="right">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} hover>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {typeof user.role === "string"
                ? user.role
                : typeof user.role === "object" && user.role !== null
                  ? user.role.name ?? "-"
                  : "-"}
            </TableCell>
            <TableCell>{formatDateTime(user.createdAt)}</TableCell>
            <TableCell>{formatDateTime(user.updatedAt)}</TableCell>
            <TableCell align="right">
              <IconButton color="primary" onClick={() => onEdit(user)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(user)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>
              <Box py={3} display="flex" justifyContent="center">
                <Typography>No hay usuarios registrados.</Typography>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
