import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EmptyState, ErrorState, LoadingState } from '../../components/admin/AsyncState';
import { MessageDetailsModal } from '../../components/admin/MessageDetailsModal';
import { Pagination } from '../../components/admin/Pagination';
import { getApiErrorMessage } from '../../lib/apiErrors';
import { queryKeys } from '../../lib/queryKeys';
import type { ContactMessage } from '../../types/api';

export const MessagesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const messagesQuery = useQuery({
    queryKey: queryKeys.admin.messages({ page, per_page: 20 }),
    queryFn: async () => {
      const response = await adminApi.getMessages({ page, per_page: 20 });
      return response;
    },
  });

  const messages = messagesQuery.data?.data ?? [];
  const meta = messagesQuery.data?.meta;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteMessage(id),
    onSuccess: () => {
      setActionError(null);
      if (messages.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      }
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.messagesList,
      });
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'تعذّر حذف الرسالة'));
    },
  });

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 rtl">
      <AdminHeader
        title="صندوق الرسائل"
        subtitle="الرسائل الواردة من نموذج التواصل في الموقع العام"
      />

      {actionError && (
        <div className="rounded-xl bg-error-container px-4 py-3 text-sm font-semibold text-on-error-container">
          {actionError}
        </div>
      )}

      <AdminCard
        title="الرسائل"
        subtitle={meta ? `${meta.total} رسالة إجمالاً` : undefined}
        bodyClassName="p-0"
      >
        {messagesQuery.isLoading ? (
          <LoadingState label="جاري تحميل الرسائل..." />
        ) : messagesQuery.isError ? (
          <ErrorState
            message={getApiErrorMessage(
              messagesQuery.error,
              'تعذر تحميل الرسائل. قد تكون الجلسة منتهية'
            )}
            onRetry={() => void messagesQuery.refetch()}
          />
        ) : messages.length === 0 ? (
          <EmptyState title="لا توجد رسائل حالياً" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-outline-variant/40 bg-surface-container-low text-xs font-bold text-on-surface-variant">
                <tr>
                  <th className="p-4">المرسل</th>
                  <th className="p-4">البريد الإلكتروني</th>
                  <th className="p-4">الرسالة</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {messages.map((message, index) => (
                  <tr
                    key={message.id ?? `${message.email}-${index}`}
                    className="transition-colors hover:bg-surface-container-low/60"
                  >
                    <td className="p-4 font-bold text-on-surface">{message.full_name}</td>
                    <td className="p-4 text-xs text-on-surface-variant" dir="ltr">
                      {message.email}
                    </td>
                    <td className="p-4">
                      <p className="max-w-[320px] truncate text-xs text-on-surface-variant">
                        {message.text_message}
                      </p>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {new Date(message.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openMessage(message)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-fixed px-2.5 py-1.5 text-[11px] font-bold text-on-primary-fixed-variant hover:opacity-80"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          عرض
                        </button>
                        <button
                          type="button"
                          disabled={message.id === undefined}
                          onClick={() => {
                            if (
                              message.id !== undefined &&
                              window.confirm('هل تريد حذف هذه الرسالة نهائياً؟')
                            ) {
                              deleteMutation.mutate(message.id);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-error-container px-2.5 py-1.5 text-[11px] font-bold text-on-error-container transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف
                        </button>
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
            isLoading={messagesQuery.isFetching}
          />
        )}
      </AdminCard>

      <MessageDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={selectedMessage}
      />
    </div>
  );
};
