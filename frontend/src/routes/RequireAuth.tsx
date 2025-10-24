import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "../hooks";
import { isTokenExpired } from "../utils/jwt";

export function RequireAuth() {
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}