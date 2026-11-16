import React from 'react';
import {
  Check,
  CloudCog,
  Code2,
  Globe,
  Monitor,
  Palette,
  RefreshCw,
  Server,
  Smartphone,
} from 'lucide-react';
import type { DeveloperSpecialization } from '../../../../types/api';
import { MAX_SPECIALIZATIONS } from '../registrationConfig';
import type {
  DeveloperRegistrationFormState,
  FieldErrors,
} from '../registrationForm';
import { TechnologyInput } from '../components/TechnologyInput';

interface SpecializationStepProps {
  specializations: DeveloperSpecialization[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  form: DeveloperRegistrationFormState;
  errors: FieldErrors;
  onPatch: (
    patch: Partial<DeveloperRegistrationFormState>,
    clear?: string | string[]
  ) => void;
}

const getSpecializationIcon = (slug: string) => {
  switch (slug) {
    case 'web':
      return Globe;
    case 'mobile-app':
      return Smartphone;
    case 'desktop':
      return Monitor;
    case 'ui-ux':
      return Palette;
    case 'devops':
      return CloudCog;
    case 'apis':
      return Server;
    default:
      return Code2;
  }
};

export const SpecializationStep: React.FC<SpecializationStepProps> = ({
  specializations,
  loading,
  error,
  onRetry,
  form,
  errors,
  onPatch,
}) => {
  const isAtLimit = form.specializationIds.length >= MAX_SPECIALIZATIONS;

  const toggleSpecialization = (id: number) => {
    const isSelected = form.specializationIds.includes(id);

    if (!isSelected && isAtLimit) {
      return;
    }

    onPatch(
      {
        specializationIds: isSelected
          ? form.specializationIds.filter((item) => item !== id)
          : [...form.specializationIds, id],
      },
      'specialization_ids'
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c3c6d7]/30 pb-3">
          <h3 className="text-sm font-bold text-[#191c1e]">
            مجالات التخصص
          </h3>
          <span className="rounded-full bg-[#f2f4f6] px-3 py-1 text-xs font-semibold text-[#434655]">
            {form.specializationIds.length} / {MAX_SPECIALIZATIONS} محددة
          </span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_item, index) => (
              <div
                key={index}
                className="h-[68px] animate-pulse rounded-xl bg-[#f2f4f6]"
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#ffdad6] px-4 py-3 text-sm font-semibold text-[#ba1a1a]">
            <span>تعذّر تحميل مجالات التخصص.</span>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 underline"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {specializations.map((specialization) => {
              const isSelected = form.specializationIds.includes(
                specialization.id
              );
              const Icon = getSpecializationIcon(specialization.slug);
              const isDisabled = !isSelected && isAtLimit;

              return (
                <button
                  key={specialization.id}
                  type="button"
                  onClick={() => toggleSpecialization(specialization.id)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-start transition-all ${
                    isSelected
                      ? 'border-[#004ac6] bg-[#dbe1ff]/50 ring-2 ring-[#004ac6]/15'
                      : isDisabled
                        ? 'cursor-not-allowed border-[#c3c6d7]/40 bg-[#f7f9fb] opacity-60'
                        : 'border-[#c3c6d7]/60 bg-white hover:border-[#004ac6] hover:bg-[#f7f9fb]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? 'bg-[#004ac6] text-white'
                          : 'bg-[#f2f4f6] text-[#434655]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="truncate text-sm font-bold text-[#191c1e]">
                      {specialization.name}
                    </span>
                  </span>

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-[#004ac6] bg-[#004ac6] text-white'
                        : 'border-[#c3c6d7] bg-white text-transparent'
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {errors.specialization_ids && (
          <p className="text-xs font-semibold text-[#ba1a1a]">
            {errors.specialization_ids}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4 border-t border-[#c3c6d7]/30 pt-6">
        <TechnologyInput
          value={form.technologies}
          onChange={(technologies) =>
            onPatch({ technologies }, 'technologies')
          }
          error={errors.technologies}
        />
      </section>
    </div>
  );
};
