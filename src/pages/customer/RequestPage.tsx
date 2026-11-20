import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/customer';
import { usePublicSystemTypes } from '../../hooks/usePageOptions';
import { getValidationErrors, getApiErrorMessage } from '../../lib/apiErrors';
import { analytics } from '../../lib/analytics';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Computer,
  Globe,
  Info,
  Loader2,
  Send,
  Smartphone,
} from 'lucide-react';

type FieldErrors = Record<string, string>;

const SOCIAL_PLATFORMS = [
  { id: '1', label: 'Instagram', placeholder: 'https://instagram.com/example' },
  { id: '2', label: 'Facebook', placeholder: 'https://facebook.com/example' },
  { id: '3', label: 'TikTok', placeholder: 'https://tiktok.com/@example' },
  { id: '4', label: 'YouTube', placeholder: 'https://youtube.com/@example' },
] as const;

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const RequestPage: React.FC = () => {
  const navigate = useNavigate();
  const systemTypesQuery = usePublicSystemTypes();

  const [projectName, setProjectName] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [phone, setPhone] = useState('');
  const [selectedSystemTypes, setSelectedSystemTypes] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [socialLinks, setSocialMedia] = useState<Record<string, string>>({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
  });
  const [showSocialFields, setShowSocialFields] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = (key: string) => {
    setFieldErrors((previous) => {
      if (!previous[key]) {
        return previous;
      }
      const next = { ...previous };
      delete next[key];
      return next;
    });
    setFormError(null);
  };

  const toggleSystemType = (id: number) => {
    setSelectedSystemTypes((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
    clearError('system_types');
  };

  const handleSocialChange = (platformId: string, value: string) => {
    setSocialMedia((previous) => ({ ...previous, [platformId]: value }));
    clearError(`social_media.${platformId}`);
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const name = projectName.trim();
    const mobile = `${countryCode}${phone.replace(/\s/g, '')}`;
    const cleanDescription = description.trim();

    if (name.length < 3 || name.length > 100) {
      errors.project_name = 'اسم المشروع يجب أن يكون بين 3 و 100 حرف';
    }

    if (mobile.length < 10 || mobile.length > 20) {
      errors.mobile = 'رقم الواتساب يجب أن يكون بين 10 و 20 خانتاً';
    }

    if (selectedSystemTypes.length === 0) {
      errors.system_types = 'اختر نوع نظام واحد على الأقل';
    }

    if (cleanDescription.length > 1000) {
      errors.description = 'الملاحظات لا يمكن أن تتجاوز 1000 حرف';
    }

    SOCIAL_PLATFORMS.forEach((platform) => {
      const value = socialLinks[platform.id]?.trim();
      if (!value) {
        return;
      }
      if (value.length > 255 || !isValidHttpUrl(value)) {
        errors[`social_media.${platform.id}`] =
          'أدخل رابطاً صحيحاً يبدأ بـ https:// ولا يتجاوز 255 حرفاً';
      }
    });

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError('يرجى تصحيح الحقول المحددة ثم إعادة المحاولة');
      return;
    }

    const cleanedSocial: Record<string, string> = {};
    SOCIAL_PLATFORMS.forEach((platform) => {
      const value = socialLinks[platform.id]?.trim();
      if (value) {
        cleanedSocial[platform.id] = value;
      }
    });

    setIsSubmitting(true);

    try {
      await customerApi.createProjectRequest({
        project_name: projectName.trim(),
        mobile: `${countryCode}${phone.replace(/\s/g, '')}`,
        description: description.trim() || undefined,
        system_types: selectedSystemTypes,
        social_media:
          Object.keys(cleanedSocial).length > 0 ? cleanedSocial : undefined,
      });

      analytics.event('project_request_submitted', {
        system_types_count: selectedSystemTypes.length,
        has_description: Boolean(description.trim()),
      });

      navigate('/success');
    } catch (error) {
      const apiErrors = getValidationErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])
          )
        );
      }
      setFormError(getApiErrorMessage(error, 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSystemIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('desktop') || lower.includes('مكتبي')) {
      return <Computer className="h-6 w-6" />;
    }
    if (lower.includes('web') || lower.includes('سحابي') || lower.includes('موقع')) {
      return <Globe className="h-6 w-6" />;
    }
    return <Smartphone className="h-6 w-6" />;
  };

  const systemTypes = systemTypesQuery.data ?? [];

  return (
    <div dir="rtl" className="mx-auto w-full max-w-[1200px] px-4 py-12 rtl md:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/40 bg-surface-container-low p-6">
          <div>
            <h1 className="text-xl font-bold text-on-surface">طلب مشروع جديد</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              قم بتعبئة التفاصيل أدناه لنتمكن من فهم متطلباتك بوضوح
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span>بيانات المشروع</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 p-6 md:p-8">
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-error-container p-4 text-sm font-semibold text-on-error-container"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface" htmlFor="projectName">
                اسم المشروع أو المتجر <span className="text-error">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(event) => {
                  setProjectName(event.target.value);
                  clearError('project_name');
                }}
                placeholder="أدخل اسم المشروع"
                className={`w-full rounded-xl border bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                  fieldErrors.project_name ? 'border-error' : 'border-outline-variant/70'
                }`}
              />
              {fieldErrors.project_name && (
                <p className="text-xs font-semibold text-error">{fieldErrors.project_name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface" htmlFor="whatsapp">
                رقم الواتساب <span className="text-error">*</span>
              </label>
              <div className="flex h-12 w-full items-stretch" dir="rtl">
                <select
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                  dir="rtl"
                  className="h-full w-[126px] shrink-0 rounded-r-xl border border-l-0 border-outline-variant/70 bg-surface-container-high px-2 text-sm text-on-surface-variant outline-none focus:border-primary sm:w-[150px] sm:px-3"
                >
                  <option value="+966">السعودية 🇸🇦 +966</option>
                  <option value="+971">الإمارات 🇦🇪 +971</option>
                  <option value="+20">مصر 🇪🇬 +20</option>
                  <option value="+962">الأردن 🇯🇴 +962</option>
                  <option value="+964">العراق 🇮🇶 +964</option>
                  <option value="+963">سوريا 🇸🇾 +963</option>
                  <option value="+961">لبنان 🇱🇧 +961</option>
                  <option value="+970">فلسطين 🇵🇸 +970</option>
                  <option value="+974">قطر 🇶🇦 +974</option>
                  <option value="+973">البحرين 🇧🇭 +973</option>
                  <option value="+965">الكويت 🇰🇼 +965</option>
                  <option value="+968">عمان 🇴🇲 +968</option>
                  <option value="+967">اليمن 🇾🇪 +967</option>
                  <option value="+249">السودان 🇸🇩 +249</option>
                  <option value="+218">ليبيا 🇱🇾 +218</option>
                  <option value="+216">تونس 🇹🇳 +216</option>
                  <option value="+213">الجزائر 🇩🇿 +213</option>
                  <option value="+212">المغرب 🇲🇦 +212</option>
                  <option value="+222">موريتانيا 🇲🇷 +222</option>
                  <option value="+221">السنغال 🇸🇳 +221</option>
                  <option value="+252">الصومال 🇸🇴 +252</option>
                  <option value="+211">جنوب السودان 🇸🇸 +211</option>
                  <option value="+253">جيبوتي 🇩🇯 +253</option>
                  <option value="+269">جزر القمر 🇰🇲 +269</option>
                </select>
                <input
                  id="whatsapp"
                  type="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    clearError('mobile');
                  }}
                  placeholder="5X XXX XXXX"
                  dir="ltr"
                  className={`h-full min-w-0 flex-1 rounded-l-xl border border-r-0 bg-surface-container-low px-3 py-0 text-left text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                    fieldErrors.mobile ? 'border-error' : 'border-outline-variant/70'
                  }`}
                />
              </div>
              {fieldErrors.mobile && (
                <p className="text-xs font-semibold text-error">{fieldErrors.mobile}</p>
              )}
            </div>
          </div>

          <div className="border-t border-outline-variant/40 pt-4">
            <div className="mb-4">
              <h2 className="mb-1 text-sm font-bold text-on-surface">
                نوع النظام المطلوب <span className="text-error">*</span>
              </h2>
              <p className="text-xs text-on-surface-variant">يمكنك اختيار أكثر من خيار</p>
            </div>

            {systemTypesQuery.isLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm font-semibold text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري تحميل الخيارات...
              </div>
            ) : systemTypesQuery.isError ? (
              <div className="rounded-xl bg-error-container p-4 text-sm font-semibold text-on-error-container">
                تعذّر تحميل أنظمة العمل. يرجى المحاولة مرة أخرى
                <button
                  type="button"
                  onClick={() => void systemTypesQuery.refetch()}
                  className="mr-2 underline"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : systemTypes.length === 0 ? (
              <p className="py-4 text-sm text-on-surface-variant">لا توجد أنظمة متاحة حالياً</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {systemTypes.map((type) => {
                  const isSelected = selectedSystemTypes.includes(type.id);
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => toggleSystemType(type.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-surface-container-low ring-2 ring-primary/20'
                          : 'border-outline-variant/70 bg-surface-container-lowest hover:border-primary'
                      }`}
                    >
                      <span
                        className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                          isSelected
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {getSystemIcon(type.name)}
                      </span>
                      <span className="text-center text-sm font-bold text-on-surface">
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {fieldErrors.system_types && (
              <p className="mt-2 text-xs font-semibold text-error">{fieldErrors.system_types}</p>
            )}
          </div>

          <div className="border-t border-outline-variant/40 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-on-surface">حسابات التواصل الاجتماعي</h2>
              <button
                type="button"
                onClick={() => setShowSocialFields((previous) => !previous)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>{showSocialFields ? 'إخفاء الحقول' : 'إظهار الحقول'}</span>
                {showSocialFields ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {showSocialFields && (
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-outline-variant/50 bg-surface-container-low p-4 md:grid-cols-2">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <label key={platform.id} className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-on-surface-variant">
                      {platform.label}
                    </span>
                    <input
                      type="url"
                      dir="ltr"
                      value={socialLinks[platform.id]}
                      onChange={(event) =>
                        handleSocialChange(platform.id, event.target.value)
                      }
                      placeholder={platform.placeholder}
                      className={`w-full rounded-xl border bg-surface-container-lowest px-3 py-2 text-left text-sm text-on-surface outline-none transition-colors focus:border-primary ${
                        fieldErrors[`social_media.${platform.id}`]
                          ? 'border-error'
                          : 'border-outline-variant/70'
                      }`}
                    />
                    {fieldErrors[`social_media.${platform.id}`] && (
                      <span className="text-xs font-semibold text-error">
                        {fieldErrors[`social_media.${platform.id}`]}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
            <p className="mt-2 flex items-center gap-1 text-xs text-on-surface-variant">
              <Info className="h-3.5 w-3.5 text-primary" />
              <span>أضف واحداً على الأقل إن وُجد، بصيغة رابط كامل</span>
            </p>
          </div>

          <div className="border-t border-outline-variant/40 pt-4">
            <label className="flex flex-col gap-1.5" htmlFor="notes">
              <span className="text-sm font-bold text-on-surface">
                ملاحظات إضافية{' '}
                <span className="text-xs font-normal text-on-surface-variant">(اختياري)</span>
              </span>
              <textarea
                id="notes"
                rows={4}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  clearError('description');
                }}
                placeholder="أضف أي تفاصيل أخرى ترغب في مشاركتها..."
                className={`w-full resize-y rounded-xl border bg-surface-container-low p-3 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                  fieldErrors.description ? 'border-error' : 'border-outline-variant/70'
                }`}
              />
              {fieldErrors.description && (
                <span className="text-xs font-semibold text-error">{fieldErrors.description}</span>
              )}
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
