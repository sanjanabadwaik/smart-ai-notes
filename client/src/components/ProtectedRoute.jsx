import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-white text-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-lg font-semibold tracking-[0.2em] text-gray-700">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const from = location.pathname + location.search;
    return (
      <Navigate to={`/login?redirect=${encodeURIComponent(from)}`} replace />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
