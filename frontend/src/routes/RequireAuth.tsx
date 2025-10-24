import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "../hooks";

export function RequireAuth() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
