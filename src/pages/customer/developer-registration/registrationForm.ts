import type {
  DeveloperContractType,
  DeveloperExperienceYears,
  DeveloperRegistrationPayload,
  DeveloperWeeklyHours,
} from '../../../types/api';
import {
  FIELD_TO_STEP,
  MAX_BIO_LENGTH,
  MAX_FILE_SIZE_BYTES,
  MAX_TECHNOLOGIES,
  MAX_TECHNOLOGY_LENGTH,
  REGISTRATION_STEPS,
} from './registrationConfig';

export type FieldErrors = Record<string, string>;

export interface DeveloperRegistrationFormState {
  fullName: string;
  countryCode: string;
  mobileNumber: string;
  cityId: string;
  isReady: boolean;
  specializationIds: number[];
  technologies: string[];
  experienceYears: DeveloperExperienceYears | '';
  hasInstitutionalExperience: boolean | null;
  completedProjectsCount: string;
  contractType: DeveloperContractType | '';
  weeklyHours: DeveloperWeeklyHours | '';
  isRemoteReady: boolean;
  bio: string;
  cv: File | null;
  portfolio: File | null;
}

export const createInitialRegistrationForm = (): DeveloperRegistrationFormState => ({
  fullName: '',
  countryCode: '+967',
  mobileNumber: '',
  cityId: '',
  isReady: true,
  specializationIds: [],
  technologies: [],
  experienceYears: '',
  hasInstitutionalExperience: null,
  completedProjectsCount: '',
  contractType: '',
  weeklyHours: '',
  isRemoteReady: true,
  bio: '',
  cv: null,
  portfolio: null,
});

const mobileDigits = (value: string): string => value.replace(/\D/g, '');

const validateFile = (
  file: File,
  allowedExtensions: string[],
  label: string
): string | null => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `حجم ${label} يتجاوز الحد الأقصى (10 ميجابايت).`;
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (!allowedExtensions.includes(extension)) {
    return `صيغة ${label} غير مدعومة. الصيغ المسموحة: ${allowedExtensions
      .map((item) => item.toUpperCase())
      .join('، ')}.`;
  }

  return null;
};

export const validateCvFile = (file: File): string | null =>
  validateFile(file, ['pdf', 'doc', 'docx'], 'السيرة الذاتية');

export const validatePortfolioFile = (file: File): string | null =>
  validateFile(file, ['pdf', 'zip'], 'ملف الأعمال');

export const validateStep = (
  step: number,
  state: DeveloperRegistrationFormState
): FieldErrors => {
  const errors: FieldErrors = {};

  if (step === 0) {
    const fullName = state.fullName.trim();

    if (!fullName) {
      errors.full_name = 'يرجى إدخال الاسم الكامل.';
    } else if (fullName.length > 255) {
      errors.full_name = 'الاسم يجب ألا يتجاوز 255 حرفاً.';
    }

    const digits = mobileDigits(state.mobileNumber);

    if (!digits) {
      errors.mobile = 'يرجى إدخال رقم الواتساب.';
    } else if (digits.length < 6 || digits.length > 15) {
      errors.mobile = 'يرجى إدخال رقم هاتف صحيح (6 إلى 15 رقماً).';
    }

    if (!state.cityId) {
      errors.city_id = 'يرجى اختيار المدينة.';
    }
  }

  if (step === 1) {
    if (state.technologies.length > MAX_TECHNOLOGIES) {
      errors.technologies = `يمكن إضافة ${MAX_TECHNOLOGIES} تقنية كحد أقصى.`;
    }

    if (
      state.technologies.some((technology) => technology.length > MAX_TECHNOLOGY_LENGTH)
    ) {
      errors.technologies = 'اسم التقنية يجب ألا يتجاوز 255 حرفاً.';
    }
  }

  if (step === 2) {
    if (!state.experienceYears) {
      errors.experience_years = 'يرجى اختيار سنوات الخبرة.';
    }

    if (state.hasInstitutionalExperience === null) {
      errors.has_institutional_experience = 'يرجى تحديد نوع الخبرة السابقة.';
    }

    if (state.completedProjectsCount.trim() !== '') {
      const count = Number(state.completedProjectsCount);

      if (
        !/^\d+$/.test(state.completedProjectsCount.trim()) ||
        !Number.isSafeInteger(count) ||
        count < 0 ||
        count > 4294967295
      ) {
        errors.completed_projects_count =
          'يرجى إدخال عدد صحيح موجب للمشاريع المكتملة.';
      }
    }
  }

  if (step === 3) {
    if (!state.contractType) {
      errors.contract_type = 'يرجى اختيار نوع التعاقد المفضل.';
    }

    if (!state.weeklyHours) {
      errors.weekly_hours = 'يرجى اختيار عدد ساعات التفرغ الأسبوعية.';
    }

    if (state.bio.trim().length > MAX_BIO_LENGTH) {
      errors.bio = `النبذة المهنية يجب ألا تتجاوز ${MAX_BIO_LENGTH} حرفاً.`;
    }

    if (state.cv) {
      const cvError = validateCvFile(state.cv);
      if (cvError) {
        errors.cv = cvError;
      }
    }

    if (state.portfolio) {
      const portfolioError = validatePortfolioFile(state.portfolio);
      if (portfolioError) {
        errors.portfolio = portfolioError;
      }
    }
  }

  return errors;
};

