import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../hooks";
import type { RoleName } from "../types/index.ts";
import { getRoleFromToken, isTokenExpired } from "../utils/jwt";

interface ProtectedRouteProps {
  allowedRoles?: RoleName[];
  redirectTo?: string;
}

export function ProtectedRoute({ allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, token } = useAppSelector((state) => state.auth);

  // Si no hay token o está expirado, redirigir a login
  if (!token || isTokenExpired(token)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Para decisiones de autorización, usamos SIEMPRE el rol del token firmado
  if (allowedRoles && allowedRoles.length > 0) {
    const tokenRole = getRoleFromToken(token);
    if (!tokenRole || !allowedRoles.includes(tokenRole as RoleName)) {
      return <Navigate to="/" replace />;
    }
  }

  // Mantener compatibilidad: si hay user se usa para UI, pero no para autorización
  if (!user) {
    // Usuario no cargado aún pero token válido: permitir y dejar que la app recupere datos
    return <Outlet />;
  }

  return <Outlet />;
}
