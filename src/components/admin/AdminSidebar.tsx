import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Code2,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  ScrollText,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PushNotificationToggle } from '../common/PushNotificationToggle';
import { unregisterPushNotifications } from '../../lib/notifications';

const navItems = [
  { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { path: '/dashboard/requests', label: 'طلبات المشاريع', icon: FileText, end: false },
  { path: '/dashboard/developers', label: 'المطورون', icon: Users, end: false },
  { path: '/dashboard/messages', label: 'الرسائل', icon: Mail, end: false },
  { path: '/dashboard/notifications', label: 'الإشعارات', icon: Bell, end: false },
  { path: '/dashboard/audit-logs', label: 'سجل النشاطات', icon: ScrollText, end: false },
  { path: '/dashboard/account', label: 'إعدادات الحساب', icon: Settings, end: false },
];

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Remove this browser's FCM registration while the access token is still
    // available. Backend logout also removes every device token in the session.
    try {
      await unregisterPushNotifications();
    } catch (error) {
      console.warn('[firebase] Push unregistration failed during logout.', error);
    } finally {
      // Logout clears local tokens even if the API cannot be reached.
      await logout().catch((error) => {
        console.warn('[auth] Server-side logout could not be confirmed.', error);
      });
      navigate('/login', { replace: true });
    }
  };

  return (
    <aside className="fixed right-0 top-0 z-40 hidden h-full w-64 flex-col border-l border-outline-variant/50 bg-surface-container-low px-4 py-6 rtl md:flex">
      <div className="mb-8 px-2">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
            <Code2 className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold text-primary">حلول برمجية</h1>
        </div>
        <p className="text-xs text-on-surface-variant">بوابة الإدارة والعمليات</p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t border-outline-variant/50 pt-4">
        <PushNotificationToggle showLabel />

        <button
          type="button"
          onClick={() => navigate('/dashboard/requests?create=1')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة طلب جديد</span>
        </button>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error-container"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
