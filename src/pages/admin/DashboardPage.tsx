import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  FileText,
  Loader2,
  X,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EmptyState, ErrorState } from '../../components/admin/AsyncState';
import { RequestStatusBadge } from '../../components/admin/StatusBadge';
import { getApiErrorMessage } from '../../lib/apiErrors';
import { queryKeys } from '../../lib/queryKeys';
import type { OldestRequestSummary } from '../../types/api';

const statCards = [
  { key: 'total_requests', label: 'إجمالي الطلبات', icon: Database },
  { key: 'recent_requests', label: 'طلبات آخر 24 ساعة', icon: Clock3 },
  { key: 'pending_requests', label: 'قيد الانتظار', icon: FileText },
  { key: 'reviewed_requests', label: 'تمت المراجعة', icon: Eye },
  { key: 'completed_requests', label: 'مكتملة', icon: CheckCircle2 },
] as const;

export const DashboardPage: React.FC = () => {
  const dashboardQuery = useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: async () => {
      const response = await adminApi.getDashboard();
      return response.data;
    },
  });

  const [selectedRequest, setSelectedRequest] =
    useState<OldestRequestSummary | null>(null);

  const data = dashboardQuery.data;

  return (
    <div className="space-y-6 rtl">
      <AdminHeader
        title="لوحة التحكم"
        subtitle="نظرة سريعة على الطلبات والأداء العام للمنصة"
      />

      {dashboardQuery.isLoading ? (
        <AdminCard bodyClassName="p-0">
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-primary">
              جاري تحميل إحصائيات لوحة التحكم...
            </p>
          </div>
        </AdminCard>
      ) : dashboardQuery.isError || !data ? (
        <AdminCard bodyClassName="p-0">
          <ErrorState
            message={getApiErrorMessage(
              dashboardQuery.error,
              'تعذر تحميل إحصائيات لوحة التحكم. قد تكون الجلسة منتهية'
            )}
            onRetry={() => void dashboardQuery.refetch()}
          />
        </AdminCard>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-sm"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold text-on-surface">
                    {data[card.key]}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-on-surface-variant">
                    {card.label}
                  </p>
                </div>
              );
            })}
          </div>

          <AdminCard
            title="أقدم الطلبات"
            subtitle="الطلبات الأقدم التي لم تُعرض بعد في قائمة الفرز الافتراضية"
            bodyClassName="p-0"
          >
            {data.oldest_requests.length === 0 ? (
              <EmptyState title="لا توجد طلبات قديمة حالياً" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-outline-variant/40 bg-surface-container-low text-xs font-bold text-on-surface-variant">
                    <tr>
                      <th className="p-4">المعرف</th>
                      <th className="p-4">اسم المشروع</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">التاريخ</th>
                      <th className="p-4">تفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {data.oldest_requests.map((request) => (
                      <tr
                        key={request.id}
                        className="transition-colors hover:bg-surface-container-low/60"
                      >
                        <td className="p-4 font-mono font-bold text-primary">#{request.id}</td>
                        <td className="p-4 font-bold text-on-surface">{request.project_name}</td>
                        <td className="p-4">
                          <RequestStatusBadge status={request.status} />
                        </td>
                        <td className="p-4 text-xs text-on-surface-variant">
                          {new Date(request.created_at).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(request)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-fixed px-3 py-1.5 text-xs font-bold text-on-primary-fixed-variant transition-colors hover:opacity-80"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            عرض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 rtl">
          <div className="h-full w-full max-w-md overflow-y-auto border-l border-outline-variant/40 bg-surface-container-lowest shadow-xl">
            <div className="flex items-center justify-between border-b border-outline-variant/40 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-on-surface">تفاصيل الطلب</h3>
                <p className="text-xs text-on-surface-variant">
                  #{selectedRequest.id} · {selectedRequest.project_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <p className="mb-1 text-xs font-bold text-on-surface-variant">الوصف</p>
                <p className="rounded-xl bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface">
                  {selectedRequest.description || 'لا يوجد وصف'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold text-on-surface-variant">الحالة</p>
                <RequestStatusBadge status={selectedRequest.status} />
              </div>
              <div>
                <p className="mb-1 text-xs font-bold text-on-surface-variant">تاريخ الإنشاء</p>
                <p className="text-sm text-on-surface">
                  {new Date(selectedRequest.created_at).toLocaleString('ar-SA')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
