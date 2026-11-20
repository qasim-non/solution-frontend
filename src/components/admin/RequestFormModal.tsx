import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { getValidationErrors, getApiErrorMessage } from '../../lib/apiErrors';
import type {
  CreateProjectRequestPayload,
  ProjectRequest,
  SystemType,
  UpdateProjectRequestPayload,
} from '../../types/api';

interface RequestFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  request: ProjectRequest | null;
  systemTypes: SystemType[];
  onSubmit: (
    payload: CreateProjectRequestPayload | UpdateProjectRequestPayload
  ) => Promise<void>;
  onClose: () => void;
}

type FieldErrors = Record<string, string>;

const readRequestSystemTypeIds = (request: ProjectRequest | null): number[] =>
  (request?.system_types ?? [])
    .map((item) => item.id ?? item.ignore?.type_id)
    .filter((id): id is number => typeof id === 'number');

export const RequestFormModal: React.FC<RequestFormModalProps> = ({
  isOpen,
  mode,
  request,
  systemTypes,
  onSubmit,
  onClose,
}) => {
  const [projectName, setProjectName] = useState('');
  const [mobile, setMobile] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setProjectName(request?.project_name ?? '');
    setMobile(request?.mobile ?? '');
    setDescription(request?.description ?? '');
    setSelectedTypes(readRequestSystemTypeIds(request));
    setFieldErrors({});
    setFormError(null);
    setIsSaving(false);
  }, [isOpen, request]);

  if (!isOpen) {
    return null;
  }

  const clearError = (key: string) => {
    setFieldErrors((previous) => {
      if (!previous[key]) {
        return previous;
      }
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const toggleType = (id: number) => {
    setSelectedTypes((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
    clearError('system_types');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};
    const name = projectName.trim();
    const cleanMobile = mobile.replace(/\s/g, '');
    const cleanDescription = description.trim();

    if (name.length < 3 || name.length > 100) {
      errors.project_name = 'اسم المشروع يجب أن يكون بين 3 و 100 حرف.';
    }
    if (cleanMobile.length < 10 || cleanMobile.length > 20) {
      errors.mobile = 'رقم الهاتف يجب أن يكون بين 10 و 20 خانتاً.';
    }
    if (cleanDescription.length > 1000) {
      errors.description = 'الوصف لا يمكن أن يتجاوز 1000 حرف.';
    }
    if (selectedTypes.length === 0) {
      errors.system_types = 'اختر نوع نظام واحد على الأقل.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      project_name: name,
      mobile: cleanMobile,
      description: cleanDescription || undefined,
      system_types: selectedTypes,
    };

    setIsSaving(true);
    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      const apiErrors = getValidationErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])
          )
        );
      }
      setFormError(
        getApiErrorMessage(error, 'تعذّر حفظ الطلب. يرجى المحاولة مرة أخرى.')
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-primary ${
      hasError ? 'border-error' : 'border-outline-variant/70'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm rtl">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-xl">
        <header className="flex items-center justify-between border-b border-outline-variant/40 bg-surface-container-low px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-on-surface">
              {mode === 'create' ? 'إضافة طلب مشروع' : 'تعديل طلب المشروع'}
            </h2>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              {mode === 'create'
                ? 'سيتم إنشاء الطلب بحالة قيد الانتظار.'
                : 'يتم استبدال أنظمة العمل عند الحفظ. روابط التواصل تبقى كما هي.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 p-5">
          {formError && (
            <div className="flex items-start gap-2 rounded-xl bg-error-container p-3 text-sm font-semibold text-on-error-container">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-on-surface">اسم المشروع</span>
            <input
              value={projectName}
              onChange={(event) => {
                setProjectName(event.target.value);
                clearError('project_name');
              }}
              className={inputClass(Boolean(fieldErrors.project_name))}
            />
            {fieldErrors.project_name && (
              <span className="text-xs font-semibold text-error">
                {fieldErrors.project_name}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-on-surface">رقم الهاتف</span>
            <input
              dir="ltr"
              value={mobile}
              onChange={(event) => {
                setMobile(event.target.value);
                clearError('mobile');
              }}
              placeholder="+966500000000"
              className={`${inputClass(Boolean(fieldErrors.mobile))} text-left`}
            />
            {fieldErrors.mobile && (
              <span className="text-xs font-semibold text-error">{fieldErrors.mobile}</span>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-on-surface">الوصف</span>
            <textarea
              rows={3}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                clearError('description');
              }}
              className={inputClass(Boolean(fieldErrors.description))}
            />
            {fieldErrors.description && (
              <span className="text-xs font-semibold text-error">{fieldErrors.description}</span>
            )}
          </label>

          <fieldset>
            <legend className="mb-2 text-xs font-bold text-on-surface">أنظمة العمل</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {systemTypes.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary-fixed text-on-primary-fixed-variant'
                        : 'border-outline-variant/70 text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    {type.name}
                  </button>
                );
              })}
            </div>
            {fieldErrors.system_types && (
              <p className="mt-2 text-xs font-semibold text-error">
                {fieldErrors.system_types}
              </p>
            )}
          </fieldset>

          <div className="flex justify-end gap-2 border-t border-outline-variant/40 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-surface-container px-5 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
