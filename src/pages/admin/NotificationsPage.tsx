import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BellRing,
  Check,
  CheckCheck,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EmptyState, ErrorState, LoadingState } from '../../components/admin/AsyncState';
import { getApiErrorMessage } from '../../lib/apiErrors';
import { queryKeys } from '../../lib/queryKeys';
import type { AppNotification } from '../../types/api';

const typeLabels: Record<string, string> = {
  new_request: 'طلب مشروع جديد',
  'App\\Notifications\\NewRequest': 'طلب مشروع جديد',
  new_developer: 'تسجيل مطور جديد',
  'App\\Notifications\\NewDeveloper': 'تسجيل مطور جديد',
  new_message: 'رسالة جديدة',
  'App\\Notifications\\NewMessage': 'رسالة جديدة',
};

const readString = (
  data: Record<string, unknown>,
  key: string
): string | null => {
  const value = data[key];
  return typeof value === 'string' && value.trim() ? value : null;
};

const notificationCopy = (notification: AppNotification) => {
  const title =
    readString(notification.data, 'title') ??
    typeLabels[notification.type] ??
    'إشعار جديد';
  const message =
    readString(notification.data, 'message') ??
    'لديك إشعار جديد في النظام';
  const url = readString(notification.data, 'url');
  return { title, message, url };
};

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: queryKeys.admin.notifications,
    queryFn: async () => {
      const response = await adminApi.getNotifications();
      return response;
    },
  });

  const notifications = notificationsQuery.data?.data ?? [];
  const unreadCount = notificationsQuery.data?.unread_count ?? 0;

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notifications }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.unreadCount }),
    ]);
  };

  const markOneMutation = useMutation({
    mutationFn: (id: string) => adminApi.markNotificationRead(id),
    onSuccess: refresh,
  });

  const markAllMutation = useMutation({
    mutationFn: () => adminApi.markAllNotificationsRead(),
    onSuccess: refresh,
  });

  return (
    <div className="space-y-6 rtl">
      <AdminHeader
        title="الإشعارات"
        subtitle="الإشعارات عامة بين جميع مديري النظام، وحالة القراءة مشتركة"
        actions={
          <button
            type="button"
            disabled={unreadCount === 0 || markAllMutation.isPending}
            onClick={() => markAllMutation.mutate()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
          >
            {markAllMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5" />
            )}
            تعليم الكل كمقروء
          </button>
        }
      />

      <AdminCard
        title="أحدث الإشعارات"
        subtitle={
          unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'كل الإشعارات مقروءة'
        }
        bodyClassName="p-0"
      >
        {notificationsQuery.isLoading ? (
          <LoadingState label="جاري تحميل الإشعارات..." />
        ) : notificationsQuery.isError ? (
          <ErrorState
            message={getApiErrorMessage(
              notificationsQuery.error,
              'تعذّر تحميل الإشعارات'
            )}
            onRetry={() => void notificationsQuery.refetch()}
          />
        ) : notifications.length === 0 ? (
          <EmptyState title="لا توجد إشعارات حالياً" />
        ) : (
          <div className="divide-y divide-outline-variant/30">
            {notifications.map((notification) => {
              const copy = notificationCopy(notification);
              const isUnread = notification.read_at === null;

              return (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between ${
                    isUnread ? 'bg-primary-fixed/20' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isUnread
                          ? 'bg-primary-fixed text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <BellRing className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-on-surface">
                          {copy.title}
                        </p>
                        {isUnread && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary">
                            جديد
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {copy.message}
                      </p>
                      <p className="mt-1 text-[11px] text-outline">
                        {new Date(notification.created_at).toLocaleString('ar-SA')}
                      </p>
                      {copy.url && (
                        <a
                          href={copy.url}
                          target={copy.url.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          فتح التفاصيل
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      type="button"
                      disabled={markOneMutation.isPending}
                      onClick={() => markOneMutation.mutate(notification.id)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container-lowest px-3 py-1.5 text-[11px] font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      تحديد كمقروء
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
};
