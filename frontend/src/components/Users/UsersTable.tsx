import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import type { User } from "../../types";
import { formatDateTime } from "../../utils/format";
import { RoleName } from "../../types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const getRoleColor = (role: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (role) {
    case RoleName.ADMIN:
      return "error";
    case RoleName.ADVISOR:
      return "primary";
    case RoleName.VIEWER:
      return "info";
    default:
      return "default";
  }
};

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo electrónico</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Creado</TableCell>
            <TableCell>Actualizado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            const roleText = typeof user.role === "string"
              ? user.role
              : typeof user.role === "object" && user.role !== null
                ? user.role.name ?? "-"
                : "-";
            
            return (
              <TableRow 
                key={user.id} 
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={roleText} 
                    size="small" 
                    color={getRoleColor(roleText)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(user.updatedAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => onEdit(user)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => onDelete(user)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
