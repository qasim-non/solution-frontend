import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] text-[#004ac6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold text-sm">جاري التحقق من صلاحيات الوصول...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
