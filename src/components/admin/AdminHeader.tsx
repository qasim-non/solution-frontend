import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, Settings, UserRound } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { queryKeys } from '../../lib/queryKeys';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'مرحباً بك في الإدارة',
  subtitle = 'إدارة الطلبات والعمليات اليومية.',
  actions,
}) => {
  const unreadQuery = useQuery({
    queryKey: queryKeys.admin.unreadCount,
    queryFn: async () => {
      const response = await adminApi.getUnreadCount();
      return response.data.unread_count;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchInterval: 60_000,
  });

  const unreadCount = unreadQuery.data ?? 0;

  return (
    <header className="mb-8 flex flex-col gap-4 rtl sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">{title}</h2>
        <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
      </div>

      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
        {actions}
        <Link
          to="/dashboard/notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="الإشعارات"
          title="الإشعارات"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-error px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-on-primary">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
        <Link
          to="/dashboard/account"
          className="inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-3 py-2 text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">إعدادات الحساب</span>
          <Settings className="h-3.5 w-3.5 sm:hidden" />
        </Link>
      </div>
    </header>
  );
};
