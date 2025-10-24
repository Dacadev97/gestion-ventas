import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "../layouts/DashboardLayout.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RequireAuth } from "./RequireAuth.tsx";
import { SalesPage } from "../pages/SalesPage.tsx";
import { UsersPage } from "../pages/UsersPage.tsx";
import { ProtectedRoute } from "../components/ProtectedRoute.tsx";
import { RoleName } from "../types/index.ts";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<RequireAuth />}> 
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/sales" replace />} />
          <Route path="sales" element={<SalesPage />} />
          <Route element={<ProtectedRoute allowedRoles={[RoleName.ADMIN]} redirectTo="/" />}> 
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
