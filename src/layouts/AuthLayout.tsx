import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="bg-[#f7f9fb] min-h-screen flex items-center justify-center p-4 rtl font-sans">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
