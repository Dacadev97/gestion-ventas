import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../hooks";
import type { RoleName } from "../types/index.ts";

interface ProtectedRouteProps {
  allowedRoles?: RoleName[];
  redirectTo?: string;
}

export function ProtectedRoute({ allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
