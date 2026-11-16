import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { REGISTRATION_STEPS } from '../registrationConfig';

interface RegistrationStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const progress = ((currentStep + 1) / REGISTRATION_STEPS.length) * 100;
  const current = REGISTRATION_STEPS[currentStep];

  return (
    <nav
      aria-label="مراحل التسجيل"
      className="bg-[#f2f4f6] px-4 sm:px-6 py-5 border-b border-[#c3c6d7]/30"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#004ac6]">
            بوابة انضمام الكفاءات الهندسية
          </p>
          <p className="text-sm font-bold text-[#191c1e] mt-0.5">
            الخطوة {currentStep + 1} من {REGISTRATION_STEPS.length}:{' '}
            {current.shortTitle}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006242]">
          <ShieldCheck className="w-4 h-4" />
          بياناتك محفوظة ومشفرة
        </span>
      </div>

      <div
        className="mt-4 h-1.5 w-full rounded-full bg-[#dae2fd] overflow-hidden"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={REGISTRATION_STEPS.length}
        aria-valuenow={currentStep + 1}
      >
        <div
          className="h-full rounded-full bg-[#004ac6] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {REGISTRATION_STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;
          const canNavigate = index < currentStep;

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => canNavigate && onSelectStep(index)}
                disabled={!canNavigate}
                aria-current={isActive ? 'step' : undefined}
                className={`flex w-full items-center gap-2.5 rounded-xl p-2.5 text-start transition-colors ${
                  isActive
                    ? 'bg-white shadow-sm ring-1 ring-[#004ac6]/20'
                    : canNavigate
                      ? 'bg-white/70 hover:bg-white cursor-pointer'
                      : 'bg-transparent opacity-70'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isComplete
                      ? 'bg-[#006242] text-white'
                      : isActive
                        ? 'bg-[#004ac6] text-white'
                        : 'bg-[#dae2fd] text-[#434655]'
                  }`}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : step.id}
                </span>

                <span className="flex min-w-0 flex-col">
                  <span
                    className={`text-[10px] font-semibold ${
                      isComplete
                        ? 'text-[#006242]'
                        : isActive
                          ? 'text-[#004ac6]'
                          : 'text-[#737686]'
                    }`}
                  >
                    {isComplete
                      ? 'مكتمل'
                      : isActive
                        ? 'الخطوة الحالية'
                        : 'الخطوة القادمة'}
                  </span>
                  <span
                    className={`truncate text-xs ${
                      isActive
                        ? 'font-bold text-[#004ac6]'
                        : 'font-semibold text-[#191c1e]'
                    }`}
                  >
                    {step.shortTitle}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
