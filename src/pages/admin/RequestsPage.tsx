import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Eye,
  Filter,
  Pencil,
  Plus,
  Trash2,
  Unlink,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EmptyState, ErrorState, LoadingState } from '../../components/admin/AsyncState';
import { PageOptionsRefreshButton } from '../../components/admin/PageOptionsRefreshButton';
import { Pagination } from '../../components/admin/Pagination';
import { RequestFormModal } from '../../components/admin/RequestFormModal';
import { RequestStatusBadge } from '../../components/admin/StatusBadge';
import { SocialMediaModal } from '../../components/admin/SocialMediaModal';
import { useRequestPageOptions } from '../../hooks/usePageOptions';
import {
  getApiErrorMessage,
  isConflictError,
} from '../../lib/apiErrors';
import { queryKeys } from '../../lib/queryKeys';
import type {
  CreateProjectRequestPayload,
  ProjectRequest,
  SocialMediaAccountItem,
  UpdateProjectRequestPayload,
} from '../../types/api';

interface Filters {
  search: string;
  system_type: string;
  status: string;
  start_date: string;
  end_date: string;
}

const initialFilters: Filters = {
  search: '',
  system_type: '',
  status: '',
  start_date: '',
  end_date: '',
};

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  reviewed: 'تمت المراجعة',
  completed: 'مكتمل',
};

const systemTypeLabels: Record<string, string> = {
  Web: 'موقع إلكتروني',
  Website: 'موقع إلكتروني',
  'Mobile App': 'تطبيق جوال',
  'Mobile Application': 'تطبيق جوال',
  'Desktop Application': 'تطبيق مكتبي',
};

const actionButton =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors';

