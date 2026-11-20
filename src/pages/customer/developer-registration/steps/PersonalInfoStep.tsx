import React from 'react';
import {
  Bolt,
  ChevronDown,
  Globe,
  MapPin,
  Phone,
  RefreshCw,
  User,
} from 'lucide-react';
import type { City } from '../../../../types/api';
import { COUNTRY_CODES } from '../registrationConfig';
import type {
  DeveloperRegistrationFormState,
  FieldErrors,
} from '../registrationForm';
import { FieldShell } from '../components/FieldShell';
import { ToggleSwitch } from '../components/ToggleSwitch';
import {
  invalidInputClass,
  selectInputClass,
  textInputClass,
} from '../components/formStyles';

interface PersonalInfoStepProps {
  form: DeveloperRegistrationFormState;
  errors: FieldErrors;
  cities: City[];
  citiesLoading: boolean;
  citiesError: boolean;
  onRetryCities: () => void;
  onPatch: (
    patch: Partial<DeveloperRegistrationFormState>,
    clear?: string | string[]
  ) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  form,
  errors,
  cities,
  citiesLoading,
  citiesError,
  onRetryCities,
  onPatch,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <FieldShell
        label="الاسم الكامل"
        htmlFor="developer-full-name"
        required
        error={errors.full_name}
      >
        <div className="relative">
          <input
            id="developer-full-name"
            type="text"
            value={form.fullName}
            onChange={(event) =>
              onPatch({ fullName: event.target.value }, 'full_name')
            }
            placeholder="مثال: محمد أحمد علي الحداد"
            maxLength={255}
            autoComplete="name"
            className={`${textInputClass} ps-11 ${
              errors.full_name ? invalidInputClass : ''
            }`}
          />
          <User className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737686]" />
        </div>
      </FieldShell>

      <FieldShell
        label="رقم الواتساب للتواصل الرسمي"
        htmlFor="developer-mobile"
        required
        error={errors.mobile}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
          <div className="relative sm:col-span-5">
            <select
              value={form.countryCode}
              onChange={(event) =>
                onPatch({ countryCode: event.target.value })
              }
              aria-label="رمز الدولة"
              className={selectInputClass}
            >
              {COUNTRY_CODES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            <Globe className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737686]" />
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737686]" />
          </div>

          <div className="relative sm:col-span-7">
            <input
              id="developer-mobile"
              type="tel"
              inputMode="tel"
              dir="ltr"
              value={form.mobileNumber}
              onChange={(event) =>
                onPatch({ mobileNumber: event.target.value }, 'mobile')
              }
              placeholder="7XX XXX XXXX"
              autoComplete="tel-national"
              className={`${textInputClass} pe-11 text-left ${
                errors.mobile ? invalidInputClass : ''
              }`}
            />
            <Phone className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737686]" />
          </div>
        </div>
      </FieldShell>

      <FieldShell
        label="المدينة / موقع الإقامة"
        htmlFor="developer-city"
        required
        error={errors.city_id}
      >
        <div className="relative">
          <select
            id="developer-city"
            value={form.cityId}
            onChange={(event) =>
              onPatch({ cityId: event.target.value }, 'city_id')
            }
            disabled={citiesLoading || citiesError}
            className={`${selectInputClass} ${
              errors.city_id ? invalidInputClass : ''
            }`}
          >
            <option value="">
              {citiesLoading
                ? 'جارٍ تحميل المدن...'
                : 'اختر المدينة التي تقيم بها حالياً...'}
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <MapPin className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737686]" />
          <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737686]" />
        </div>

        {citiesError && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#ffdad6] px-3.5 py-2.5 text-xs font-semibold text-[#ba1a1a]">
            <span>تعذّر تحميل قائمة المدن</span>
            <button
              type="button"
              onClick={onRetryCities}
              className="inline-flex items-center gap-1 underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              إعادة المحاولة
            </button>
          </div>
        )}
      </FieldShell>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f2f4f6] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#004ac6] shadow-sm">
            <Bolt className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">
              الجاهزية لبدء العمل
            </p>
            <p className="text-xs text-[#434655] mt-0.5">
              هل يمكنك استلام مهام برمجية أو مشاريع جديدة حالياً؟
            </p>
          </div>
        </div>

        <ToggleSwitch
          id="developer-is-ready"
          checked={form.isReady}
          onChange={(checked) => onPatch({ isReady: checked })}
          label="الجاهزية لبدء العمل"
        />
      </div>
    </div>
  );
};
