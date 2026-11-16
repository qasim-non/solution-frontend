import React, { useState } from 'react';
import { AlertCircle, Plus, X } from 'lucide-react';
import {
  MAX_TECHNOLOGIES,
  MAX_TECHNOLOGY_LENGTH,
  SUGGESTED_TECHNOLOGIES,
} from '../registrationConfig';

interface TechnologyInputProps {
  value: string[];
  onChange: (technologies: string[]) => void;
  error?: string;
}

export const TechnologyInput: React.FC<TechnologyInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const [draft, setDraft] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const isAtLimit = value.length >= MAX_TECHNOLOGIES;

  const addTechnology = (rawValue: string) => {
    const technology = rawValue.trim();

    if (!technology) {
      return;
    }

    if (technology.length > MAX_TECHNOLOGY_LENGTH) {
      setLocalError(`اسم التقنية يجب ألا يتجاوز ${MAX_TECHNOLOGY_LENGTH} حرفاً.`);
      return;
    }

    if (isAtLimit) {
      setLocalError(`يمكن إضافة ${MAX_TECHNOLOGIES} تقنية كحد أقصى.`);
      return;
    }

    if (
      value.some(
        (item) => item.toLowerCase() === technology.toLowerCase()
      )
    ) {
      setLocalError('هذه التقنية مضافة بالفعل.');
      return;
    }

    onChange([...value, technology]);
    setDraft('');
    setLocalError(null);
  };

  const removeTechnology = (technology: string) => {
    onChange(value.filter((item) => item !== technology));
    setLocalError(null);
  };

  const availableSuggestions = SUGGESTED_TECHNOLOGIES.filter(
    (suggestion) =>
      !value.some((item) => item.toLowerCase() === suggestion.toLowerCase())
  );

  const visibleError = localError ?? error;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-1">
        <span className="text-sm font-bold text-[#191c1e]">
          التقنيات والأدوات
        </span>
        <span className="text-xs font-medium text-[#737686]">
          {value.length} / {MAX_TECHNOLOGIES} تقنية
        </span>
      </div>

      <div className="flex items-stretch gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (localError) {
              setLocalError(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTechnology(draft);
            }
          }}
          disabled={isAtLimit}
          maxLength={MAX_TECHNOLOGY_LENGTH}
          placeholder={
            isAtLimit
              ? 'وصلت إلى الحد الأقصى من التقنيات'
              : 'اكتب اسم التقنية ثم اضغط Enter أو إضافة'
          }
          className="h-12 min-w-0 flex-1 rounded-xl border border-[#c3c6d7]/60 bg-[#f7f9fb] px-4 text-sm text-[#191c1e] outline-none transition-colors placeholder:text-[#737686] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => addTechnology(draft)}
          disabled={isAtLimit || !draft.trim()}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#004ac6] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة</span>
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((technology) => (
            <span
              key={technology}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#004ac6] px-3 py-1.5 text-xs font-semibold text-white"
            >
              <span dir="ltr">{technology}</span>
              <button
                type="button"
                onClick={() => removeTechnology(technology)}
                className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-white/20"
                aria-label={`إزالة ${technology}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {availableSuggestions.length > 0 && !isAtLimit && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#737686]">مقترحة:</span>
          {availableSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTechnology(suggestion)}
              className="inline-flex items-center gap-1 rounded-full bg-[#f2f4f6] px-3 py-1 text-xs font-medium text-[#434655] transition-colors hover:bg-[#dbe1ff] hover:text-[#004ac6]"
            >
              <Plus className="h-3 w-3" />
              <span dir="ltr">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite">
        {visibleError && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#ba1a1a]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{visibleError}</span>
          </p>
        )}
      </div>
    </div>
  );
};
