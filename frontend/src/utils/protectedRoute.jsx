import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { authSelector } from "../features/admin/auth-slice";

/**
 * ProtectedRoute
 * Wraps routes that require authentication.
 * Optionally restrict to specific roles.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
 *     <Route path="/admin" element={<AdminPanel />} />
 *   </Route>
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector(authSelector);

  if (!isAuthenticated) {
    return <Navigate to="/auth/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;