const whatsappHref = (mobile?: string): string | null => {
  const digits = (mobile ?? '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
};

export const RequestsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const optionsQuery = useRequestPageOptions();

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);

  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccountItem[]>([]);

  const shouldOpenCreate = searchParams.get('create') === '1';

  useEffect(() => {
    if (!shouldOpenCreate) {
      return;
    }
    setFormMode('create');
    setSelectedRequest(null);
    setIsFormOpen(true);
    setSearchParams({}, { replace: true });
  }, [shouldOpenCreate, setSearchParams]);

  const requestParams = useMemo(
    () => ({
      search: appliedFilters.search.trim() || undefined,
      system_type: appliedFilters.system_type
        ? Number(appliedFilters.system_type)
        : undefined,
      status: appliedFilters.status || undefined,
      start_date: appliedFilters.start_date || undefined,
      end_date: appliedFilters.end_date || undefined,
      page,
      per_page: 20,
    }),
    [appliedFilters, page]
  );

  const requestsQuery = useQuery({
    queryKey: queryKeys.admin.requests(requestParams),
    queryFn: async () => {
      const response = await adminApi.getRequests(requestParams);
      return response;
    },
  });

  const requests = requestsQuery.data?.data ?? [];
  const meta = requestsQuery.data?.meta;

  const refreshRequests = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.requestsList }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: async (
      payload: CreateProjectRequestPayload | UpdateProjectRequestPayload
    ) => {
      if (formMode === 'create') {
        await adminApi.createRequest(payload as CreateProjectRequestPayload);
      } else if (selectedRequest) {
        await adminApi.updateRequest(
          selectedRequest.id,
          payload as UpdateProjectRequestPayload
        );
      }
    },
    onSuccess: () => {
      void refreshRequests();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateRequestStatus(id, status),
    onSuccess: async (_data, variables) => {
      setActionError(null);
      await refreshRequests();
      // The backend returns 409 for a repeated status. If another admin changed
      // the row first, the refetch above is the source of truth.
      void variables;
    },
    onError: (error) => {
      setActionError(
        isConflictError(error)
          ? 'هذه هي الحالة الحالية للطلب، تم تحديث القائمة'
          : getApiErrorMessage(error, 'تعذّر تحديث حالة الطلب')
      );
      void refreshRequests();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteRequest(id),
    onSuccess: () => {
      setActionError(null);
      if (requests.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      }
      void refreshRequests();
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'تعذّر حذف الطلب'));
    },
  });

  const clearSocialMutation = useMutation({
    mutationFn: (id: number) => adminApi.updateRequest(id, { social_media: {} }),
    onSuccess: () => {
      setActionError(null);
      void refreshRequests();
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'تعذّر حذف روابط التواصل'));
    },
  });

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setFilterError(null);

    if (Boolean(filters.start_date) !== Boolean(filters.end_date)) {
      setFilterError('أدخل تاريخ البدء وتاريخ الانتهاء معاً');
      return;
    }

    setAppliedFilters(filters);
    setPage(1);
  };

  const openCreate = () => {
    setFormMode('create');
    setSelectedRequest(null);
    setIsFormOpen(true);
  };

  const openEdit = (request: ProjectRequest) => {
    setFormMode('edit');
    setSelectedRequest(request);
    setIsFormOpen(true);
  };

  const openSocial = (request: ProjectRequest) => {
    setSelectedRequest(request);
    setSocialAccounts(request.social_media_accounts ?? []);
    setIsSocialOpen(true);
  };

  const statuses = optionsQuery.data?.statuses ?? [];
  const systemTypes = optionsQuery.data?.system_types ?? [];

  return (
    <div className="space-y-6 rtl">
      <AdminHeader
        title="طلبات المشاريع"
        subtitle="إدارة ومتابعة كافة طلبات البرمجيات والتطبيقات المقدمة من العملاء"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-colors hover:bg-primary-container"
          >
            <Plus className="h-4 w-4" />
            طلب جديد
          </button>
        }
      />

      {actionError && (
        <div className="rounded-xl bg-error-container px-4 py-3 text-sm font-semibold text-on-error-container">
          {actionError}
        </div>
      )}

      <AdminCard title="البحث والفلترة" bodyClassName="p-5">
        <form onSubmit={applyFilters} className="space-y-4">
          {filterError && (
            <p className="rounded-lg bg-error-container px-3 py-2 text-xs font-bold text-on-error-container">
              {filterError}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">اسم المشروع</span>
              <input
                type="text"
                value={filters.search}
                maxLength={50}
                onChange={(event) =>
                  setFilters((previous) => ({ ...previous, search: event.target.value }))
                }
                placeholder="بحث باسم المشروع..."
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">نوع النظام</span>
              <select
                value={filters.system_type}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    system_type: event.target.value,
                  }))
                }
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">جميع الأنظمة</option>
                {systemTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">الحالة</span>
              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((previous) => ({ ...previous, status: event.target.value }))
                }
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">جميع الحالات</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status] ?? status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">من تاريخ</span>
              <input
                type="date"
                value={filters.start_date}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    start_date: event.target.value,
                  }))
                }
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">إلى تاريخ</span>
              <input
                type="date"
                value={filters.end_date}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    end_date: event.target.value,
                  }))
                }
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container"
              >
                <Filter className="h-4 w-4" />
                تطبيق الفلتر
              </button>
              <PageOptionsRefreshButton label="تحديث الخيارات" />
            </div>
          </div>
        </form>
      </AdminCard>

      <AdminCard
        title="قائمة الطلبات"
        subtitle={meta ? `${meta.total} طلب إجمالاً` : undefined}
        bodyClassName="p-0"
      >
        {optionsQuery.isError && (
          <div className="border-b border-error-container bg-error-container/40 px-5 py-3 text-xs font-semibold text-on-error-container">
            تعذّر تحميل خيارات الفلترة. يمكنك تحديثها من الزر أعلاه
          </div>
        )}

        {requestsQuery.isLoading ? (
          <LoadingState label="جاري تحميل الطلبات..." />
        ) : requestsQuery.isError ? (
          <ErrorState
            message={getApiErrorMessage(
              requestsQuery.error,
              'تعذّر تحميل الطلبات. قد تكون الجلسة منتهية'
            )}
            onRetry={() => void requestsQuery.refetch()}
          />
        ) : requests.length === 0 ? (
          <EmptyState
            title="لا توجد طلبات مطابقة"
            description="جرّب تعديل خيارات الفلترة أو أضف طلباً جديداً"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-outline-variant/40 bg-surface-container-low text-xs font-bold text-on-surface-variant">
                <tr>
                  <th className="p-4">المعرف</th>
                  <th className="p-4">اسم المشروع</th>
                  <th className="p-4">رقم الهاتف</th>
                  <th className="p-4">نوع النظام</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {requests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-surface-container-low/60">
                    <td className="p-4 font-mono font-bold text-primary">#{request.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-on-surface">{request.project_name}</p>
                      <p className="mt-0.5 max-w-[260px] truncate text-xs text-on-surface-variant">
                        {request.description || '—'}
                      </p>
                    </td>
                    <td className="p-4 font-mono text-xs text-on-surface-variant" dir="ltr">
                      {(() => {
                        const href = whatsappHref(request.mobile);
                        return href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline decoration-dotted underline-offset-2 hover:text-primary-container"
                          >
                            {request.mobile}
                          </a>
                        ) : (
                          request.mobile ?? '—'
                        );
                      })()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {(request.system_types ?? []).map((type, index) => {
                          const name = type.name || '—';
                          return (
                            <span
                              key={`${name}-${index}`}
                              className="rounded-full bg-surface-container px-2.5 py-1 text-[11px] font-bold text-on-surface-variant"
                            >
                              {systemTypeLabels[name] ?? name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <RequestStatusBadge status={request.status} />
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {new Date(request.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openSocial(request)}
                          className={`${actionButton} bg-primary-fixed text-on-primary-fixed-variant hover:opacity-80`}
                          title="عرض حسابات التواصل"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          حسابات
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(request)}
                          className={`${actionButton} bg-surface-container text-on-surface-variant hover:bg-surface-container-high`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm('هل تريد حذف روابط التواصل لهذا الطلب؟')
                            ) {
                              clearSocialMutation.mutate(request.id);
                            }
                          }}
                          className={`${actionButton} bg-surface-container text-on-surface-variant hover:bg-surface-container-high`}
                        >
                          <Unlink className="h-3.5 w-3.5" />
                          مسح الروابط
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل تريد حذف هذا الطلب نهائياً؟')) {
                              deleteMutation.mutate(request.id);
                            }
                          }}
                          className={`${actionButton} bg-error-container text-on-error-container hover:opacity-80`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                        {statuses
                          .filter((status) => status !== request.status)
                          .map((status) => (
                            <button
                              key={status}
                              type="button"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                statusMutation.mutate({ id: request.id, status })
                              }
                              className="rounded-full border border-outline-variant/70 px-2.5 py-1 text-[11px] font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
                            >
                              نقل إلى {statusLabels[status] ?? status}
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            perPage={meta.per_page}
            onPageChange={setPage}
            isLoading={requestsQuery.isFetching}
          />
        )}
      </AdminCard>

      <RequestFormModal
        isOpen={isFormOpen}
        mode={formMode}
        request={selectedRequest}
        systemTypes={systemTypes}
        onSubmit={(payload) => saveMutation.mutateAsync(payload)}
        onClose={() => setIsFormOpen(false)}
      />

      <SocialMediaModal
        isOpen={isSocialOpen}
        onClose={() => setIsSocialOpen(false)}
        projectName={selectedRequest?.project_name ?? ''}
        accounts={socialAccounts}
        isLoading={false}
      />
    </div>
  );
};
