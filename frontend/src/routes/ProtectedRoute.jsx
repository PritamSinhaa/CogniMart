import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  requiredRole,
}) {
  const location = useLocation();

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // Wait until AuthContext checks the current session.
  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          bg-slate-50
          dark:bg-slate-950
        "
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span
            className="
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-emerald-600
              border-t-transparent
            "
          />

          Checking your session...
        </div>
      </div>
    );
  }

  // User is not logged in.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // User is logged in but does not have the required role.
  if (
    requiredRole &&
    user?.role !== requiredRole
  ) {
    return <Navigate to="/" replace />;
  }

  // Supports both wrapper and nested-route patterns.
  return children ?? <Outlet />;
}