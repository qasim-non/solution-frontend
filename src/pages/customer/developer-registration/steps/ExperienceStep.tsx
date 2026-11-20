import React from 'react';
import {
  Building2,
  Check,
  Laptop,
  Layers,
  Minus,
  Plus,
} from 'lucide-react';
import { EXPERIENCE_YEARS_OPTIONS } from '../registrationConfig';
import type {
  DeveloperRegistrationFormState,
  FieldErrors,
} from '../registrationForm';
import { FieldShell } from '../components/FieldShell';

interface ExperienceStepProps {
  form: DeveloperRegistrationFormState;
  errors: FieldErrors;
  onPatch: (
    patch: Partial<DeveloperRegistrationFormState>,
    clear?: string | string[]
  ) => void;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  form,
  errors,
  onPatch,
}) => {
  const adjustProjects = (delta: number) => {
    const current = Number(form.completedProjectsCount) || 0;
    const next = Math.min(4294967295, Math.max(0, current + delta));
    onPatch(
      { completedProjectsCount: String(next) },
      'completed_projects_count'
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <FieldShell
        label="سنوات الخبرة العملية الفعلية"
        required
        error={errors.experience_years}
      >
        <div
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
          role="radiogroup"
          aria-label="سنوات الخبرة"
        >
          {EXPERIENCE_YEARS_OPTIONS.map((option) => {
            const isSelected = form.experienceYears === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  onPatch(
                    { experienceYears: option.value },
                    'experience_years'
                  )
                }
                className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition-all ${
                  isSelected
                    ? 'border-[#004ac6] bg-[#004ac6] font-bold text-white shadow-sm'
                    : 'border-[#c3c6d7]/60 bg-[#f7f9fb] font-medium text-[#434655] hover:border-[#004ac6] hover:bg-white'
                }`}
              >
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </FieldShell>

      <FieldShell
        label="هل سبق لك العمل رسمياً مع شركة برمجية أو جهة عمل مؤسسية؟"
        required
        error={errors.has_institutional_experience}
      >
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="الخبرة المؤسسية"
        >
          <button
            type="button"
            role="radio"
            aria-checked={form.hasInstitutionalExperience === true}
            onClick={() =>
              onPatch(
                { hasInstitutionalExperience: true },
                'has_institutional_experience'
              )
            }
            className={`flex items-start gap-3 rounded-xl border p-4 text-start transition-all ${
              form.hasInstitutionalExperience === true
                ? 'border-[#004ac6] bg-[#dbe1ff]/50 ring-2 ring-[#004ac6]/15'
                : 'border-[#c3c6d7]/60 bg-white hover:border-[#004ac6]'
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                form.hasInstitutionalExperience === true
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#f2f4f6] text-[#434655]'
              }`}
            >
              <Building2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-[#191c1e]">
                نعم، عملت مع شركات أو جهات رسمية
              </span>
              <span className="mt-1 block text-xs text-[#434655]">
                خبرة داخل فرق عمل مؤسسية أو عقود رسمية
              </span>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={form.hasInstitutionalExperience === false}
            onClick={() =>
              onPatch(
                { hasInstitutionalExperience: false },
                'has_institutional_experience'
              )
            }
            className={`flex items-start gap-3 rounded-xl border p-4 text-start transition-all ${
              form.hasInstitutionalExperience === false
                ? 'border-[#004ac6] bg-[#dbe1ff]/50 ring-2 ring-[#004ac6]/15'
                : 'border-[#c3c6d7]/60 bg-white hover:border-[#004ac6]'
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                form.hasInstitutionalExperience === false
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#f2f4f6] text-[#434655]'
              }`}
            >
              <Laptop className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-[#191c1e]">
                لا، عمل حر ومشاريع شخصية فقط
              </span>
              <span className="mt-1 block text-xs text-[#434655]">
                مشاريع مستقلة أو تعاون مباشر مع العملاء
              </span>
            </span>
          </button>
        </div>
      </FieldShell>

      <FieldShell
        label="عدد المشاريع المكتملة التي قمت بتسليمها"
        hint="اختياري"
        error={errors.completed_projects_count}
      >
        <div className="flex flex-col gap-4 rounded-xl bg-[#f2f4f6] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#004ac6] shadow-sm">
              <Layers className="h-5 w-5" />
            </span>
            <p className="text-xs text-[#434655] max-w-sm">
              العدد التقريبي للمشاريع المنجزة أو التي شاركت في بنائها
              وتسليمها
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => adjustProjects(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#434655] shadow-sm transition-colors hover:bg-[#004ac6] hover:text-white"
              aria-label="تقليل عدد المشاريع"
            >
              <Minus className="h-4 w-4" />
            </button>

            <input
              type="number"
              min={0}
              max={4294967295}
              inputMode="numeric"
              value={form.completedProjectsCount}
              onChange={(event) => {
                const value = event.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  onPatch(
                    { completedProjectsCount: value },
                    'completed_projects_count'
                  );
                }
              }}
              placeholder="0"
              className="h-10 w-24 rounded-xl border border-transparent bg-white text-center text-base font-bold text-[#004ac6] outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
              aria-label="عدد المشاريع المكتملة"
            />

            <button
              type="button"
              onClick={() => adjustProjects(1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#434655] shadow-sm transition-colors hover:bg-[#004ac6] hover:text-white"
              aria-label="زيادة عدد المشاريع"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </FieldShell>
    </div>
  );
};
