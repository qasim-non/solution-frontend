import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Mail, Plus, LogOut, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { path: '/dashboard/requests', label: 'طلبات المشاريع', icon: FileText },
    { path: '/dashboard/contact', label: 'الرسائل', icon: Mail },
  ];

  return (
    <aside className="hidden md:flex h-full w-64 fixed right-0 top-0 border-l border-[#c3c6d7]/30 shadow-sm flex-col py-6 px-4 rtl bg-[#f2f4f6] dark:bg-[#2d3133] z-40">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#004ac6] flex items-center justify-center text-white font-bold text-sm">
            <Code2 className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl text-[#004ac6] dark:text-[#b4c5ff]">
           حلول برمجية
          </h1>
        </div>
        <p className="text-xs text-[#434655] dark:text-[#e0e3e5]">بوابة الإدارة والعمليات</p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#645efb] text-white shadow-sm'
                    : 'text-[#434655] dark:text-[#e0e3e5] hover:bg-[#e0e3e5] dark:hover:bg-[#4d556b]'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#c3c6d7]/30 space-y-2">
        <button
          onClick={() => navigate('/request')}
          className="w-full bg-[#004ac6] text-white py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طلب جديد</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
