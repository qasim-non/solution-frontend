import React from 'react';
import { User, Bell } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'مرحباً بك في الإدارة',
  subtitle = 'إدارة الطلبات والعمليات اليومية.',
}) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 rtl">
      <div>
        <h2 className="text-2xl font-bold text-[#191c1e]">{title}</h2>
        <p className="text-sm text-[#434655] mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        <button className="p-2 text-[#434655] hover:bg-[#eceef0] rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 bg-[#ffffff] px-4 py-2 rounded-xl border border-[#c3c6d7]/30 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#191c1e]">محمد أحمد</p>
            <p className="text-xs text-[#434655]">مدير النظام</p>
          </div>
        </div>
      </div>
    </header>
  );
};
