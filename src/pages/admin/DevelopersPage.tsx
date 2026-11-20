import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, UserRound } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EmptyState, ErrorState, LoadingState } from '../../components/admin/AsyncState';
import { PageOptionsRefreshButton } from '../../components/admin/PageOptionsRefreshButton';
import { Pagination } from '../../components/admin/Pagination';
import { DeveloperStatusBadge, ReadinessBadge } from '../../components/admin/StatusBadge';
import { useDeveloperPageOptions } from '../../hooks/usePageOptions';
import { getApiErrorMessage } from '../../lib/apiErrors';
import { queryKeys } from '../../lib/queryKeys';

interface Filters {
  search: string;
  status: string;
  city_id: string;
  specialization_id: string;
  experience_years: string;
  is_ready: string;
  technology: string;
}

const initialFilters: Filters = {
  search: '',
  status: '',
  city_id: '',
  specialization_id: '',
  experience_years: '',
  is_ready: '',
  technology: '',
};

const statusLabels: Record<string, string> = {
  pending: 'جديد',
  under_review: 'قيد المراجعة',
  shortlisted: 'القائمة المختصرة',
  approved: 'معتمد',
  rejected: 'مرفوض',
  suspended: 'موقوف',
};

export const DevelopersPage: React.FC = () => {
  const navigate = useNavigate();
  const optionsQuery = useDeveloperPageOptions();

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const developerParams = useMemo(
    () => ({
      search: appliedFilters.search.trim() || undefined,
      status: appliedFilters.status || undefined,
      city_id: appliedFilters.city_id ? Number(appliedFilters.city_id) : undefined,
      specialization_id: appliedFilters.specialization_id
        ? Number(appliedFilters.specialization_id)
        : undefined,
      experience_years: appliedFilters.experience_years || undefined,
      is_ready:
        appliedFilters.is_ready === ''
          ? undefined
          : appliedFilters.is_ready === 'true',
      technology: appliedFilters.technology.trim() || undefined,
      page,
      per_page: perPage,
    }),
    [appliedFilters, page, perPage]
  );

  const developersQuery = useQuery({
    queryKey: queryKeys.admin.developers(developerParams),
    queryFn: async () => {
      const response = await adminApi.getDevelopers(developerParams);
      return response;
    },
  });

  const developers = developersQuery.data?.data ?? [];
  const meta = developersQuery.data?.meta;
  const options = optionsQuery.data;

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedFilters(filters);
    setPage(1);
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const statistics = options?.statistics;

  return (
    <div className="space-y-6 rtl">
      <AdminHeader
        title="المطورون"
        subtitle="مراجعة طلبات الانضمام، إدارة الحالات، واستعراض الملفات المهنية"
        actions={<PageOptionsRefreshButton />}
      />

      {statistics && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: 'إجمالي المطورين', value: statistics.total },
            { label: 'طلبات جديدة', value: statistics.pending },
            { label: 'مستعدون للعمل', value: statistics.ready },
            { label: 'معتمدون', value: statistics.approved },
            { label: 'انضموا هذا الشهر', value: statistics.registered_this_month },
            { label: 'نسبة الاعتماد', value: `${statistics.approval_rate}%` },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-sm"
            >
              <p className="text-2xl font-bold text-primary">{item.value}</p>
              <p className="mt-1 text-[11px] font-semibold text-on-surface-variant">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <AdminCard title="البحث والفلترة" bodyClassName="p-5">
        <form onSubmit={applyFilters} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">الاسم</span>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-outline" />
                <input
                  type="text"
                  maxLength={100}
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="بحث بالاسم..."
                  className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low py-2.5 pr-9 pl-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">الحالة</span>
              <select
                value={filters.status}
                onChange={(event) => updateFilter('status', event.target.value)}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">جميع الحالات</option>
                {(options?.filters.statuses ?? []).map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status] ?? status}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">المدينة</span>
              <select
                value={filters.city_id}
                onChange={(event) => updateFilter('city_id', event.target.value)}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">جميع المدن</option>
                {(options?.filters.cities ?? []).map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">التخصص</span>
              <select
                value={filters.specialization_id}
                onChange={(event) =>
                  updateFilter('specialization_id', event.target.value)
                }
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">جميع التخصصات</option>
                {(options?.filters.specializations ?? []).map((specialization) => (
                  <option key={specialization.id} value={specialization.id}>
                    {specialization.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">سنوات الخبرة</span>
              <select
                value={filters.experience_years}
                onChange={(event) => updateFilter('experience_years', event.target.value)}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">كل المستويات</option>
                {(options?.filters.experience_years ?? []).map((experience) => (
                  <option key={experience} value={experience}>
                    {experience}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">الجاهزية</span>
              <select
                value={filters.is_ready}
                onChange={(event) => updateFilter('is_ready', event.target.value)}
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">الكل</option>
                {(options?.filters.readiness ?? [true, false]).map((ready) => (
                  <option key={String(ready)} value={String(ready)}>
                    {ready ? 'مستعد للعمل' : 'غير مستعد'}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">تقنية</span>
              <input
                type="text"
                maxLength={100}
                value={filters.technology}
                onChange={(event) => updateFilter('technology', event.target.value)}
                placeholder="مثال: Laravel"
                className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
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
                {(options?.filters.per_page ?? [10, 25, 50]).map((value) => (
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
        title="قائمة المطورين"
        subtitle={meta ? `${meta.total} مطور إجمالاً` : undefined}
        bodyClassName="p-0"
      >
        {optionsQuery.isError && (
          <div className="border-b border-error-container bg-error-container/40 px-5 py-3 text-xs font-semibold text-on-error-container">
            تعذّر تحميل خيارات صفحة المطورين. استخدم زر تحديث الخيارات للمحاولة مرة أخرى
          </div>
        )}

        {developersQuery.isLoading ? (
          <LoadingState label="جاري تحميل المطورين..." />
        ) : developersQuery.isError ? (
          <ErrorState
            message={getApiErrorMessage(
              developersQuery.error,
              'تعذّر تحميل المطورين. قد تكون الجلسة منتهية'
            )}
            onRetry={() => void developersQuery.refetch()}
          />
        ) : developers.length === 0 ? (
          <EmptyState
            title="لا يوجد مطورون مطابقون"
            description="جرّب تعديل خيارات البحث والفلترة"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-outline-variant/40 bg-surface-container-low text-xs font-bold text-on-surface-variant">
                <tr>
                  <th className="p-4">المطور</th>
                  <th className="p-4">المدينة</th>
                  <th className="p-4">التخصصات</th>
                  <th className="p-4">التقنيات</th>
                  <th className="p-4">الخبرة</th>
                  <th className="p-4">الجاهزية</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الملف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {developers.map((developer) => (
                  <tr
                    key={developer.id}
                    className="transition-colors hover:bg-surface-container-low/60"
                  >
                    <td className="p-4">
                      <p className="font-bold text-on-surface">{developer.full_name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-primary" dir="ltr">
                        {developer.reference_number}
                      </p>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">{developer.city}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap justify-end gap-1">
                        {developer.specializations.slice(0, 2).map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-surface-container px-2 py-0.5 text-[11px] font-bold text-on-surface-variant"
                          >
                            {item}
                          </span>
                        ))}
                        {developer.specializations.length > 2 && (
                          <span className="text-[11px] text-outline">
                            +{developer.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex max-w-[220px] flex-wrap justify-end gap-1">
                        {developer.technologies.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="rounded bg-surface-container-high px-1.5 py-0.5 text-[10px] text-on-surface-variant"
                          >
                            {item}
                          </span>
                        ))}
                        {developer.technologies.length > 3 && (
                          <span className="text-[10px] text-outline">
                            +{developer.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {developer.experience_years}
                    </td>
                    <td className="p-4">
                      <ReadinessBadge isReady={developer.is_ready} />
                    </td>
                    <td className="p-4">
                      <DeveloperStatusBadge status={developer.status} />
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/developers/${developer.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary-fixed px-2.5 py-1.5 text-[11px] font-bold text-on-primary-fixed-variant hover:opacity-80"
                      >
                        <UserRound className="h-3.5 w-3.5" />
                        عرض الملف
                      </button>
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
            isLoading={developersQuery.isFetching}
          />
        )}
      </AdminCard>
    </div>
  );
};
