import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, KeyRound, Loader2, UserRound } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { getValidationErrors, getApiErrorMessage } from '../../lib/apiErrors';
import type { AdminAccount } from '../../types/api';

export const AccountSettingsPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<AdminAccount | null>(null);

  const updateMutation = useMutation({
    mutationFn: adminApi.updateAccount,
    onSuccess: (response) => {
      setSuccess(response.data);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setFieldErrors({});
      setFormError(null);
    },
    onError: (error) => {
      const apiErrors = getValidationErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])
          )
        );
      }
      setFormError(
        getApiErrorMessage(error, 'تعذّر تحديث بيانات الحساب.')
      );
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);

    const errors: Record<string, string> = {};
    const cleanUsername = username.trim();

    if (!cleanUsername && !password && !confirmPassword) {
      setFormError('أدخل اسم المستخدم أو كلمة المرور على الأقل.');
      return;
    }

    if (cleanUsername && (cleanUsername.length < 3 || cleanUsername.length > 50)) {
      errors.username = 'اسم المستخدم يجب أن يكون بين 3 و 50 حرفاً.';
    }
    if (password && (password.length < 8 || password.length > 255)) {
      errors.password = 'كلمة المرور يجب أن تكون بين 8 و 255 حرفاً.';
    }
    if (password !== confirmPassword) {
      errors.confirm_password = 'تأكيد كلمة المرور غير مطابق.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload: { username?: string; password?: string } = {};
    if (cleanUsername) {
      payload.username = cleanUsername;
    }
    if (password) {
      payload.password = password;
    }

    updateMutation.mutate(payload);
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-primary ${
      hasError ? 'border-error' : 'border-outline-variant/70'
    }`;

  return (
    <div className="max-w-3xl space-y-6 rtl">
      <AdminHeader
        title="إعدادات الحساب"
        subtitle="تحديث اسم مستخدم المدير وكلمة المرور الخاصة بحسابك الحالي."
      />

      {formError && (
        <div className="flex items-start gap-2 rounded-xl bg-error-container p-4 text-sm font-semibold text-on-error-container">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-xl bg-tertiary-fixed/50 p-4 text-sm font-semibold text-on-tertiary-fixed-variant">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            تم تحديث الحساب بنجاح{success.username ? ` · ${success.username}` : ''}.
            لا حاجة لتسجيل الدخول من جديد.
          </span>
        </div>
      )}

      <AdminCard title="بيانات الحساب" bodyClassName="p-5">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-on-surface-variant">
              اسم المستخدم الجديد
            </span>
            <div className="relative">
              <UserRound className="absolute right-3 top-3 h-4 w-4 text-outline" />
              <input
                type="text"
                minLength={3}
                maxLength={50}
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setFieldErrors((previous) => ({ ...previous, username: '' }));
                }}
                placeholder="اتركه فارغاً للإبقاء عليه"
                className={`${inputClass(Boolean(fieldErrors.username))} pr-9`}
              />
            </div>
            {fieldErrors.username && (
              <span className="text-xs font-semibold text-error">
                {fieldErrors.username}
              </span>
            )}
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">
                كلمة المرور الجديدة
              </span>
              <div className="relative">
                <KeyRound className="absolute right-3 top-3 h-4 w-4 text-outline" />
                <input
                  type="password"
                  minLength={8}
                  maxLength={255}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((previous) => ({ ...previous, password: '' }));
                  }}
                  placeholder="اتركها فارغة للإبقاء عليها"
                  className={`${inputClass(Boolean(fieldErrors.password))} pr-9`}
                />
              </div>
              {fieldErrors.password && (
                <span className="text-xs font-semibold text-error">
                  {fieldErrors.password}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface-variant">
                تأكيد كلمة المرور
              </span>
              <input
                type="password"
                minLength={8}
                maxLength={255}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setFieldErrors((previous) => ({
                    ...previous,
                    confirm_password: '',
                  }));
                }}
                className={inputClass(Boolean(fieldErrors.confirm_password))}
              />
              {fieldErrors.confirm_password && (
                <span className="text-xs font-semibold text-error">
                  {fieldErrors.confirm_password}
                </span>
              )}
            </label>
          </div>

          <div className="flex justify-end border-t border-outline-variant/40 pt-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              حفظ التغييرات
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
};
