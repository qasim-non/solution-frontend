import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Send,
  Sparkles,
} from 'lucide-react';
import { developerApi } from '../../../api/developers';
import { analytics } from '../../../lib/analytics';
import type { ApiValidationErrorResponse } from '../../../types/api';
import {
  DEVELOPER_RESULT_STORAGE_KEY,
  REGISTRATION_STEPS,
} from './registrationConfig';
import {
  REGISTRATION_OPTIONS_TTL_MS,
  readCachedRegistrationOptions,
  readCachedRegistrationOptionsUpdatedAt,
  writeCachedRegistrationOptions,
} from './registrationOptionsCache';
import {
  buildRegistrationPayload,
  createInitialRegistrationForm,
  firstStepWithError,
  normalizeApiFieldErrors,
  validateAllSteps,
  validateCvFile,
  validatePortfolioFile,
  validateStep,
} from './registrationForm';
import type {
  DeveloperRegistrationFormState,
  FieldErrors,
} from './registrationForm';
import { RegistrationStepper } from './components/RegistrationStepper';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { SpecializationStep } from './steps/SpecializationStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { AttachmentsStep } from './steps/AttachmentsStep';

const LAST_STEP = REGISTRATION_STEPS.length - 1;

export const DeveloperRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<DeveloperRegistrationFormState>(
    createInitialRegistrationForm
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const optionsQuery = useQuery({
    queryKey: ['developer-registration-options'],
    queryFn: async () => {
      const response = await developerApi.getRegistrationOptions();
      writeCachedRegistrationOptions(response.data);
      return response.data;
    },
    // Hydrate from the last successful response so revisiting the form renders
    // instantly and avoids a second lookup round-trip.
    initialData: readCachedRegistrationOptions,
    initialDataUpdatedAt: readCachedRegistrationOptionsUpdatedAt,
    staleTime: REGISTRATION_OPTIONS_TTL_MS,
  });

  const cities = optionsQuery.data?.cities ?? [];
  const specializations = optionsQuery.data?.specializations ?? [];

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const patchForm = (
    patch: Partial<DeveloperRegistrationFormState>,
    clear?: string | string[]
  ) => {
    setForm((previous) => ({ ...previous, ...patch }));

    if (!clear) {
      return;
    }

    const keys = Array.isArray(clear) ? clear : [clear];

    setErrors((previous) => {
      if (!keys.some((key) => previous[key])) {
        return previous;
      }

      const next = { ...previous };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const handleFileChange = (kind: 'cv' | 'portfolio', file: File | null) => {
    if (!file) {
      if (kind === 'cv') {
        patchForm({ cv: null }, 'cv');
      } else {
        patchForm({ portfolio: null }, 'portfolio');
      }
      return;
    }

    const message =
      kind === 'cv' ? validateCvFile(file) : validatePortfolioFile(file);

    if (message) {
      setErrors((previous) => ({ ...previous, [kind]: message }));
      return;
    }

    if (kind === 'cv') {
      patchForm({ cv: file }, 'cv');
    } else {
      patchForm({ portfolio: file }, 'portfolio');
    }
  };

  const handleSubmitError = (error: unknown) => {
    if (!axios.isAxiosError<ApiValidationErrorResponse>(error)) {
      setFormError(
        'تعذّر إرسال الطلب. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
      );
      return;
    }

    const status = error.response?.status;

    if (status === 422) {
      const fieldErrors = normalizeApiFieldErrors(
        error.response?.data?.errors
      );

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        goToStep(firstStepWithError(fieldErrors));
        setFormError('يرجى تصحيح الحقول المحددة ثم إعادة المحاولة.');
        return;
      }
    }

    if (status === 429) {
      const retryAfter = Number(error.response?.headers?.['retry-after']);

      setFormError(
        Number.isFinite(retryAfter) && retryAfter > 0
          ? `تم استلام عدد كبير من الطلبات. يرجى المحاولة بعد ${retryAfter} ثانية.`
          : 'تم استلام عدد كبير من الطلبات من شبكتك. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.'
      );
      return;
    }

    if (status && status >= 500) {
      setFormError(
        'تعذّر إرسال الطلب بسبب خطأ في الخادم. يرجى المحاولة لاحقاً.'
      );
      return;
    }

    setFormError(
      error.response?.data?.message ||
        'تعذّر إرسال الطلب. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
    );
  };

  const handleNext = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFormError(null);

    const stepErrors = validateStep(currentStep, form);

    if (Object.keys(stepErrors).length > 0) {
      setErrors((previous) => ({ ...previous, ...stepErrors }));
      return;
    }

    if (currentStep < LAST_STEP) {
      setErrors({});
      goToStep(currentStep + 1);
      return;
    }

    const allErrors = validateAllSteps(form);

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      goToStep(firstStepWithError(allErrors));
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const response = await developerApi.register(
        buildRegistrationPayload(form),
        setUploadProgress
      );
      const result = response.data;

      sessionStorage.setItem(
        DEVELOPER_RESULT_STORAGE_KEY,
        JSON.stringify(result)
      );

      analytics.event('developer_registration_submitted', {
        specializations_count: form.specializationIds.length,
        technologies_count: form.technologies.length,
        has_cv: Boolean(form.cv),
        has_portfolio: Boolean(form.portfolio),
      });

      navigate('/join-developer/success', { state: { result } });
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const step = REGISTRATION_STEPS[currentStep];

  return (
    <div
      dir="rtl"
      className="relative mx-auto w-full max-w-[1000px] px-4 py-8 md:px-8 md:py-12"
    >
      <div className="pointer-events-none absolute -top-10 right-1/4 -z-10 h-72 w-72 rounded-full bg-[#dbe1ff]/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-8 -z-10 h-64 w-64 rounded-full bg-[#e2dfff]/40 blur-3xl" />

      <div className="overflow-hidden rounded-2xl border border-[#c3c6d7]/40 bg-white shadow-sm">
        <RegistrationStepper
          currentStep={currentStep}
          onSelectStep={goToStep}
        />

        <div className="p-5 md:p-9">
          <header className="mb-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dbe1ff] px-3 py-1 text-xs font-bold text-[#004ac6]">
              <Sparkles className="h-3.5 w-3.5" />
              الخطوة {currentStep + 1} من {REGISTRATION_STEPS.length}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#191c1e] md:text-3xl">
              {step.title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#434655]">
              {step.description}
            </p>
          </header>

          {formError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-2.5 rounded-xl bg-[#ffdad6] p-4 text-sm font-semibold text-[#ba1a1a]"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form
            onSubmit={handleNext}
            noValidate
            className="flex flex-col gap-8"
          >
            {currentStep === 0 && (
              <PersonalInfoStep
                form={form}
                errors={errors}
                cities={cities}
                citiesLoading={optionsQuery.isLoading}
                citiesError={optionsQuery.isError}
                onRetryCities={() => {
                  void optionsQuery.refetch();
                }}
                onPatch={patchForm}
              />
            )}

            {currentStep === 1 && (
              <SpecializationStep
                specializations={specializations}
                loading={optionsQuery.isLoading}
                error={optionsQuery.isError}
                onRetry={() => {
                  void optionsQuery.refetch();
                }}
                form={form}
                errors={errors}
                onPatch={patchForm}
              />
            )}

            {currentStep === 2 && (
              <ExperienceStep
                form={form}
                errors={errors}
                onPatch={patchForm}
              />
            )}

            {currentStep === 3 && (
              <AttachmentsStep
                form={form}
                errors={errors}
                onPatch={patchForm}
                onFileChange={handleFileChange}
              />
            )}

            {isSubmitting && uploadProgress !== null && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#434655]">
                  <span>جارٍ رفع البيانات والمرفقات...</span>
                  <span dir="ltr">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#dae2fd]">
                  <div
                    className="h-full rounded-full bg-[#004ac6] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-[#c3c6d7]/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2f4f6] px-6 py-3 text-sm font-semibold text-[#191c1e] transition-colors hover:bg-[#eceef0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>السابق</span>
                </button>
              ) : (
                <p className="hidden text-xs font-medium text-[#737686] sm:block">
                  لن تُرسل بياناتك إلا عند الضغط على إرسال الطلب.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#004ac6] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#2563eb] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentStep === LAST_STEP ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <ArrowLeft className="h-4 w-4" />
                )}
                <span>
                  {isSubmitting
                    ? 'جارٍ إرسال الطلب...'
                    : currentStep === LAST_STEP
                      ? 'إرسال طلب الانضمام'
                      : 'متابعة'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
