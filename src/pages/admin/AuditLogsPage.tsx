import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, History } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EmptyState, ErrorState, LoadingState } from '../../components/admin/AsyncState';
import { Pagination } from '../../components/admin/Pagination';
import { getApiErrorMessage } from '../../lib/apiErrors';
import { queryKeys } from '../../lib/queryKeys';
import type { JsonValue } from '../../types/api';

const formatValues = (values: Record<string, JsonValue> | null): string => {
  if (!values || Object.keys(values).length === 0) {
    return '—';
  }
  return JSON.stringify(values, null, 2);
};

export const AuditLogsPage: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adminId, setAdminId] = useState('');
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [filterError, setFilterError] = useState<string | null>(null);

  const [applied, setApplied] = useState({
    start_date: '',
    end_date: '',
    admin_id: '',
  });

  const adminsQuery = useQuery({
    queryKey: queryKeys.admin.auditAdmins,
    queryFn: async () => {
      const response = await adminApi.getAuditAdmins();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const params = useMemo(
    () => ({
      start_date: applied.start_date || undefined,
      end_date: applied.end_date || undefined,
      admin_id: applied.admin_id ? Number(applied.admin_id) : undefined,
      page,
      per_page: perPage,
    }),
    [applied, page, perPage]
  );

  const logsQuery = useQuery({
    queryKey: queryKeys.admin.auditLogs(params),
    queryFn: async () => {
      const response = await adminApi.getAuditLogs(params);
      return response;
    },
  });

  const logs = logsQuery.data?.data ?? [];
  const meta = logsQuery.data?.meta;

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();

    if (Boolean(startDate) !== Boolean(endDate)) {
      setFilterError('أدخل تاريخ البدء وتاريخ الانتهاء معاً');
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      setFilterError('تاريخ الانتهاء يجب أن يكون نفس اليوم أو بعد تاريخ البدء');
      return;
    }

    setFilterError(null);
    setApplied({ start_date: startDate, end_date: endDate, admin_id: adminId });
    setPage(1);
  };

  return (
    <div className="space-y-6 rtl">
      <AdminHeader
        title="سجل النشاطات"
        subtitle="سجل موثق لعمليات الإدارة التي تؤثر على الطلبات والمطورين والرسائل"
      />

      <AdminCard title="تصفية السجل" bodyClassName="p-5">
        <form onSubmit={applyFilters} className="space-y-4">
          {filterError && (
            <p className="rounded-lg bg-error-container px-3 py-2 text-xs font-bold text-on-error-container">
              {filterError}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">من تاريخ</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">إلى تاريخ</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">المدير</span>
              <select
                value={adminId}
                onChange={(event) => setAdminId(event.target.value)}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">كل المديرين</option>
                {(adminsQuery.data ?? []).map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.username}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">عدد الصفحة</span>
              <select
                value={perPage}
                onChange={(event) => {
                  setPerPage(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {[10, 25, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container"
            >
              <Filter className="h-4 w-4" />
              تطبيق الفلتر
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard
        title="السجل"
        subtitle={meta ? `${meta.total} عملية مسجلة` : undefined}
        bodyClassName="p-0"
      >
        {logsQuery.isLoading ? (
          <LoadingState label="جاري تحميل السجل..." />
        ) : logsQuery.isError ? (
          <ErrorState
            message={getApiErrorMessage(logsQuery.error, 'تعذّر تحميل سجل النشاطات')}
            onRetry={() => void logsQuery.refetch()}
          />
        ) : logs.length === 0 ? (
          <EmptyState title="لا توجد عمليات مطابقة" />
        ) : (
          <div className="space-y-3 p-5">
            {logs.map((log) => (
              <article
                key={log.id}
                className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                      <History className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-mono text-sm font-bold text-on-surface">
                        {log.action}
                      </p>
                      <p className="mt-0.5 text-[11px] text-on-surface-variant">
                        {log.admin?.username ?? 'مدير محذوف'} ·{' '}
                        {new Date(log.created_at).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  {log.auditable && (
                    <span className="rounded-full bg-surface-container px-2.5 py-1 text-[11px] font-bold text-on-surface-variant">
                      {log.auditable.type} #{log.auditable.id}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[11px] font-bold text-on-surface-variant">
                      القيم السابقة
                    </p>
                    <pre className="overflow-x-auto rounded-xl bg-surface-container-low p-3 text-left text-[11px] leading-relaxed text-on-surface-variant">
                      {formatValues(log.old_values)}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] font-bold text-on-surface-variant">
                      القيم الجديدة
                    </p>
                    <pre className="overflow-x-auto rounded-xl bg-surface-container-low p-3 text-left text-[11px] leading-relaxed text-on-surface-variant">
                      {formatValues(log.new_values)}
                    </pre>
                  </div>
                </div>

                {(log.ip_address || log.user_agent) && (
                  <p className="mt-3 truncate text-[11px] text-outline" dir="ltr">
                    {log.ip_address ?? '—'} · {log.user_agent ?? '—'}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            perPage={meta.per_page}
            onPageChange={setPage}
            isLoading={logsQuery.isFetching}
          />
        )}
      </AdminCard>
    </div>
  );
};
