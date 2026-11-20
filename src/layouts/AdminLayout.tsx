import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';

const mobileLinks = [
  { to: '/dashboard', label: 'الرئيسية', end: true },
  { to: '/dashboard/requests', label: 'الطلبات', end: false },
  { to: '/dashboard/developers', label: 'المطورون', end: false },
  { to: '/dashboard/messages', label: 'الرسائل', end: false },
  { to: '/dashboard/notifications', label: 'الإشعارات', end: false },
  { to: '/dashboard/audit-logs', label: 'السجل', end: false },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface rtl font-sans">
      <AdminSidebar />
      <div className="w-full min-w-0 md:mr-64">
        <nav className="sticky top-0 z-30 flex gap-1 overflow-x-auto border-b border-outline-variant/40 bg-surface-container-lowest px-3 py-2 rtl md:hidden">
          {mobileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main className="mx-auto w-full max-w-[1400px] p-4 transition-all duration-300 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
