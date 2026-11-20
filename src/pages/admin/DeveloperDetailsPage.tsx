import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  MapPin,
  MessageSquarePlus,
  Phone,
  Trash2,
  UserRound,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ErrorState, LoadingState } from '../../components/admin/AsyncState';
import {
  DeveloperStatusBadge,
  ReadinessBadge,
} from '../../components/admin/StatusBadge';
import { useDeveloperPageOptions } from '../../hooks/usePageOptions';
import {
  getApiErrorMessage,
  isConflictError,
} from '../../lib/apiErrors';
import { queryKeys } from '../../lib/queryKeys';
import type { DeveloperDetails } from '../../types/api';

const labels: Record<string, string> = {
  full_time: 'دوام كامل',
  freelance: 'عمل حر',
  both: 'كليهما',
  '10_20': '10–20 ساعة أسبوعياً',
  '20_30': '20–30 ساعة أسبوعياً',
  full_time_40: 'دوام كامل (40 ساعة)',
};

export const DeveloperDetailsPage: React.FC = () => {
  const { id } = useParams();
  const developerId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const optionsQuery = useDeveloperPageOptions();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [noteText, setNoteText] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const detailsQuery = useQuery({
    queryKey: queryKeys.admin.developerDetails(developerId),
    queryFn: async () => {
      const response = await adminApi.getDeveloperDetails(developerId);
      return response.data;
    },
    enabled: Number.isInteger(developerId) && developerId > 0,
  });

  const developer = detailsQuery.data;

  useEffect(() => {
    if (developer) {
      setSelectedStatus(developer.status);
    }
  }, [developer]);

  const refreshDeveloper = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.developerDetails(developerId),
      }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.developersList }),
    ]);
  };

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      adminApi.updateDeveloperStatus(developerId, status as never),
    onSuccess: async () => {
      setActionError(null);
      setActionSuccess('تم تحديث حالة المطور.');
      await refreshDeveloper();
    },
    onError: (error) => {
      setActionSuccess(null);
      setActionError(
        isConflictError(error)
          ? 'هذه هي الحالة الحالية للمطور.'
          : getApiErrorMessage(error, 'تعذّر تحديث حالة المطور.')
      );
    },
  });

  const readinessMutation = useMutation({
    mutationFn: (isReady: boolean) =>
      adminApi.updateDeveloperReadiness(developerId, isReady),
    onSuccess: async () => {
      setActionError(null);
      setActionSuccess('تم تحديث حالة الجاهزية.');
      await refreshDeveloper();
    },
    onError: (error) => {
      setActionSuccess(null);
      setActionError(
        isConflictError(error)
          ? 'القيمة المطلوبة هي القيمة الحالية بالفعل.'
          : getApiErrorMessage(error, 'تعذّر تحديث الجاهزية.')
      );
    },
  });

  const noteMutation = useMutation({
    mutationFn: (text: string) => adminApi.addDeveloperNote(developerId, text),
    onSuccess: async () => {
      setNoteText('');
      setActionError(null);
      setActionSuccess('تمت إضافة الملاحظة.');
      await refreshDeveloper();
    },
    onError: (error) => {
      setActionSuccess(null);
      setActionError(getApiErrorMessage(error, 'تعذّر إضافة الملاحظة.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteDeveloper(developerId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.developersList }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.developerPageOptions,
        }),
      ]);
      navigate('/dashboard/developers', { replace: true });
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'تعذّر حذف المطور.'));
    },
  });

  if (!Number.isInteger(developerId) || developerId <= 0) {
    return <ErrorState message="معرّف المطور غير صالح." />;
  }

  return (
    <div className="space-y-6 rtl">
      <AdminHeader
        title="ملف المطور"
        subtitle={developer ? `${developer.full_name} · ${developer.reference_number}` : undefined}
        actions={
          <Link
            to="/dashboard/developers"
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant/70 bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للقائمة
          </Link>
        }
      />

      {actionError && (
        <div className="rounded-xl bg-error-container px-4 py-3 text-sm font-semibold text-on-error-container">
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="rounded-xl bg-tertiary-fixed/50 px-4 py-3 text-sm font-semibold text-on-tertiary-fixed-variant">
          {actionSuccess}
        </div>
      )}

      {detailsQuery.isLoading ? (
        <AdminCard bodyClassName="p-0">
          <LoadingState label="جاري تحميل ملف المطور..." />
        </AdminCard>
      ) : detailsQuery.isError || !developer ? (
        <AdminCard bodyClassName="p-0">
          <ErrorState
            message={getApiErrorMessage(
              detailsQuery.error,
              'تعذّر تحميل ملف المطور.'
            )}
            onRetry={() => void detailsQuery.refetch()}
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AdminCard title="البيانات الأساسية" bodyClassName="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                  <UserRound className="h-7 w-7" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-on-surface">
                      {developer.full_name}
                    </h3>
                    <DeveloperStatusBadge status={developer.status} />
                    <ReadinessBadge isReady={developer.is_ready} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span dir="ltr">{developer.mobile}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {developer.city?.name ?? '—'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      {developer.experience_years}
                    </p>
                    <p>رقم التسجيل: {developer.reference_number}</p>
                  </div>
                  {developer.bio && (
                    <p className="rounded-xl bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface">
                      {developer.bio}
                    </p>
                  )}
                </div>
              </div>
            </AdminCard>

            <AdminCard title="التخصصات والتقنيات" bodyClassName="p-5">
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-bold text-on-surface-variant">التخصصات</p>
                  <div className="flex flex-wrap gap-2">
                    {developer.specializations.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed-variant"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold text-on-surface-variant">التقنيات</p>
                  <div className="flex flex-wrap gap-2">
                    {developer.technologies.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-lg bg-surface-container-high px-2.5 py-1 text-xs text-on-surface-variant"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-outline-variant/40 pt-4 text-sm sm:grid-cols-4">
                  <Info label="نوع العقد" value={labels[developer.contract_type] ?? developer.contract_type} />
                  <Info label="الساعات" value={labels[developer.weekly_hours] ?? developer.weekly_hours} />
                  <Info
                    label="خبرة مؤسسية"
                    value={developer.has_institutional_experience ? 'نعم' : 'لا'}
                  />
                  <Info
                    label="مشاريع منجزة"
                    value={developer.completed_projects_count ?? '—'}
                  />
                  <Info
                    label="عمل عن بعد"
                    value={developer.is_remote_ready ? 'نعم' : 'لا'}
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard
              title="المستندات"
              subtitle="روابط التنزيل مؤقتة وصالحة لمدة 15 دقيقة."
              bodyClassName="p-0"
            >
              {developer.documents.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-on-surface-variant">
                  لا توجد مستندات مرفقة.
                </p>
              ) : (
                <div className="divide-y divide-outline-variant/30">
                  {developer.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-bold text-on-surface">
                            {document.file_name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {document.file_type} · {(document.file_size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <a
                        href={document.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-fixed px-3 py-1.5 text-xs font-bold text-on-primary-fixed-variant hover:opacity-80"
                      >
                        <Download className="h-3.5 w-3.5" />
                        تنزيل
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>

            <AdminCard title="الملاحظات الداخلية" bodyClassName="p-5">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const text = noteText.trim();
                  if (!text || text.length > 3000) {
                    setActionError('الملاحظة مطلوبة ويجب ألا تتجاوز 3000 حرف.');
                    return;
                  }
                  noteMutation.mutate(text);
                }}
                className="space-y-3"
              >
                <textarea
                  rows={3}
                  maxLength={3000}
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="أضف ملاحظة داخلية للمطور..."
                  className="w-full resize-y rounded-xl border border-outline-variant/70 bg-surface-container-low p-3 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={noteMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-on-primary hover:bg-primary-container disabled:opacity-60"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  إضافة ملاحظة
                </button>
              </form>

              <div className="mt-5 space-y-3 border-t border-outline-variant/40 pt-5">
                {developer.notes.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">لا توجد ملاحظات بعد.</p>
                ) : (
                  developer.notes.map((note) => (
                    <div key={note.id} className="rounded-xl bg-surface-container-low p-4">
                      <p className="text-sm leading-relaxed text-on-surface">{note.text}</p>
                      <p className="mt-2 text-[11px] text-on-surface-variant">
                        {note.admin.username} ·{' '}
                        {new Date(note.created_at).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </AdminCard>
          </div>

          <div className="space-y-6">
            <AdminCard title="الإجراءات الإدارية" bodyClassName="space-y-5 p-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-on-surface-variant">حالة المطور</span>
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {(optionsQuery.data?.filters.statuses ?? [developer.status]).map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </select>
              </label>
              <button
                type="button"
                disabled={
                  selectedStatus === developer.status || statusMutation.isPending
                }
                onClick={() => statusMutation.mutate(selectedStatus)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                حفظ الحالة
              </button>

              <button
                type="button"
                disabled={readinessMutation.isPending}
                onClick={() => readinessMutation.mutate(!developer.is_ready)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/70 px-4 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
              >
                {developer.is_ready ? 'إلغاء الجاهزية' : 'تحديد كجاهز للعمل'}
              </button>

              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (
                    window.confirm(
                      `هل تريد حذف المطور ${developer.full_name} نهائياً؟`
                    )
                  ) {
                    deleteMutation.mutate();
                  }
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-error-container px-4 py-2.5 text-sm font-bold text-on-error-container transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                حذف المطور
              </button>
            </AdminCard>

            <AdminCard title="معلومات التسجيل" bodyClassName="space-y-3 p-5">
              <Info label="تاريخ التسجيل" value={new Date(developer.created_at).toLocaleString('ar-SA')} />
              <Info label="آخر تحديث" value={new Date(developer.updated_at).toLocaleString('ar-SA')} />
              <Info label="حالة الحساب" value={developer.status} />
            </AdminCard>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[11px] font-bold text-on-surface-variant">{label}</p>
    <p className="mt-0.5 text-sm font-semibold text-on-surface">{value}</p>
  </div>
);
