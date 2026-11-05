import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex rtl font-sans">
      <AdminSidebar />
      <main className="flex-1 md:mr-64 p-4 md:p-8 max-w-[1400px] mx-auto w-full transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};