export const validateAllSteps = (
  state: DeveloperRegistrationFormState
): FieldErrors => {
  const merged: FieldErrors = {};

  REGISTRATION_STEPS.forEach((_step, index) => {
    Object.assign(merged, validateStep(index, state));
  });

  return merged;
};

export const firstStepWithError = (errors: FieldErrors): number => {
  let firstStep = 0;
  let found = false;

  Object.keys(errors).forEach((field) => {
    const step = FIELD_TO_STEP[field];

    if (step === undefined) {
      return;
    }

    if (!found || step < firstStep) {
      firstStep = step;
      found = true;
    }
  });

  return firstStep;
};

/**
 * Laravel returns its default English validation messages, while this flow is
 * fully Arabic. The messages a user can realistically trigger are translated
 * here; anything unexpected falls back to the server text instead of being
 * hidden.
 */
const SERVER_MESSAGE_TRANSLATIONS: Record<string, string> = {
  'The mobile has already been taken.':
    'رقم الواتساب هذا مسجل مسبقاً، يرجى استخدام رقم آخر.',
  'The selected city id is invalid.':
    'المدينة المحددة غير صالحة، يرجى اختيار مدينة أخرى.',
  'The selected experience years is invalid.':
    'قيمة سنوات الخبرة المحددة غير صالحة.',
  'The selected contract type is invalid.':
    'نوع التعاقد المحدد غير صالح.',
  'The selected weekly hours is invalid.':
    'عدد ساعات التفرغ المحدد غير صالح.',
};

const translateServerMessage = (message: string): string => {
  if (SERVER_MESSAGE_TRANSLATIONS[message]) {
    return SERVER_MESSAGE_TRANSLATIONS[message];
  }

  if (/must be a file of type/i.test(message)) {
    return 'صيغة الملف غير مدعومة.';
  }

  if (/must have one of the following extensions/i.test(message)) {
    return 'امتداد الملف غير مدعوم.';
  }

  if (/must be a file/i.test(message)) {
    return 'يرجى إرفاق ملف صالح.';
  }

  return message;
};

/**
 * Flattens Laravel's nested keys (e.g. `specialization_ids.0`) onto the field
 * that renders them so errors can be shown beside the right control.
 */
export const normalizeApiFieldErrors = (
  errors?: Record<string, string[]>
): FieldErrors => {
  if (!errors) {
    return {};
  }

  const normalized: FieldErrors = {};

  Object.entries(errors).forEach(([key, messages]) => {
    const field = key.split('.')[0];

    if (!normalized[field]) {
      normalized[field] = messages[0]
        ? translateServerMessage(messages[0])
        : 'قيمة غير صالحة.';
    }
  });

  return normalized;
};

export const buildRegistrationPayload = (
  state: DeveloperRegistrationFormState
): DeveloperRegistrationPayload => {
  const count = state.completedProjectsCount.trim();

  return {
    full_name: state.fullName.trim(),
    mobile: `${state.countryCode}${mobileDigits(state.mobileNumber)}`,
    city_id: Number(state.cityId),
    is_ready: state.isReady,
    experience_years: state.experienceYears as DeveloperExperienceYears,
    has_institutional_experience: state.hasInstitutionalExperience ?? false,
    completed_projects_count: count === '' ? undefined : Number(count),
    contract_type: state.contractType as DeveloperContractType,
    weekly_hours: state.weeklyHours as DeveloperWeeklyHours,
    is_remote_ready: state.isRemoteReady,
    bio: state.bio.trim() || undefined,
    specialization_ids: state.specializationIds.length
      ? state.specializationIds
      : undefined,
    technologies: state.technologies.length ? state.technologies : undefined,
    cv: state.cv,
    portfolio: state.portfolio,
  };
};
