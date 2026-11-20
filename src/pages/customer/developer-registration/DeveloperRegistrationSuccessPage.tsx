import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Home,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import type { DeveloperRegistrationResult } from '../../../types/api';
import { DEVELOPER_RESULT_STORAGE_KEY } from './registrationConfig';

const readStoredResult = (): DeveloperRegistrationResult | null => {
  try {
    const raw = sessionStorage.getItem(DEVELOPER_RESULT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DeveloperRegistrationResult) : null;
  } catch {
    return null;
  }
};

export const DeveloperRegistrationSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [result] = useState<DeveloperRegistrationResult | null>(() => {
    const stateResult = (
      location.state as { result?: DeveloperRegistrationResult } | null
    )?.result;

    if (stateResult) {
      sessionStorage.setItem(
        DEVELOPER_RESULT_STORAGE_KEY,
        JSON.stringify(stateResult)
      );
      return stateResult;
    }

    return readStoredResult();
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!result) {
      navigate('/join-developer', { replace: true });
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(result.reference_number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked (e.g. insecure context). The reference
      // number remains visible so the applicant can copy it manually.
    }
  };

  const startAnotherApplication = () => {
    sessionStorage.removeItem(DEVELOPER_RESULT_STORAGE_KEY);
    navigate('/join-developer');
  };

  const statusLabel =
    result.status === 'pending' ? 'قيد المراجعة' : result.status;

  return (
    <div
      dir="rtl"
      className="relative mx-auto w-full max-w-[1000px] px-4 py-10 md:px-8 md:py-16"
    >
      <div className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-80 w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#dbe1ff]/60 to-transparent blur-3xl" />

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#dbe1ff] bg-white shadow-lg">
          <CheckCircle2 className="h-11 w-11 text-[#006242]" />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#f2f4f6] px-4 py-1.5 text-xs font-semibold text-[#004ac6] shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#006242]" />
          <span>بوابة استقطاب المهندسين البرمجيين</span>
          <span className="text-[#c3c6d7]">•</span>
          <span dir="ltr" className="font-mono font-bold text-[#434655]">
            {result.reference_number}
          </span>
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#191c1e] md:text-4xl">
          تم استلام طلبك بنجاح!
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#434655]">
          شكراً لانضمامك إلى شبكة مطوري «حلول برمجية». سيقوم الفريق الهندسي
          بمراجعة بياناتك والتواصل معك عبر الواتساب فور توفر فرصة تلائم خبرتك
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-12">
        <section className="flex flex-col justify-between rounded-2xl border border-[#c3c6d7]/40 bg-white p-6 shadow-sm md:col-span-7">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[#c3c6d7]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f2f4f6] text-[#004ac6]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h2 className="text-base font-bold text-[#191c1e]">
                  ماذا بعد إرسال الطلب؟
                </h2>
              </div>
              <span className="rounded bg-[#f2f4f6] px-2.5 py-1 text-xs font-medium text-[#434655]">
                الخطوات القادمة
              </span>
            </div>

            <div className="relative mt-5 flex flex-col gap-5">
              <div className="absolute bottom-5 end-5 top-5 w-0.5 bg-[#e6e8ea]" />

              <div className="relative flex items-start gap-3">
                <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#004ac6] text-sm font-bold text-white shadow-sm">
                  1
                </span>
                <div className="pt-0.5">
                  <h3 className="text-sm font-bold text-[#191c1e]">
                    مراجعة الملف التقني
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#434655]">
                    مراجعة نماذج أعمالك ومطابقة خبراتك مع المشاريع الحالية
                    والمستقبلية
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbe1ff] text-sm font-bold text-[#004ac6] shadow-sm">
                  2
                </span>
                <div className="pt-0.5">
                  <h3 className="text-sm font-bold text-[#191c1e]">
                    التواصل عبر الواتساب
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#434655]">
                    سنتواصل معك مباشرة عبر رقم هاتفك فور توفر فرصة عمل أو شراكة
                    مناسبة
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-xl bg-[#f2f4f6] p-3.5 text-xs text-[#434655]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#006242]" />
            <span>
              ملفاتك محفوظة بشكل خاص ولا يتم مشاركتها مع أي جهة خارجية
            </span>
          </div>
        </section>

        <aside className="flex flex-col gap-4 md:col-span-5">
          <div className="rounded-2xl border border-[#c3c6d7]/40 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#191c1e]">
                ملخص بيانات الطلب
              </h2>
              <span className="h-2.5 w-2.5 rounded-full bg-[#006242]" />
            </div>

            <dl className="mt-4 flex flex-col divide-y divide-[#e6e8ea]">
              <div className="flex flex-col gap-1 pb-3">
                <dt className="text-xs text-[#737686]">
                  الرقم المرجعي للملف
                </dt>
                <dd className="flex items-center justify-between gap-2">
                  <span
                    dir="ltr"
                    className="font-mono text-base font-bold tracking-wider text-[#004ac6]"
                  >
                    {result.reference_number}
                  </span>
                  <button
                    type="button"
                    onClick={copyReference}
                    className="inline-flex items-center gap-1 rounded bg-[#f2f4f6] px-2.5 py-1 text-xs font-medium text-[#434655] transition-colors hover:text-[#004ac6]"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[#006242]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </dd>
              </div>

              <div className="flex flex-col gap-1 py-3">
                <dt className="text-xs text-[#737686]">
                  وسيلة التواصل المعتمدة
                </dt>
                <dd className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0fbf5] text-[#006242]">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <span
                    dir="ltr"
                    className="font-mono text-sm font-semibold text-[#191c1e]"
                  >
                    {result.mobile}
                  </span>
                  <span className="text-xs font-semibold text-[#006242]">
                    واتساب
                  </span>
                </dd>
              </div>

              <div className="flex flex-col gap-2 py-3">
                <dt className="text-xs text-[#737686]">
                  المسارات التقنية المستلمة
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {result.specializations.length > 0 ? (
                    result.specializations.map((specialization) => (
                      <span
                        key={specialization}
                        className="rounded-full bg-[#dbe1ff] px-2.5 py-1 text-xs font-semibold text-[#004ac6]"
                      >
                        {specialization}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#737686]">
                      لم يتم تحديد تخصصات
                    </span>
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between pt-3">
                <dt className="text-xs text-[#737686]">حالة المراجعة</dt>
                <dd className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006242]">
                  <CheckCircle2 className="h-4 w-4" />
                  {statusLabel}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-[#c3c6d7]/40 bg-[#f7f9fb] p-4">
            <p className="text-xs font-bold text-[#191c1e]">
              احتفظ بالرقم المرجعي
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#434655]">
              استخدم الرقم المرجعي عند التواصل مع فريق استقطاب الكفاءات
              للاستفسار عن حالة طلبك
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#004ac6] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#2563eb] sm:w-auto"
        >
          <Home className="h-4 w-4" />
          <span>العودة إلى الصفحة الرئيسية</span>
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <button
          type="button"
          onClick={startAnotherApplication}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f2f4f6] px-6 py-3 text-sm font-semibold text-[#191c1e] transition-colors hover:bg-[#eceef0] sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" />
          <span>تسجيل مطور آخر</span>
        </button>
      </div>
    </div>
  );
};
