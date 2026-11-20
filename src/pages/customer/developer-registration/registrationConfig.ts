import type {
  DeveloperContractType,
  DeveloperExperienceYears,
  DeveloperWeeklyHours,
} from '../../../types/api';

export const DEVELOPER_RESULT_STORAGE_KEY =
  'tamkkun_developer_registration_result';

export const MAX_SPECIALIZATIONS = 10;
export const MAX_TECHNOLOGIES = 30;
export const MAX_TECHNOLOGY_LENGTH = 255;
export const MAX_BIO_LENGTH = 400;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export interface RegistrationStep {
  id: number;
  shortTitle: string;
  title: string;
  description: string;
}

export const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    id: 1,
    shortTitle: 'البيانات الشخصية',
    title: 'البيانات الشخصية',
    description: 'أخبرنا ببياناتك الأساسية وطريقة التواصل الرسمية معك',
  },
  {
    id: 2,
    shortTitle: 'التخصص والتقنيات',
    title: 'مجالات التخصص والتقنيات',
    description: 'اختر مجالات تخصصك وأضف التقنيات والأدوات التي تتقنها',
  },
  {
    id: 3,
    shortTitle: 'الخبرة العملية',
    title: 'خبرتك المهنية ومشاريعك السابقة',
    description: 'حدّد مستوى خبرتك ونوعية التجارب التي عملت عليها',
  },
  {
    id: 4,
    shortTitle: 'السيرة والمرفقات',
    title: 'الملفات المرفقة وتفضيلات العمل',
    description: 'أرفق سيرتك الذاتية وحدّد تفضيلات العمل والجاهزية',
  },
];

export const COUNTRY_CODES: { value: string; label: string }[] = [
  { value: '+967', label: 'اليمن (+967)' },
  { value: '+966', label: 'السعودية (+966)' },
  { value: '+971', label: 'الإمارات (+971)' },
  { value: '+968', label: 'عُمان (+968)' },
  { value: '+974', label: 'قطر (+974)' },
  { value: '+973', label: 'البحرين (+973)' },
  { value: '+965', label: 'الكويت (+965)' },
  { value: '+962', label: 'الأردن (+962)' },
  { value: '+20', label: 'مصر (+20)' },
  { value: '+964', label: 'العراق (+964)' },
  { value: '+963', label: 'سوريا (+963)' },
  { value: '+961', label: 'لبنان (+961)' },
  { value: '+970', label: 'فلسطين (+970)' },
  { value: '+249', label: 'السودان (+249)' },
  { value: '+218', label: 'ليبيا (+218)' },
  { value: '+216', label: 'تونس (+216)' },
  { value: '+213', label: 'الجزائر (+213)' },
  { value: '+212', label: 'المغرب (+212)' },
];

export const EXPERIENCE_YEARS_OPTIONS: {
  value: DeveloperExperienceYears;
  label: string;
}[] = [
  { value: 'أقل من سنة', label: 'أقل من سنة' },
  { value: '1 - 2 سنوات', label: '1 - 2 سنوات' },
  { value: '3 - 5 سنوات', label: '3 - 5 سنوات' },
  { value: 'أكثر من 5 سنوات', label: 'أكثر من 5 سنوات' },
];

export const CONTRACT_TYPE_OPTIONS: {
  value: DeveloperContractType;
  label: string;
  description: string;
}[] = [
  {
    value: 'full_time',
    label: 'دوام كامل',
    description: 'التفرغ للعمل مع فريق واحد',
  },
  {
    value: 'freelance',
    label: 'عمل حر',
    description: 'مشاريع مستقلة ومرنة',
  },
  {
    value: 'both',
    label: 'كلاهما',
    description: 'متاح للدوام الكامل والعمل الحر',
  },
];

export const WEEKLY_HOURS_OPTIONS: {
  value: DeveloperWeeklyHours;
  label: string;
}[] = [
  { value: '10_20', label: '10 - 20 ساعة أسبوعياً' },
  { value: '20_30', label: '20 - 30 ساعة أسبوعياً' },
  { value: 'full_time_40', label: 'تفرغ كامل (+40 ساعة)' },
];

export const SUGGESTED_TECHNOLOGIES = [
  'Laravel',
  'React.js',
  'Flutter',
  'Node.js',
  'Docker',
  'Python',
  'Next.js',
  'PostgreSQL',
  'TypeScript',
  'AWS',
];

export const CV_ACCEPT = '.pdf,.doc,.docx';
export const PORTFOLIO_ACCEPT = '.pdf,.zip';

/**
 * Maps every canonical API field name to the step that renders it. Used when a
 * server-side 422 arrives so the form can jump back to the first invalid step.
 */
export const FIELD_TO_STEP: Record<string, number> = {
  full_name: 0,
  mobile: 0,
  city_id: 0,
  is_ready: 0,
  specialization_ids: 1,
  technologies: 1,
  experience_years: 2,
  has_institutional_experience: 2,
  completed_projects_count: 2,
  cv: 3,
  portfolio: 3,
  contract_type: 3,
  weekly_hours: 3,
  is_remote_ready: 3,
  bio: 3,
};
