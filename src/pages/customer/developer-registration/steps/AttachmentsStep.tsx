import React from 'react';
import {
  Briefcase,
  Check,
  Handshake,
  Laptop,
  Wifi,
} from 'lucide-react';
import {
  CONTRACT_TYPE_OPTIONS,
  CV_ACCEPT,
  MAX_BIO_LENGTH,
  PORTFOLIO_ACCEPT,
  WEEKLY_HOURS_OPTIONS,
} from '../registrationConfig';
import type {
  DeveloperRegistrationFormState,
  FieldErrors,
} from '../registrationForm';
import { FieldShell } from '../components/FieldShell';
import { FileDropzone } from '../components/FileDropzone';
import { ToggleSwitch } from '../components/ToggleSwitch';

interface AttachmentsStepProps {
  form: DeveloperRegistrationFormState;
  errors: FieldErrors;
  onPatch: (
    patch: Partial<DeveloperRegistrationFormState>,
    clear?: string | string[]
  ) => void;
  onFileChange: (kind: 'cv' | 'portfolio', file: File | null) => void;
}

const contractIcons = {
  full_time: Briefcase,
  freelance: Laptop,
  both: Handshake,
} as const;

export const AttachmentsStep: React.FC<AttachmentsStepProps> = ({
  form,
  errors,
  onPatch,
  onFileChange,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-b border-[#c3c6d7]/30 pb-3">
          <h3 className="text-sm font-bold text-[#191c1e]">
            الملفات التوثيقية
          </h3>
          <span className="text-xs font-medium text-[#737686]">
            اختيارية لكنها ترفع فرص القبول
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FileDropzone
            id="developer-cv"
            label="السيرة الذاتية (CV)"
            hint="PDF أو DOC أو DOCX"
            accept={CV_ACCEPT}
            file={form.cv}
            error={errors.cv}
            onChange={(file) => onFileChange('cv', file)}
          />

          <FileDropzone
            id="developer-portfolio"
            label="ملف الأعمال (Portfolio)"
            hint="PDF أو ZIP"
            accept={PORTFOLIO_ACCEPT}
            file={form.portfolio}
            error={errors.portfolio}
            onChange={(file) => onFileChange('portfolio', file)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t border-[#c3c6d7]/30 pt-6">
        <h3 className="text-sm font-bold text-[#191c1e]">
          تفضيلات العمل والتفرغ
        </h3>

        <FieldShell
          label="نوع التعاقد والعمل المفضل"
          required
          error={errors.contract_type}
        >
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="نوع التعاقد"
          >
            {CONTRACT_TYPE_OPTIONS.map((option) => {
              const Icon = contractIcons[option.value];
              const isSelected = form.contractType === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() =>
                    onPatch({ contractType: option.value }, 'contract_type')
                  }
                  className={`flex items-start gap-3 rounded-xl border p-4 text-start transition-all ${
                    isSelected
                      ? 'border-[#004ac6] bg-[#dbe1ff]/50 ring-2 ring-[#004ac6]/15'
                      : 'border-[#c3c6d7]/60 bg-white hover:border-[#004ac6]'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected
                        ? 'bg-[#004ac6] text-white'
                        : 'bg-[#f2f4f6] text-[#434655]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-[#191c1e]">
                      {option.label}
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#004ac6]" />
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#434655]">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </FieldShell>

        <FieldShell
          label="عدد ساعات التفرغ الأسبوعية المتوقعة"
          required
          error={errors.weekly_hours}
        >
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="ساعات التفرغ الأسبوعية"
          >
            {WEEKLY_HOURS_OPTIONS.map((option) => {
              const isSelected = form.weeklyHours === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() =>
                    onPatch({ weeklyHours: option.value }, 'weekly_hours')
                  }
                  className={`flex items-center justify-between gap-2 rounded-xl border p-3.5 text-sm transition-all ${
                    isSelected
                      ? 'border-[#004ac6] bg-[#004ac6] font-bold text-white shadow-sm'
                      : 'border-[#c3c6d7]/60 bg-[#f7f9fb] font-medium text-[#434655] hover:border-[#004ac6] hover:bg-white'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </FieldShell>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f2f4f6] p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006242] shadow-sm">
              <Wifi className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#191c1e]">
                الجاهزية للعمل عن بُعد
              </p>
              <p className="text-xs text-[#434655] mt-0.5">
                هل يمكنك العمل عن بُعد بشكل كامل أو جزئي؟
              </p>
            </div>
          </div>

          <ToggleSwitch
            id="developer-remote-ready"
            checked={form.isRemoteReady}
            onChange={(checked) => onPatch({ isRemoteReady: checked })}
            label="الجاهزية للعمل عن بُعد"
          />
        </div>

        <FieldShell
          label="نبذة مهنية سريعة"
          htmlFor="developer-bio"
          hint="اختياري"
          error={errors.bio}
        >
          <textarea
            id="developer-bio"
            rows={4}
            value={form.bio}
            maxLength={MAX_BIO_LENGTH}
            onChange={(event) =>
              onPatch({ bio: event.target.value }, 'bio')
            }
            placeholder="أخبرنا باختصار عن شغفك البرمجي أو ما يميز أسلوبك في العمل..."
            className="w-full resize-y rounded-xl border border-[#c3c6d7]/60 bg-[#f7f9fb] p-4 text-sm text-[#191c1e] outline-none transition-colors placeholder:text-[#737686] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
          />
          <div className="flex justify-end">
            <span
              className={`text-xs font-medium ${
                form.bio.length >= MAX_BIO_LENGTH
                  ? 'text-[#ba1a1a]'
                  : 'text-[#737686]'
              }`}
            >
              {form.bio.length} / {MAX_BIO_LENGTH} حرف
            </span>
          </div>
        </FieldShell>
      </section>
    </div>
  );
};
